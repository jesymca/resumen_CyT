'use client';

import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  page2Fields,
  page3Fields,
  getCronogramaFieldPositions,
  page2FormFields,
  page3FormFields,
  dias,
  type FieldPosition,
  type FormFieldDef,
} from '@/lib/pdf-fields';

type FormData = Record<string, string>;

export default function PdfFormApp() {
  const [activeTab, setActiveTab] = useState<'cronograma' | 'actividad' | 'mensual'>('cronograma');
  const [formData, setFormData] = useState<FormData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Wrap text to fit within maxWidth, returns array of lines
  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if (!word) continue;
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Draw justified text within a bounding box
  const drawJustifiedLine = (
    page: any,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    font: any,
    isLastLine: boolean
  ) => {
    if (isLastLine) {
      // Last line of a paragraph: left-aligned
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      return;
    }

    // Justify: distribute extra space between words
    const words = text.split(/\s+/);
    if (words.length <= 1) {
      page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
      return;
    }

    const totalTextWidth = font.widthOfTextAtSize(text, fontSize);
    const extraSpace = maxWidth - totalTextWidth;
    const spaceCount = words.length - 1;
    const normalSpaceWidth = font.widthOfTextAtSize(' ', fontSize);
    const justifiedSpaceWidth = normalSpaceWidth + extraSpace / spaceCount;

    let currentX = x;
    for (let i = 0; i < words.length; i++) {
      page.drawText(words[i], {
        x: currentX,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      if (i < words.length - 1) {
        currentX += font.widthOfTextAtSize(words[i], fontSize) + justifiedSpaceWidth;
      }
    }
  };

  const fillPdfField = (
    page: any,
    field: FieldPosition,
    value: string,
    font: any,
    pdfDoc: PDFDocument
  ) => {
    if (!value.trim()) return;

    if (field.multiline) {
      const lines = wrapText(value, field.width, font, field.fontSize);
      const lineHeight = field.fontSize + 3;
      const maxLines = field.maxLines || 3;
      const visibleLines = lines.slice(0, maxLines);

      visibleLines.forEach((line, idx) => {
        const isLastLine = idx === visibleLines.length - 1;
        drawJustifiedLine(page, line, field.x, field.y - idx * lineHeight, field.width, field.fontSize, font, isLastLine);
      });
    } else {
      // Single line: left-aligned within the right column
      page.drawText(value, {
        x: field.x,
        y: field.y,
        size: field.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
  };

  const generatePdf = async () => {
    setIsGenerating(true);
    setSuccessMsg('');

    try {
      const pdfBytes = await fetch('/formatos.pdf').then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      // Fill Cronograma (Page 1)
      const cronoFields = getCronogramaFieldPositions();
      const page0 = pages[0];
      for (const [key, field] of Object.entries(cronoFields)) {
        const value = formData[key] || '';
        if (value.trim()) {
          fillPdfField(page0, field, value, font, pdfDoc);
        }
      }

      // Fill Reporte de la Actividad (Page 2)
      const page1 = pages[1];
      for (const [key, field] of Object.entries(page2Fields)) {
        const value = formData[key] || '';
        if (value.trim()) {
          fillPdfField(page1, field, value, font, pdfDoc);
        }
      }

      // Fill Reporte Mensual (Page 3)
      const page2 = pages[2];
      for (const [key, field] of Object.entries(page3Fields)) {
        const value = formData[key] || '';
        if (value.trim()) {
          fillPdfField(page2, field, value, font, pdfDoc);
        }
      }

      // Save and download
      const filledPdfBytes = await pdfDoc.save();
      const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formatos_lleno.pdf';
      link.click();
      URL.revokeObjectURL(url);

      setSuccessMsg('PDF generado exitosamente. La descarga comenzó automáticamente.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intente nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    if (confirm('¿Está seguro que desea limpiar todos los campos?')) {
      setFormData({});
    }
  };

  const renderFormField = (field: FormFieldDef) => {
    const value = formData[field.key] || '';
    return (
      <div className="mb-3" key={field.key}>
        <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
          {field.label}
        </label>
        {field.type === 'textarea' ? (
          <textarea
            className="form-control"
            rows={3}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        ) : (
          <input
            type={field.type}
            className="form-control"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        )}
      </div>
    );
  };

  // Column labels matching the PDF structure (4 activity columns, NO Observaciones)
  const cronoColLabels = ['Actividad 1', 'Actividad 2', 'Actividad 3', 'Actividad 4'];

  const renderCronogramaTab = () => (
    <div className="table-responsive">
      <p className="text-muted mb-3">
        Ingrese las actividades para cada día de la semana. El cronograma tiene 4 columnas de actividades por día.
      </p>
      <table className="table table-bordered align-middle" style={{ fontSize: '0.82rem' }}>
        <thead className="table-light">
          <tr>
            <th style={{ width: '95px', minWidth: '85px' }}>Día</th>
            {cronoColLabels.map((label) => (
              <th key={label} style={{ minWidth: '100px' }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dias.map((day, rowIdx) => (
            <tr key={day}>
              <td className="fw-bold text-center align-middle bg-light" style={{ fontSize: '0.75rem' }}>{day}</td>
              {[0, 1, 2, 3].map((col) => {
                const key = `crono_${rowIdx}_${col}`;
                return (
                  <td key={col}>
                    <textarea
                      className="form-control form-control-sm border-0 shadow-none"
                      placeholder="Actividad..."
                      value={formData[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      style={{ fontSize: '0.78rem', resize: 'none', minHeight: '50px' }}
                      rows={2}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderActividadTab = () => (
    <div>
      <p className="text-muted mb-3">
        Complete los campos del Reporte de la Actividad. Los datos se escribirán en la columna blanca de la derecha, siguiendo el mismo orden que las etiquetas de la izquierda.
      </p>
      <div className="row">
        <div className="col-md-6">
          {page2FormFields.slice(0, 7).map(renderFormField)}
        </div>
        <div className="col-md-6">
          {page2FormFields.slice(7, 13).map(renderFormField)}
        </div>
      </div>
      <hr />
      {page2FormFields.slice(13).map(renderFormField)}
    </div>
  );

  const renderMensualTab = () => (
    <div>
      <p className="text-muted mb-3">
        Complete los campos del Reporte Mensual. Los datos se escribirán en la columna blanca de la derecha.
      </p>
      <div className="row">
        <div className="col-md-6">
          {page3FormFields.slice(0, 6).map(renderFormField)}
        </div>
        <div className="col-md-6">
          {page3FormFields.slice(6).map(renderFormField)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100" style={{ background: '#f0f2f5' }}>
      {/* Header */}
      <nav className="navbar navbar-dark shadow-sm" style={{ background: 'linear-gradient(135deg, #1a5276, #2980b9)' }}>
        <div className="container">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg>
            Llenador de PDF - Plan Cronograma de Trabajo
          </span>
          <span className="text-white-50" style={{ fontSize: '0.85rem' }}>
            Ministerio del Poder Popular para Ciencia, Tecnología e Innovación
          </span>
        </div>
      </nav>

      <div className="container py-4">
        {/* Instructions Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3">
            <div className="d-flex align-items-start gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                   style={{ width: '40px', height: '40px', background: '#e8f4fd' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2980b9" className="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <div>
                <h6 className="mb-1 fw-bold" style={{ color: '#1a5276' }}>¿Cómo funciona?</h6>
                <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                  Seleccione la pestaña del formulario que desea llenar, complete los campos requeridos y luego
                  presione <strong>&quot;Generar PDF&quot;</strong> para descargar el PDF con todos los datos ingresados.
                  Puede llenar uno, dos o los tres formularios a la vez. Los textos largos se justifican automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="alert alert-success d-flex align-items-center shadow-sm mb-4" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {successMsg}
          </div>
        )}

        <div className="row g-4">
          {/* Form Panel */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white p-0">
                <ul className="nav nav-tabs card-header-tabs" role="tablist">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'cronograma' ? 'active fw-bold' : ''}`}
                      onClick={() => setActiveTab('cronograma')}
                      style={activeTab === 'cronograma' ? { color: '#1a5276', borderBottomColor: '#2980b9' } : {}}
                    >
                      Cronograma
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'actividad' ? 'active fw-bold' : ''}`}
                      onClick={() => setActiveTab('actividad')}
                      style={activeTab === 'actividad' ? { color: '#1a5276', borderBottomColor: '#2980b9' } : {}}
                    >
                      Reporte de Actividad
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'mensual' ? 'active fw-bold' : ''}`}
                      onClick={() => setActiveTab('mensual')}
                      style={activeTab === 'mensual' ? { color: '#1a5276', borderBottomColor: '#2980b9' } : {}}
                    >
                      Reporte Mensual
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'cronograma' && renderCronogramaTab()}
                {activeTab === 'actividad' && renderActividadTab()}
                {activeTab === 'mensual' && renderMensualTab()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Action Buttons */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#1a5276' }}>Acciones</h6>
                <button
                  className="btn btn-lg w-100 mb-2 text-white"
                  onClick={generatePdf}
                  disabled={isGenerating}
                  style={{
                    background: isGenerating ? '#95a5a6' : 'linear-gradient(135deg, #27ae60, #2ecc71)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-download me-2" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                      </svg>
                      Generar PDF
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={resetForm}
                  style={{ fontSize: '0.9rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise me-2" viewBox="0 0 16 16">
                    <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.418A6 6 0 1 0 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                  </svg>
                  Limpiar Formulario
                </button>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3" style={{ color: '#1a5276' }}>Resumen de Campos</h6>
                {(() => {
                  const cronoFields = getCronogramaFieldPositions();
                  const cronoFilled = Object.keys(cronoFields).filter((k) => formData[k]?.trim()).length;
                  const cronoTotal = Object.keys(cronoFields).length;
                  const actFilled = Object.keys(page2Fields).filter((k) => formData[k]?.trim()).length;
                  const actTotal = Object.keys(page2Fields).length;
                  const menFilled = Object.keys(page3Fields).filter((k) => formData[k]?.trim()).length;
                  const menTotal = Object.keys(page3Fields).length;

                  return (
                    <div>
                      <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                        <span>Cronograma</span>
                        <span className="badge bg-light text-dark">{cronoFilled}/{cronoTotal}</span>
                      </div>
                      <div className="progress mb-2" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${(cronoFilled / cronoTotal) * 100}%`, background: '#2980b9' }} />
                      </div>

                      <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                        <span>Reporte Actividad</span>
                        <span className="badge bg-light text-dark">{actFilled}/{actTotal}</span>
                      </div>
                      <div className="progress mb-2" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${(actFilled / actTotal) * 100}%`, background: '#27ae60' }} />
                      </div>

                      <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                        <span>Reporte Mensual</span>
                        <span className="badge bg-light text-dark">{menFilled}/{menTotal}</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${(menFilled / menTotal) * 100}%`, background: '#e67e22' }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* PDF Preview Info */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-2" style={{ color: '#1a5276' }}>Contenido del PDF</h6>
                <div className="list-group list-group-flush" style={{ fontSize: '0.85rem' }}>
                  <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-pill" style={{ background: '#2980b9' }}>Pág 1</span>
                    Cronograma Semanal
                  </div>
                  <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-pill" style={{ background: '#27ae60' }}>Pág 2</span>
                    Reporte de la Actividad
                  </div>
                  <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-pill" style={{ background: '#e67e22' }}>Pág 3</span>
                    Reporte Mensual
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 mt-4" style={{ background: '#1a5276', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
        Llenador de PDF — Plan Cronograma de Trabajo — Mincyt
      </footer>
    </div>
  );
}
