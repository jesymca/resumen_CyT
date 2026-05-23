# Llenador de PDF - Reportes Mincyt

Sistema para llenar los campos vacíos del PDF de reportes del Ministerio del Poder Popular para Ciencia, Tecnología e Innovación.

## Requisitos previos

Necesitas tener instalado **Node.js** (versión 18 o superior) en tu computadora.

### ¿Cómo instalar Node.js?

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue los pasos
4. Verifica la instalación abriendo una terminal y escribiendo:
   ```
   node --version
   ```
   Debería mostrar algo como `v18.x.x` o superior

## Instrucciones de uso

### 1. Abrir una terminal en la carpeta del proyecto

- **Windows**: Haz clic derecho en la carpeta del proyecto y selecciona "Abrir en Terminal" o "Abrir PowerShell aquí"
- **Mac**: Abre Terminal, escribe `cd ` y arrastra la carpeta al terminal
- **Linux**: Abre una terminal y navega a la carpeta con `cd`

### 2. Instalar las dependencias

```bash
npm install
```

Esto descargará todos los paquetes necesarios. Puede tardar un par de minutos la primera vez.

### 3. Iniciar la aplicación

```bash
npm run dev
```

Verás un mensaje como:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### 4. Abrir en el navegador

Abre tu navegador (Chrome, Firefox, Edge, etc.) y ve a:

**http://localhost:3000**

### 5. Llenar los formularios

- Usa las pestañas **"Reporte de Actividad"** y **"Reporte Mensual"** para llenar los campos
- El **Cronograma** (Página 1) se llena a mano en el PDF impreso
- Presiona **"Generar PDF"** para descargar el PDF con los datos

### 6. Detener la aplicación

Cuando termines, vuelve a la terminal y presiona `Ctrl + C` para detener el servidor.

## Estructura del proyecto

```
llenador-pdf-municipal/
├── public/
│   └── formatos.pdf          ← El PDF original con los formularios vacíos
├── src/
│   ├── app/
│   │   ├── api/pdf/route.ts  ← API para servir el PDF
│   │   ├── globals.css       ← Estilos globales
│   │   ├── layout.tsx        ← Layout principal
│   │   └── page.tsx          ← Página principal
│   ├── components/
│   │   └── PdfFormApp.tsx    ← Componente principal del formulario
│   └── lib/
│       └── pdf-fields.ts     ← Mapeo de posiciones de campos en el PDF
├── package.json              ← Dependencias y scripts
├── next.config.js            ← Configuración de Next.js
└── tsconfig.json             ← Configuración de TypeScript
```

## Si necesitas cambiar el PDF

Si tienes un PDF diferente, reemplaza el archivo `public/formatos.pdf` con tu nuevo PDF (manteniendo el mismo nombre).
