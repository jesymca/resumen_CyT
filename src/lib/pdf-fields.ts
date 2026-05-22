// Field position mappings for the PDF
// Coordinates are in PDF-lib coordinate system (origin at bottom-left, y increases upward)
// Page dimensions: 612 x 792 (US Letter)
// Conversion: pdfLib_y = 792 - pdfplumber_y

export interface FieldPosition {
  x: number;
  y: number; // baseline y in pdf-lib coords (from bottom)
  width: number;
  height: number;
  fontSize: number;
  page: number; // 0-indexed
  multiline?: boolean;
  maxLines?: number;
}

// ============================================================
// PAGE 1: CRONOGRAMA - Plan de Trabajo
// ============================================================
// Table structure:
//   Day labels column: x=135.5 to x=152.3 (rotated text)
//   Activity columns: x=175.5 to x=545.0
//     Col 0: x=175.5 to x=242.2 (width=66.7)
//     Col 1: x=242.2 to x=310.4 (width=68.2)
//     Col 2: x=310.4 to x=378.2 (width=67.8)
//     Col 3: x=378.2 to x=448.5 (width=70.3)
//     Col 4: x=448.5 to x=545.0 (width=96.5) - "Observaciones"
//
// Day rows (pdfplumber y coords, top to bottom = DOMINGO to LUNES):
//   Row 0 (DOMINGO):  y=71.9  to y=161.5
//   Row 1 (SÁBADO):   y=161.5 to y=247.6
//   Row 2 (VIERNES):  y=247.6 to y=335.1
//   Row 3 (JUEVES):   y=335.1 to y=422.6
//   Row 4 (MIÉRCOLES): y=422.6 to y=519.3
//   Row 5 (MARTES):   y=519.3 to y=606.8
//   Row 6 (LUNES):    y=606.8 to y=695.0

export const dias = ['DOMINGO', 'SÁBADO', 'VIERNES', 'JUEVES', 'MIÉRCOLES', 'MARTES', 'LUNES'];

// Column definitions: [label, xStart, xEnd]
const cronoColumns = [
  { label: 'Actividad 1', xStart: 175.5, xEnd: 242.2 },
  { label: 'Actividad 2', xStart: 242.2, xEnd: 310.4 },
  { label: 'Actividad 3', xStart: 310.4, xEnd: 378.2 },
  { label: 'Actividad 4', xStart: 378.2, xEnd: 448.5 },
  { label: 'Observaciones', xStart: 448.5, xEnd: 545.0 },
];

// Row boundaries (pdfplumber top y-coords)
const cronoRowTops = [71.9, 161.5, 247.6, 335.1, 422.6, 519.3, 606.8];
const cronoRowBottoms = [161.5, 247.6, 335.1, 422.6, 519.3, 606.8, 695.0];

export function getCronogramaFieldPositions(): Record<string, FieldPosition> {
  const fields: Record<string, FieldPosition> = {};

  dias.forEach((day, rowIdx) => {
    const topY = cronoRowTops[rowIdx];
    const bottomY = cronoRowBottoms[rowIdx];

    cronoColumns.forEach((col, colIdx) => {
      // Text starts a few points right of the left edge of the cell
      const textX = col.xStart + 3;
      // Baseline: a few points above the bottom of the cell
      const baselinePdfplumber = bottomY - 6;
      const baselinePdflib = 792 - baselinePdfplumber;
      const cellWidth = col.xEnd - col.xStart - 6; // 3px padding each side

      fields[`crono_${rowIdx}_${colIdx}`] = {
        x: textX,
        y: baselinePdflib,
        width: cellWidth,
        height: 12,
        fontSize: 7.5,
        page: 0,
      };
    });
  });

  return fields;
}

// ============================================================
// PAGE 2: REPORTE DE LA ACTIVIDAD
// ============================================================
// Table structure: two-column layout
//   Left column (labels): x=67 to x=229
//   Right column (fill-in): x=229 to x=526
//
// Row boundaries (pdfplumber y coords):
const page2RowBoundaries = [
  202.3, // top
  222.6, // below Nombre
  240.4, // below Cédula
  257.2, // below Municipio
  275.5, // below Comuna
  287.7, // separator
  308.5, // below Comuna Vinculada
  327.8, // below Promotores Registrado
  344.0, // below Promotores Jornada
  362.8, // below Total Promotores
  375.0, // separator
  391.8, // below Cantidad GMCTI
  411.6, // below Cantidad Comuna
  428.8, // below Hombres
  447.6, // below Mujeres
  459.8, // separator
  482.2, // below Entes Mincyt
  528.9, // below Objetivo
  612.2, // below Agenda
  687.9, // below Acuerdos
  695.0, // bottom
];

// Helper: compute baseline y in pdf-lib coords, a few points above the bottom of the cell
function rowBaseline(rowIndex: number): number {
  const bottomY = page2RowBoundaries[rowIndex + 1];
  return 792 - (bottomY - 5);
}

// Right column positioning
const p2_rightX = 234; // a few px right of divider at x=229
const p2_rightWidth = 526 - 234; // ~292 points
const p2_fullX = 72; // for full-width fields (multiline below Entes)
const p2_fullWidth = 526 - 72; // ~454 points

export const page2Fields: Record<string, FieldPosition> = {
  nombreResponsable: {
    x: p2_rightX, y: rowBaseline(0), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  cedulaIdentidad: {
    x: p2_rightX, y: rowBaseline(1), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  municipio: {
    x: p2_rightX, y: rowBaseline(2), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  comunaCircuito: {
    x: p2_rightX, y: rowBaseline(3), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  comunaVinculada: {
    x: p2_rightX, y: rowBaseline(5), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  promotoresRegistrado: {
    x: p2_rightX, y: rowBaseline(6), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  promotoresJornada: {
    x: p2_rightX, y: rowBaseline(7), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  totalPromotores: {
    x: p2_rightX, y: rowBaseline(8), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  cantidadParticipantesGMCTI: {
    x: p2_rightX, y: rowBaseline(10), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  cantidadParticipantesComuna: {
    x: p2_rightX, y: rowBaseline(11), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  hombres: {
    x: p2_rightX, y: rowBaseline(12), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  mujeres: {
    x: p2_rightX, y: rowBaseline(13), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  entesMincyt: {
    x: p2_rightX, y: rowBaseline(15), width: p2_rightWidth, height: 16, fontSize: 9, page: 1,
  },
  objetivoActividad: {
    x: p2_rightX, y: 792 - (528.9 - 5), width: p2_rightWidth, height: 40, fontSize: 8, page: 1, multiline: true, maxLines: 3,
  },
  agenda: {
    x: p2_rightX, y: 792 - (612.2 - 5), width: p2_rightWidth, height: 75, fontSize: 8, page: 1, multiline: true, maxLines: 6,
  },
  acuerdos: {
    x: p2_rightX, y: 792 - (687.9 - 5), width: p2_rightWidth, height: 68, fontSize: 8, page: 1, multiline: true, maxLines: 5,
  },
};

// ============================================================
// PAGE 3: REPORTE MENSUAL
// ============================================================
// Table structure: two-column layout
//   Left column (labels): x=42 to x=232
//   Right column (fill-in): x=232 to x=583
//
// Row boundaries (pdfplumber y coords):
const page3RowBoundaries = [
  254.2, // top
  278.1, // below Nombre
  299.1, // below Cédula
  318.8, // below Municipio
  340.4, // below Comuna
  354.8, // separator
  379.3, // below Comunas Vinculadas
  402.1, // below Promotores Jornadas
  416.4, // separator
  436.2, // below Cantidad Actividades
  459.5, // below Cantidad Participantes
  479.9, // below Hombres
  502.0, // below Mujeres
  516.4, // separator
  542.8, // below Entes Mincyt
  543.4, // bottom
];

function row3Baseline(rowIndex: number): number {
  const bottomY = page3RowBoundaries[rowIndex + 1];
  return 792 - (bottomY - 5);
}

const p3_rightX = 237; // a few px right of divider at x=232
const p3_rightWidth = 583 - 237; // ~346 points

export const page3Fields: Record<string, FieldPosition> = {
  nombreResponsableMensual: {
    x: p3_rightX, y: row3Baseline(0), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  cedulaIdentidadMensual: {
    x: p3_rightX, y: row3Baseline(1), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  municipioMensual: {
    x: p3_rightX, y: row3Baseline(2), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  comunaCircuitoMensual: {
    x: p3_rightX, y: row3Baseline(3), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  comunasVinculadas: {
    x: p3_rightX, y: row3Baseline(5), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  promotoresJornadas: {
    x: p3_rightX, y: row3Baseline(6), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  cantidadActividades: {
    x: p3_rightX, y: row3Baseline(8), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  cantidadParticipantesComunaMensual: {
    x: p3_rightX, y: row3Baseline(9), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  hombresMensual: {
    x: p3_rightX, y: row3Baseline(10), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  mujeresMensual: {
    x: p3_rightX, y: row3Baseline(11), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
  entesMincytMensual: {
    x: p3_rightX, y: row3Baseline(13), width: p3_rightWidth, height: 16, fontSize: 9, page: 2,
  },
};

// ============================================================
// Form field definitions for the UI
// ============================================================
export interface FormFieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  placeholder?: string;
}

export const page2FormFields: FormFieldDef[] = [
  { key: 'nombreResponsable', label: 'Nombre y Apellido - Responsable', type: 'text', placeholder: 'Ingrese nombre y apellido' },
  { key: 'cedulaIdentidad', label: 'Cédula de Identidad', type: 'text', placeholder: 'Ej: V-12345678' },
  { key: 'municipio', label: 'Municipio', type: 'text', placeholder: 'Ingrese el municipio' },
  { key: 'comunaCircuito', label: 'Comuna o Circuito Comunal', type: 'text', placeholder: 'Ingrese la comuna o circuito' },
  { key: 'comunaVinculada', label: 'Comuna Vinculada', type: 'text', placeholder: 'Ingrese la comuna vinculada' },
  { key: 'promotoresRegistrado', label: 'Promotores Registrados', type: 'number', placeholder: '0' },
  { key: 'promotoresJornada', label: 'Promotores Registrados en la Jornada', type: 'number', placeholder: '0' },
  { key: 'totalPromotores', label: 'Total de Promotores en la Comuna', type: 'number', placeholder: '0' },
  { key: 'cantidadParticipantesGMCTI', label: 'Cantidad de Participantes de la GMCTI', type: 'number', placeholder: '0' },
  { key: 'cantidadParticipantesComuna', label: 'Cantidad de Participantes en la Comuna', type: 'number', placeholder: '0' },
  { key: 'hombres', label: 'Hombres', type: 'number', placeholder: '0' },
  { key: 'mujeres', label: 'Mujeres', type: 'number', placeholder: '0' },
  { key: 'entesMincyt', label: 'Entes Mincyt que participaron', type: 'text', placeholder: 'Ingrese los entes participantes' },
  { key: 'objetivoActividad', label: 'Objetivo de la Actividad', type: 'textarea', placeholder: 'Describa el objetivo de la actividad...' },
  { key: 'agenda', label: 'Agenda', type: 'textarea', placeholder: 'Describa la agenda de la actividad...' },
  { key: 'acuerdos', label: 'Acuerdos', type: 'textarea', placeholder: 'Describa los acuerdos alcanzados...' },
];

export const page3FormFields: FormFieldDef[] = [
  { key: 'nombreResponsableMensual', label: 'Nombre y Apellido - Responsable', type: 'text', placeholder: 'Ingrese nombre y apellido' },
  { key: 'cedulaIdentidadMensual', label: 'Cédula de Identidad', type: 'text', placeholder: 'Ej: V-12345678' },
  { key: 'municipioMensual', label: 'Municipio', type: 'text', placeholder: 'Ingrese el municipio' },
  { key: 'comunaCircuitoMensual', label: 'Comuna o Circuito Comunal', type: 'text', placeholder: 'Ingrese la comuna o circuito' },
  { key: 'comunasVinculadas', label: 'Comunas Vinculadas', type: 'text', placeholder: 'Ingrese las comunas vinculadas' },
  { key: 'promotoresJornadas', label: 'Promotores Registrados en las Jornadas', type: 'number', placeholder: '0' },
  { key: 'cantidadActividades', label: 'Cantidad de actividades', type: 'number', placeholder: '0' },
  { key: 'cantidadParticipantesComunaMensual', label: 'Cantidad de Participantes en la Comuna', type: 'number', placeholder: '0' },
  { key: 'hombresMensual', label: 'Hombres', type: 'number', placeholder: '0' },
  { key: 'mujeresMensual', label: 'Mujeres', type: 'number', placeholder: '0' },
  { key: 'entesMincytMensual', label: 'Entes Mincyt que participaron', type: 'text', placeholder: 'Ingrese los entes participantes' },
];
