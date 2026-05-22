// Field position mappings for the PDF
// Coordinates are in PDF-lib coordinate system (origin at bottom-left, y increases upward)
// Page dimensions: 612 x 792 (US Letter)

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

// Page 2: Reporte de la Actividad
// Table starts at x=67, right column starts at x=232
// Horizontal lines in pdfplumber coords (from top), convert: pdfLib_y = 792 - pdfplumber_y
export const page2Fields: Record<string, FieldPosition> = {
  nombreResponsable: {
    x: 235, y: 792 - 222.6 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  cedulaIdentidad: {
    x: 235, y: 792 - 240.4 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  municipio: {
    x: 235, y: 792 - 257.2 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  comunaCircuito: {
    x: 235, y: 792 - 275.5 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  comunaVinculada: {
    x: 235, y: 792 - 308.5 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  promotoresRegistrado: {
    x: 235, y: 792 - 327.8 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  promotoresJornada: {
    x: 235, y: 792 - 344.0 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  totalPromotores: {
    x: 235, y: 792 - 362.8 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  cantidadParticipantesGMCTI: {
    x: 235, y: 792 - 391.8 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  cantidadParticipantesComuna: {
    x: 235, y: 792 - 411.6 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  hombres: {
    x: 235, y: 792 - 428.8 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  mujeres: {
    x: 235, y: 792 - 447.6 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  entesMincyt: {
    x: 235, y: 792 - 482.2 + 3, width: 285, height: 16, fontSize: 10, page: 1,
  },
  objetivoActividad: {
    x: 70, y: 792 - 528.9 + 3, width: 450, height: 40, fontSize: 9, page: 1, multiline: true, maxLines: 3,
  },
  agenda: {
    x: 70, y: 792 - 612.2 + 3, width: 450, height: 70, fontSize: 9, page: 1, multiline: true, maxLines: 5,
  },
  acuerdos: {
    x: 70, y: 792 - 687.9 + 3, width: 450, height: 60, fontSize: 9, page: 1, multiline: true, maxLines: 4,
  },
};

// Page 3: Reporte Mensual
// Table starts at x=42, right column at x=234
export const page3Fields: Record<string, FieldPosition> = {
  nombreResponsableMensual: {
    x: 238, y: 792 - 278.1 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  cedulaIdentidadMensual: {
    x: 238, y: 792 - 299.1 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  municipioMensual: {
    x: 238, y: 792 - 318.8 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  comunaCircuitoMensual: {
    x: 238, y: 792 - 340.4 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  comunasVinculadas: {
    x: 238, y: 792 - 379.3 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  promotoresJornadas: {
    x: 238, y: 792 - 402.1 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  cantidadActividades: {
    x: 238, y: 792 - 436.2 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  cantidadParticipantesComunaMensual: {
    x: 238, y: 792 - 459.5 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  hombresMensual: {
    x: 238, y: 792 - 479.9 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  mujeresMensual: {
    x: 238, y: 792 - 502.0 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
  entesMincytMensual: {
    x: 238, y: 792 - 542.8 + 3, width: 338, height: 16, fontSize: 10, page: 2,
  },
};

// Page 1: Cronograma - weekly schedule
// 7 days (LUNES through DOMINGO), each with activity cells
// Table grid: x starts at ~175, days go from y~72 down to ~690
// 4 columns of activities per day
export interface CronogramaCell {
  day: string;
  col: number; // 0-3
  row: number; // 0-6 for the 7 days
}

export const dias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

// Day Y ranges (pdfplumber top coords for each day's row)
// Approximate row boundaries based on word positions and table bbox
const dayRowTops = [628.9, 535.8, 432.7, 353.7, 263.3, 177.5, 84.3]; // pdfplumber y (top of day label)
const dayRowBottoms = [710, 628.9, 535.8, 432.7, 353.7, 263.3, 177.5]; // approximate

// Column x ranges for the 4 activity columns
// Table 1 bbox: x from 175.2 to 448.7 → width 273.5 / 4 cols ≈ 68.4 each
const colStarts = [178, 246, 314, 382];
const colWidth = 62;

export function getCronogramaFieldPositions(): Record<string, FieldPosition> {
  const fields: Record<string, FieldPosition> = {};
  
  dias.forEach((day, rowIdx) => {
    for (let col = 0; col < 4; col++) {
      const top = dayRowTops[rowIdx];
      const bottom = dayRowBottoms[rowIdx];
      const midY = (top + bottom) / 2;
      
      fields[`crono_${rowIdx}_${col}`] = {
        x: colStarts[col],
        y: 792 - midY + 3,
        width: colWidth,
        height: 14,
        fontSize: 8,
        page: 0,
      };
    }
  });
  
  return fields;
}

// Form field definitions for the UI
export interface FormFieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  placeholder?: string;
  section?: string;
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
