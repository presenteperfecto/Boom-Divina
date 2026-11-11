# 💖 BOOM DIVINA – SISTEMA INTEGRAL DE GESTIÓN PARA CENTRO DE ESTÉTICA

> Plataforma web moderna, responsive y funcional diseñada para el centro de estética femenina **BOOM DIVINA**.
> Permite a las clientas explorar tratamientos, consultar disponibilidades en tiempo real, solicitar citas con abono de seña previa y solicitar servicios a domicilio con cotizador instantáneo; mientras que la administración y las profesionales gestionan el negocio desde paneles privados seguros.

---

## 📑 Tabla de Contenidos

1. [Stack Tecnológico](#-stack-tecnológico)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Módulos Desarrollados](#-módulos-desarrollados)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Credenciales de Prueba](#-credenciales-de-prueba)
6. [Flujo de Negocio: Turnos y Señas](#-flujo-de-negocio-turnos-y-señas)
7. [Módulo de Servicios a Domicilio y Cotizador](#-módulo-de-servicios-a-domicilio-y-cotizador)
8. [Documentación de APIs](#-documentación-de-apis)
9. [Seguridad Implementada](#-seguridad-implementada)

---

## 🛠 Stack Tecnológico

- **Backend:** Node.js (v18+) con Express.js (Arquitectura MVC + Service Layer)
- **Base de Datos:** MySQL 8.0+ gestionada con Sequelize ORM (17 modelos relacionales normalizados)
- **Frontend:** HTML5 semántico, CSS3 moderno (Variables CSS, Flexbox, Grid, Animaciones sutiles) y JavaScript Vanilla (sin frameworks pesados, carga instantánea)
- **Motor de Plantillas:** EJS (Embedded JavaScript) para renderizado del lado del servidor (SSR)
- **Autenticación & Sesión:** JWT (JSON Web Tokens) con cookies seguras y express-session, contraseñas hasheadas con `bcrypt` (10 salt rounds)
- **Subida de Archivos:** `multer` con almacenamiento estructurado y filtrado de tipos para comprobantes y fotos
- **Protección & Seguridad:** `helmet` (cabeceras HTTP seguras, CSP), `cors`, validaciones centralizadas con `express-validator`

---

## 📁 Estructura del Proyecto

```
boom-divina/
├── docs/                        # Documentación técnica y scripts SQL
│   ├── ARCHITECTURE.md          # Arquitectura del sistema y flujo de datos
│   ├── API.md                   # Especificación de endpoints REST
│   ├── DEPLOYMENT.md            # Guía de despliegue en producción
│   ├── schema.sql               # Script DDL completo de creación de base de datos
│   └── seed.sql                 # Datos de prueba para MySQL
├── public/                      # Archivos públicos servidos por Express
│   ├── css/                     # Hojas de estilo modularizadas
│   │   ├── variables.css        # Paleta (Rose Gold, Nude, Espresso, Gold)
│   │   ├── reset.css            # Normalización
│   │   ├── base.css             # Tipografía y estilos base
│   │   ├── components.css       # Botones, cards, badges, alertas, tablas
│   │   ├── animations.css       # Animaciones sutiles (fade, slide)
│   │   ├── responsive.css       # Media queries mobile-first
│   │   └── admin.css            # Estilos del panel de administración
│   ├── js/                      # Lógica JavaScript del cliente
│   │   ├── main.js              # Menú mobile, sticky navbar, toasts
│   │   ├── booking.js           # Asistente (Wizard) de 5 pasos para reservas
│   │   └── admin.js             # Acciones rápidas de estados y confirmaciones
│   └── uploads/                 # Almacenamiento de comprobantes y fotos subidas
├── src/
│   ├── config/                  # Configuración de DB, Sequelize y JWT
│   │   ├── database.js
│   │   └── auth.js
│   ├── controllers/             # Controladores de la aplicación
│   │   ├── auth.controller.js
│   │   ├── public.controller.js
│   │   ├── booking.controller.js
│   │   ├── appointment.controller.js
│   │   ├── client.controller.js
│   │   ├── service.controller.js
│   │   ├── professional.controller.js
│   │   ├── deposit.controller.js
│   │   ├── domicilio.controller.js
│   │   ├── promotion.controller.js
│   │   ├── stats.controller.js
│   │   └── config.controller.js
│   ├── middlewares/             # Middlewares de control
│   │   ├── auth.middleware.js   # Verificación JWT / Sesión
│   │   ├── role.middleware.js   # Control por roles (admin, professional)
│   │   ├── upload.middleware.js # Configuración de multer
│   │   └── error.middleware.js  # Manejo centralizado de errores
│   ├── models/                  # 17 Modelos relacionales Sequelize
│   │   ├── index.js             # Carga y definición de asociaciones
│   │   ├── User.js, Client.js, Service.js, Category.js, etc.
│   ├── routes/                  # Enrutamiento modular Express
│   │   ├── index.js             # Rutas públicas (Home, Servicios, Reservar)
│   │   ├── auth.js              # Login y logout
│   │   ├── api.js               # Endpoints REST para AJAX y Frontend
│   │   ├── admin.js             # Panel administrativo protegido
│   │   └── professional.js      # Portal para profesionales
│   ├── services/                # Capa de lógica de negocio pura
│   │   ├── appointment.service.js
│   │   ├── availability.service.js
│   │   ├── deposit.service.js
│   │   ├── domicilio.service.js
│   │   └── notification.service.js
│   └── utils/                   # Scripts auxiliares
│       ├── seedDatabase.js      # Inicialización y datos de prueba automáticos
│       └── checkDependencies.js # Comprobación del entorno
├── views/                       # Vistas EJS
│   ├── layouts/                 # Header, Footer, Admin Layouts
│   ├── public/                  # Vistas públicas para clientas
│   ├── admin/                   # Vistas del panel de administración
│   └── professional/            # Vistas del portal de especialistas
├── .env.example                 # Variables de entorno modelo
├── package.json
└── server.js                    # Punto de entrada de la aplicación
```

---

## 💎 Módulos Desarrollados

### 1. Portal Público para Clientas
- **Página de Inicio (`/`):** Hero con propuesta de valor, selección de tratamientos populares, banner de promociones activas, galería fotográfica y botón flotante de WhatsApp.
- **Catálogo de Servicios (`/servicios`):** Listado agrupado por categorías con detalles de duración en minutos, precio, monto de seña requerida e indicador de servicio a domicilio.
- **Flujo de Reserva en 5 Pasos (`/reservar`):**
  1. *Selección del servicio.*
  2. *Elección de profesional especialista o "Cualquiera disponible".*
  3. *Selector de fecha y cálculo en tiempo real de slots horarios libres.*
  4. *Formulario de datos personales (Nombre, Apellido, Teléfono/WhatsApp, Email, Observaciones).*
  5. *Resumen del turno, importe de seña previa y aceptación explícita de políticas de cancelación.*
- **Confirmación y Comprobantes (`/reservas/confirmacion/:id`):** Ticket digital del turno, alias bancario/CBU para transferencia y formulario interactivo para adjuntar el comprobante de pago.
- **Cotizador a Domicilio (`/domicilio`):** Calculadora dinámica de costos según cantidad de personas y distancia en kilómetros desde el centro, con envío de solicitud para revisión.
- **Contacto y Ubicación (`/contacto`):** Dirección, mapa interactivo, horarios de apertura y accesos a redes sociales.
- **Políticas Comerciales (`/politicas`):** Términos claros sobre el anticipo no reembolsable, margen de tolerancia (10 min) y política de reprogramación con 24 hs de anticipación.

### 2. Panel de Administración (`/admin`)
- **Dashboard Estadístico:** Conteo de turnos del día, señas pendientes de revisión, turnos confirmados e ingresos totales recaudados.
- **Gestión de Turnos (`/admin/appointments`):** Filtros avanzados por fecha, profesional y estado. Acciones para confirmar, marcar realizado o cancelar.
- **Gestión de Señas (`/admin/deposits`):** Visualización de comprobantes adjuntos, botones de verificación inmediata (que confirman el turno automáticamente) o rechazo con motivo.
- **Gestión de Servicios y Categorías (`/admin/services`):** Alta y modificación de servicios, tiempos de atención, precios, señas y activación de opción a domicilio.
- **Equipo Profesional (`/admin/professionals`):** Registro de especialistas, asignación de tratamientos y configuración de horarios de atención semanal día por día.
- **Gestión de Clientas (`/admin/clients`):** Directorio de clientas, acceso directo a WhatsApp y visualización del historial de turnos recibidos.
- **Solicitudes a Domicilio (`/admin/domicilio`):** Revisión de cotizaciones solicitadas y cambio de estado a confirmada o cancelada.
- **Promociones (`/admin/promotions`):** Creación de ofertas porcentuales o de monto fijo con fecha de vigencia y control de activación.
- **Configuración del Negocio (`/admin/config`):** Edición directa de teléfono, WhatsApp, Instagram, dirección, CBU/Alias y parámetros del cotizador de traslados.

### 3. Portal de Profesionales (`/professional`)
- Acceso exclusivo para el personal con su usuario y contraseña.
- Visualización de la agenda personal del día y próximos turnos confirmados.
- Capacidad de marcar tratamientos como completados.
- Restricción estricta para evitar acceso a datos contables o administrativos globales.

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js:** v18.0.0 o superior
- **MySQL:** v8.0 o superior (o MariaDB equivalente)

### Paso 1: Clonar o ingresar al directorio
```bash
cd C:\Users\EQUIPO\.gemini\antigravity\scratch\boom-divina
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
Copiar el archivo de ejemplo y configurar las credenciales de base de datos:
```bash
cp .env.example .env
```
Editar el archivo `.env`:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=boom_divina
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
JWT_SECRET=tu_clave_secreta_jwt_super_segura
SESSION_SECRET=tu_clave_secreta_para_sesiones
```

### Paso 4: Inicializar la Base de Datos y Cargar Datos de Prueba
Podés inicializar la base de datos de dos formas:

**Opción A (Recomendada con script automático):**
```bash
npm run seed
```
Este comando sincroniza los 17 modelos de Sequelize y crea usuarios con passwords hasheados, categorías, servicios, profesionales, turnos y configuraciones.

**Opción B (Mediante cliente MySQL CLI):**
```bash
mysql -u root -p < docs/schema.sql
mysql -u root -p boom_divina < docs/seed.sql
```

### Paso 5: Iniciar la Aplicación
```bash
# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

La plataforma estará disponible en: **`http://localhost:3000`**

---

## 🔑 Credenciales de Prueba

| Rol | Correo Electrónico | Contraseña | Acceso |
|-----|-------------------|------------|--------|
| **Administradora** | `admin@boomdivina.com` | `BoomDivina2024!` | [http://localhost:3000/auth/login](http://localhost:3000/auth/login) |
| **Profesional (Camila)** | `camila@boomdivina.com` | `Pro2024!` | [http://localhost:3000/auth/login](http://localhost:3000/auth/login) |
| **Profesional (Sofía)** | `sofia@boomdivina.com` | `Pro2024!` | [http://localhost:3000/auth/login](http://localhost:3000/auth/login) |

---

## 📅 Flujo de Negocio: Turnos y Señas

1. **Consulta de Disponibilidad:**
   El servicio `availability.service.js` analiza los horarios laborales de la especialista para el día elegido, consulta los turnos ya agendados y los bloqueos temporales, generando únicamente los bloques horarios que admitan la duración completa del servicio solicitado.
2. **Registro de la Reserva:**
   La clienta selecciona su horario y completa sus datos. El sistema registra a la clienta (si es nueva), crea el turno en estado `pending` y crea una seña asociada.
3. **Pago de la Seña:**
   La clienta es redirigida a la pantalla de confirmación donde visualiza el importe de la seña, el Alias bancario y un formulario para adjuntar la foto del comprobante de transferencia.
4. **Verificación Administrativa:**
   Desde el panel `/admin/deposits`, la administradora coteja el comprobante con la cuenta bancaria. Al hacer clic en "Aprobar", la seña pasa a `verified` y el turno automáticamente a `confirmed`.

---

## 🚗 Módulo de Servicios a Domicilio y Cotizador

El módulo calcula el costo total considerando:
$$\text{Total} = \sum \text{Servicios} + \text{Costo Traslado} + \text{Recargo Personas Extra}$$

Donde:
$$\text{Costo Traslado} = \max(0, \text{Distancia KM} - \text{Radio Gratis}) \times \text{Costo por KM} + \text{Costo Base}$$

Todos estos parámetros son configurables en tiempo real por la administradora desde `/admin/config`.

---

## 🔒 Seguridad Implementada

- Contraseñas protegidas mediante algoritmos de hash irreversible con `bcrypt`.
- Verificación de sesión y tokens JWT con revocación.
- Control de acceso basado en roles (`requireAdmin`, `requireProfessional`).
- Consultas SQL parametrizadas a través del ORM Sequelize para prevenir inyección SQL.
- Cabeceras HTTP seguras configuradas mediante `helmet`.
- Validación de archivos de imagen y comprobantes mediante `multer` restringiendo extensiones ejecutables.
- Exclusión estricta de credenciales y variables en el control de versiones `.gitignore`.

---

© 2026 **BOOM DIVINA – ESTÉTICA**. Desarrollado con los más altos estándares de calidad y diseño web.
