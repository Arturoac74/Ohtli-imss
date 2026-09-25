# Ohtli 2.0 — Estrategia de Capacitación en Investigación Médica (IMSS)

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwindcss)
![IMSS](https://img.shields.io/badge/Institución-IMSS-6B1D2F)

> **Plataforma digital asíncrona diseñada para acompañar a los médicos residentes del IMSS en la estructuración, desarrollo y publicación de sus protocolos de investigación.**

---

## 📌 Descripción del Proyecto

**Ohtli 2.0** es un ecosistema digital diseñado para modernizar y optimizar el proceso de investigación clínica y formativa de las residencias médicas en el **Instituto Mexicano del Seguro Social (IMSS)**. Facilita la coordinación integral entre las autoridades institucionales (CPEI, CCEI, CAMIS, JDIS, CINV), tutores de investigación y médicos residentes en todas las delegaciones y unidades médicas del país.

---

## ✨ Características Principales

### 1. 🎓 Dashboard de Médicos Residentes (Trayectoria R1 – R3)
- **R1 (Protocolo de Investigación)**: Estructuración y registro de protocolos, apego a normatividad CAMIS y comités de ética.
- **R2 (Bases de Datos & Trabajo de Campo)**: Captura de datos, validación metodológica y conexión con estándares REDCap.
- **R3 (Tesis de Titulación & Publicación)**: Redacción del informe final de tesis, defensa y preparación para envío a revistas científicas indexadas.

### 2. 👨‍🏫 Panel de Docentes y Tutores CINV
- Seguimiento personalizado de tutorados asignados.
- Revisión metodológica en tiempo real y emisión de dictámenes preliminares.
- Banco de proyectos paraguas y líneas de investigación clínica.

### 3. 🏛️ Panel Directivo y Mapa de Calor Nacional
- Supervisión de cumplimiento por Órganos de Operación Administrativa Desconcentrada (**OOAD**).
- Métricas de eficiencia terminal, tasas de aprobación de protocolos y publicaciones por delegación.
- Canal institucional de difusión de convocatorias y alertas a nivel nacional.

### 4. 🛡️ Administración de Usuarios y Gobernanza de Permisos (RBAC)
- Padrón central de usuarios: residentes, docentes, tutores y directivos.
- Matriz de permisos granulares:
  - *Gestión de Usuarios*: Altas, bajas y modificaciones en el padrón institucional.
  - *Dictámenes Bioéticos*: Emisión y validación de dictámenes.
  - *Difusión*: Publicación de avisos oficiales.
  - *Asignación de Tutores*: Vinculación tutor-residente.
  - *Respaldos DDL*: Exportación de datos en formatos SQL y JSON.
- Bitácora de auditoría en tiempo real con trazabilidad por matrícula.

### 5. 📂 Repositorio de Protocolos
- Catálogo nacional de protocolos registrados.
- Filtros por delegación, especialidad médica, año de residencia y dictamen de comité.

### 6. 📶 Modo Offline & Sincronización Asíncrona
- Soporte para trabajo continuo en entornos hospitalarios con conectividad intermitente.
- Cola de sincronización local persistente.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador y Servidor de Desarrollo**: [Vite 6](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Mapas**: [Leaflet](https://leafletjs.com/)
- **Animaciones**: [Motion](https://motion.dev/)

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **bun**

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/ohtli-imss.git
cd ohtli-imss
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Si vas a utilizar capacidades de IA generativa con el SDK de Gemini, agrega tu API Key en `.env`:
```env
GEMINI_API_KEY="tu_api_key_aqui"
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### 5. Compilar para producción
```bash
npm run build
```

---

## 📋 Credenciales Demostrativas para Pruebas

Para explorar todos los roles y vistas de la plataforma, puedes iniciar sesión utilizando las siguientes matrículas:

| Rol | Usuario de Prueba | Matrícula | Especialidad / Cargo |
| :--- | :--- | :--- | :--- |
| **Residente R1** | Dra. Mariana Zepeda Almonte | `34891023` | Medicina de Urgencias (HGZ 1-A) |
| **Residente R2** | Dr. Alejandro Morales Cisneros | `45902134` | Cardiología Clínica (UMAE Siglo XXI) |
| **Residente R3** | Dra. Sofía Ledesma Treviño | `56013245` | Pediatría Médica (UMAE La Raza) |
| **Docente / Tutor CINV** | Dr. Fernando Arredondo Gómez | `98124001` | Metodología de la Investigación (CIEFD) |
| **Directivo / Admin** | Dr. Rodrigo Mendoza Zavala | `99234101` | Coordinación de Investigación en Salud |
| **Directivo / Admin** | Dra. Gabriela Pacheco Lugo | `99345212` | Jefatura de Educación Médica |

*Nota: También puedes usar el botón de acceso rápido de la pantalla de inicio.*

---

## 📁 Estructura del Proyecto

```text
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline de integración continua
├── assets/                   # Recursos visuales y logos institucionales
├── src/
│   ├── components/           # Componentes modulares de interfaz
│   │   ├── DirectivoView.tsx       # Dashboard directivo y gobernanza
│   │   ├── DocenteView.tsx         # Panel del tutor e investigador
│   │   ├── ResidenteView.tsx       # Trayectoria de investigación R1-R3
│   │   ├── UserManagementView.tsx  # Padrón de usuarios y matriz RBAC
│   │   ├── ProtocolsRepoView.tsx   # Repositorio nacional de protocolos
│   │   ├── OhtliHeader.tsx         # Barra de navegación con control de acceso
│   │   └── LandingPage.tsx         # Acceso institucional y bienvenida
│   ├── services/
│   │   └── databaseService.ts      # Capa de datos, almacenamiento y persistencia
│   ├── types/
│   │   └── ohtli.ts                # Modelos de TypeScript y esquemas
│   ├── App.tsx               # Controlador principal de vistas y estado global
│   ├── main.tsx              # Punto de entrada de la aplicación
│   └── index.css             # Configuración de estilos y Tailwind CSS
├── index.html                # Punto de entrada HTML
├── metadata.json             # Metadatos del aplicativo
├── package.json              # Manifiesto de dependencias y scripts
├── tsconfig.json             # Configuración del compilador TypeScript
└── vite.config.ts            # Configuración de Vite
```

---

## 📤 Instrucciones para Exportar / Subir a GitHub

Si deseas subir este proyecto a un nuevo repositorio en GitHub:

1. **Crea un nuevo repositorio en GitHub** (puedes llamarlo `ohtli-imss` u `ohtli-2.0`). No marques la opción de inicializar con README si ya cuentas con este archivo.
2. **Ejecuta los siguientes comandos en tu terminal**:

```bash
# 1. Inicializar git (si aún no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Realizar el primer commit
git commit -m "feat: Ohtli 2.0 - Plataforma de Investigación Médica IMSS"

# 4. Establecer la rama principal
git branch -M main

# 5. Conectar con tu repositorio remoto en GitHub
git remote add origin https://github.com/Arturoac74/ohtli-imss.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
