---
Task ID: 1
Agent: Main
Task: Fix Cronograma field positions - remove Observaciones column, correct data placement

Work Log:
- Analyzed PDF page 1 structure using pdfplumber edge/line detection
- Used VLM (vision model) to verify the table has only 4 data columns, NOT 5
- Confirmed that the area from x=448.5 to x=545.0 is a decorative flag graphic, not an "Observaciones" column
- Verified cell coordinates by generating test PDF with red rectangles and position markers
- VLM confirmed all test text placed correctly inside white data cells
- Removed the Observaciones column from pdf-fields.ts (cronoColumns array)
- Updated PdfFormApp.tsx: removed Observaciones from UI, changed to 4 columns with textarea inputs
- Changed cronograma cells from single-line (input) to multiline (textarea) for better UX
- Updated fontSize from 7.5 to 8, added multiline support with maxLines calculation

Stage Summary:
- Key fix: The Observaciones column was incorrectly mapped to the decorative flag area (x=448.5 to x=545.0)
- The cronograma table only has 4 activity columns: x=175.5 to x=448.5
- Cell positions verified correct via VLM analysis of test PDF
- Reporte de Actividad (page 2) and Reporte Mensual (page 3) remain unchanged (working correctly)
