# ALQUILERES PELADO — Frontend (Vite + React)

Proyecto final de una aplicación web para gestión de alquileres de autos. UI/UX moderna y futurista (glassmorphism + gradientes + Framer Motion), con flujos completos de autenticación, gestión de autos, creación de alquileres, notificaciones in‑app y generación de comprobante PDF.

## 1) Alcance funcional (qué hace la app)

Rol Customer (cliente):
- Registro e inicio de sesión con validaciones.
- Home con autos destacados y beneficios.
- Catálogo de autos disponibles (solo los con stock > 0 y disponibles).
- Proceso de alquiler desde la card del auto:
  - Selección de rango de fechas en calendario (bloquea días pasados).
  - Cálculo automático de días y total (días × precio/día).
  - Confirmación del alquiler (POST al backend) y reducción de stock.
  - Notificación in‑app “Reserva confirmada” con acceso al PDF.
  - Generación en cliente de PDF del comprobante (jsPDF) con datos de auto, persona, fechas y total.
- Perfil: muestra los datos de la Persona asociada (nombre, DNI, teléfono, género, fecha de nacimiento).

Rol Admin:
- Home con bienvenida al sistema y tablero de KPIs (mock) de administración.
- Gestión de autos (ABM):
  - Crear (con subida opcional de imagen a Cloudinary),
  - Editar (incluye toggle de disponibilidad y reemplazo de imagen),
  - Eliminar (próxima iteración si el backend publica DELETE/soft delete; por ahora placeholder en UI).
- Historial de alquileres (vista solo lectura):
  - Secciones Activos, Vencidos (fecha fin < hoy y sigue activo) y Finalizados.

Autenticación y seguridad:
- Login/Registro/Olvidé/Reset de contraseña.
- Interceptor Axios que adjunta JWT y trata 401/403 haciendo logout automático.
- Rutas protegidas y por rol (admin vs customer).

UX/UI destacada:
- Tema oscuro con gradientes neón y efectos animados.
- Modales y formularios con inputs “ultra facheros”, toasts, skeletons y estados vacíos/errores cuidados.
- Footer y Navbar consistentes (full‑width, blur, gradientes).

---

## 2) Stack tecnológico
- React 19 + Vite 7
- React Router 7
- TanStack Query 5 (data‑fetching, caché y estados)
- Axios (HTTP + interceptor JWT)
- React Hook Form + Zod (formularios y validaciones)
- Tailwind CSS 4 (estilos) + Framer Motion 12 (animaciones)
- jsPDF (PDF de comprobante de alquiler)
- Cloudinary (subida de imágenes sin firmar)
- react-hot-toast (toasts)

---

## 3) Arquitectura y organización

Rutas y layouts:
- `/auth/*` (públicas): Login, Register, Forgot, Reset.
- `/dashboard/*` (privadas): Home, Cars, Rentals (solo admin), Profile.
- `PublicOnly`, `PrivateRoute`, `RoleRoute` en `src/router/guards.jsx`.

Contextos:
- `AuthContext` — manejo de sesión: login, logout, persistencia de token y usuario.
- `NotificationsContext` — notificaciones in‑app con campanita en navbar.

Servicios (`src/services`):
- `api.js` (Axios + interceptores), `auth.js`, `cars.js`, `rentals.js`, `clients.js`, `uploader.js` (Cloudinary).

Componentes UI clave:
- `Button`, `InputPro`, `Modal`, `Badge`, `DateRangePicker`, `NotificationsBell`, `BackgroundFX`, `Footer`, `Logo`.

Utilidades:
- `utils/pdf.js` — generación de PDF del alquiler en el cliente.

Estructura de carpetas (parcial):
```
app/
  src/
    components/
      ui/ (Button, InputPro, Modal, Badge, DateRangePicker)
      BackgroundFX.jsx
      Footer.jsx
      Logo.jsx
      NotificationsBell.jsx
    contexts/
      AuthContext.jsx
      NotificationsContext.jsx
    pages/
      auth/ (Login, Register, Forgot, Reset)
      dashboard/ (Home, Cars, Rentals, Profile)
    router/guards.jsx
    services/ (api, auth, cars, rentals, clients, uploader)
    utils/pdf.js
    layouts/ (AuthLayout, DashboardLayout)
    App.jsx, main.jsx
```

---

## 4) Configuración de entorno
Archivo: `src/config/env.js` usa variables `import.meta.env`.

Variables (Vite):
- `VITE_API_BASE` — URL del backend (por defecto `http://localhost:3000`).
- `VITE_CLOUDINARY_CLOUD_NAME` — Cloud name (por defecto `dgbmfsgg1`).
- `VITE_CLOUDINARY_UPLOAD_PRESET` — Unsigned preset (por defecto `productos_preset`).
- `VITE_CLOUDINARY_API_KEY` — Opcional (no se requiere para upload sin firmar).

Ejemplo `.env` local (en `app/`):
```
VITE_API_BASE=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
```

Docker (cuando backend corre en host y frontend en contenedor):
```
VITE_API_BASE=http://host.docker.internal:3000
```

---

## 5) Cómo ejecutar

Sin Docker (recomendado para desarrollo rápido):
```
cd EFI-Reserva-Front/EFI-Reserva-Front/app
npm install
npm run dev
```
Abrir: http://localhost:5173

Con Docker:
```
cd EFI-Reserva-Front/EFI-Reserva-Front
docker compose down -v
docker compose build --no-cache
docker compose up
```
Abrir: http://localhost:5173

Makefile (atalhos):
```
make up
make down
make logs
make restart
```

Build de producción:
```
cd app
npm run build
npm run preview
```

---

## 6) Experiencia de usuario (UI/UX)
- Diseño dark futurista con glassmorphism, gradientes neón y micro‑interacciones.
- Modales accesibles con backdrop blur, teclado y botón de cierre visible.
- Inputs avanzados (`InputPro`) con iconos, toggle de contraseña, validaciones con Zod.
- Calendario de rango (`react-day-picker`):
  - 2 meses, separador visual entre meses, bloqueo de días pasados.
- Toaster (éxitos/errores) y notificaciones in‑app persistidas en `localStorage`.
- Responsive completo (mobile y tablet) y performance cuidada (lazy images, skeletons, estados vacíos).

---

## 7) Detalles técnicos relevantes
- Interceptor Axios agrega `Authorization: Bearer <token>` sólo para endpoints no `/auth/*`.
- Normalización del token sin prefijo `Bearer` en storage para evitar `Bearer Bearer`.
- Guards de rutas: redirigen a login si no hay token y a dashboard si el rol no corresponde.
- Alquiler: normalización de fechas a mediodía local para evitar problemas de zona horaria; cálculo de días con redondeo seguro.
- PDF: cálculo defensivo (sin `NaN`), formato `es-AR`, incluye total, días y tarifa diaria.
- Cloudinary: subida unsigned con `fetch` + `FormData` y preset preconfigurado.
