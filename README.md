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

## Instrucciones para usuarios Windows

**Requisitos**
- **Node.js**: versión 18+ instalada.
- **npm**: incluida con Node.js.
- **Git**: para clonar/actualizar el repo.
- **Recomendado:** WSL2 (Ubuntu) para compatibilidad idéntica a Linux. Alternativas: PowerShell 7+ o Git Bash.

**Resumen rápido**
- **Script bash:** `start.sh` usa `bash` y `export`, no funciona en CMD/PowerShell nativo — ver [start.sh](start.sh#L1-L5).
- **Scripts npm:** `dev`, `build`, `start` son ejecutables desde Windows con Node instalado — ver [package.json](package.json#L1-L40).

**Opción recomendada — WSL2 (mejor compatibilidad)**
1. Instalar WSL2 y una distro (ej. Ubuntu). En PowerShell (como administrador):
```powershell
wsl --install
wsl --set-default-version 2
```
2. Abrir la terminal WSL (Ubuntu), navegar al proyecto y ejecutar:
```bash
cd /ruta/al/proyecto   # p.ej. /mnt/c/Users/TuUsuario/Descargas/resumen_CyT
npm install
npm run dev
```
3. Dentro de WSL `start.sh` funciona tal cual (usa `export`).

**Opción alternativa A — PowerShell (sin WSL)**
1. Abrir PowerShell 7+.
2. Instalar dependencias:
```powershell
npm install
```
3. Definir variables de entorno y lanzar:
```powershell
$env:PORT = "3000"
$env:HOSTNAME = "0.0.0.0"
npx next dev -p 3000 -H 0.0.0.0
```
4. O usar `cross-env` para mantener sintaxis cross-platform:
```powershell
npm install --save-dev cross-env
npx cross-env PORT=3000 HOSTNAME=0.0.0.0 npm run dev
```

**Opción alternativa B — Git Bash / MSYS2**
1. Abrir Git Bash en la carpeta del proyecto.
2. Ejecutar:
```bash
export PORT=3000
export HOSTNAME=0.0.0.0
npx next dev -p 3000 -H 0.0.0.0
```

**Comandos npm habituales**
- Instalar dependencias:
```bash
npm install
```
- Desarrollo:
```bash
npm run dev
```
- Build:
```bash
npm run build
```
- Producción:
```bash
npm start
```

**Notas sobre Prisma u otros motores nativos**
- Si el proyecto usa Prisma u otra herramienta con binarios por plataforma, ejecutar:
```bash
npx prisma generate
```
(en WSL funciona como en Linux; en PowerShell puede requerir pasos adicionales).

**Consejos y soluciones rápidas**
- Si el puerto 3000 está ocupado (PowerShell):
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```
- Firewall: acepta la petición de Windows al exponer Node si confías en la app.
- Problemas de rutas/permisos largos: usar WSL evita la mayoría de inconvenientes.

