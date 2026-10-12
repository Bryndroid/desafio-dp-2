# 🎬 Cine Conectado — Tercer Desafío Práctico

**Universidad Don Bosco · Facultad de Ingeniería · Escuela de Ingeniería en Computación**
**Diseño y Programación de Software Multiplataforma**

App móvil de venta de boletos para un cine, hecha con **Expo + React Native + TypeScript**, que consume una **API REST propia (Node.js + Express + MySQL) desplegada en Railway**.

## 👥 Integrantes

| Nombre | Carné |
| --- | --- |
| Victor | TC221525 |
| Bryan Molina | FM230331 |

## 🔗 Enlaces

| Recurso | URL |
| --- | --- |
| Repositorio de la app | https://github.com/Bryndroid/desafio-dp-2 |
| Repositorio de la API | https://github.com/Bryndroid/api-cine |
| API desplegada en Railway | https://api-cine-production.up.railway.app |
| Usuario genérico (compras) | **id = `1`** (definido en `src/config.ts` como `USUARIO_GENERICO_ID`) |

---

## 📱 ¿Cómo funciona la app?

La app tiene dos zonas: la **Experiencia del Cliente** (libre) y la **Zona de Personal** (protegida con biometría).

### Experiencia del Cliente

- **Catálogo de películas**: se obtiene desde `GET /peliculas`, con **búsqueda dinámica** y **filtros** que trabajan sobre los datos de la API.
- **Detalle de película**: información de la función y botón para comprar boletos.
- **Compra de boletos**: antes de mostrar el **mapa táctil de asientos** (4 filas × 4 butacas por sala) se consultan las reservas de la película para marcar los asientos ocupados. Al confirmar se envía `POST /reservas` con el usuario genérico.
  - Si la API responde **409** (asiento ya ocupado), se informa al cliente y se refresca el mapa.
  - Mientras la petición está en curso, el botón se deshabilita para evitar compras duplicadas.
- **Notificación local**: cuando la API confirma la reserva, se muestra una notificación con el nombre de la película, la cantidad de boletos, los asientos, el total pagado y el código de reserva.
- **Mis Boletos**: lista de reservas obtenidas de `GET /reservas`; cada boleto muestra su **código QR** (`CINE-RESERVA-<código>`).

### Zona de Personal (protegida con biometría)

Al entrar se solicita huella o rostro con `expo-local-authentication`.

- **Escáner QR** (`expo-camera`): lee el código y llama a `PUT /reservas/:codigo/validar`. Muestra si el boleto es **válido**, **ya fue utilizado** o **no existe**.
- **Gestión de películas (CRUD)**: agregar, editar, eliminar (con confirmación) y cambiar el estado (Disponible / No disponible) usando `POST`, `PUT` y `DELETE`. Los cambios se reflejan en el catálogo.
- **Gestión de reservas (solo consulta)**: lista todas las reservas (`GET /reservas`) y permite ver el detalle de cada una (`GET /reservas/:id`). No hay opciones de editar, eliminar ni cancelar.
- **Dashboard y estadísticas**: calculados con los datos de películas y reservas obtenidos de la API.

### Manejo de datos y errores

- **Redux Toolkit** con `createAsyncThunk`: slices de `peliculas`, `reservas` y `salas`, con estados de carga y error.
- **AsyncStorage**: persiste las salas/funciones y guarda una **copia (caché)** de películas y reservas para consultar sin conexión. Las operaciones de escritura (compras, CRUD) siempre requieren conexión.
- **Servicio `apiFetch<T>()`** (`src/services/api.ts`): cliente tipado que usa la URL base de Railway y convierte los errores del backend (400, 404, 409, 500) y la falta de internet en mensajes legibles.

---

## 🗄️ API REST (Railway)

Backend con **Node.js + Express + MySQL**, desplegado en Railway con base de datos MySQL propia.

### Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/peliculas` | Lista de películas |
| `GET` | `/peliculas/:id` | Detalle de una película (404 si no existe) |
| `POST` | `/peliculas` | Crea una película (400 datos inválidos, 409 código repetido) |
| `PUT` | `/peliculas/:id` | Actualiza una película (incluye el cambio de estado) |
| `DELETE` | `/peliculas/:id` | Elimina una película |
| `GET` | `/reservas` | Lista de reservas (acepta `?pelicula_id=&funcion=`) |
| `GET` | `/reservas/:id` | Detalle de una reserva (404 si no existe) |
| `POST` | `/reservas` | Registra una compra con el usuario genérico (409 si un asiento está ocupado) |
| `PUT` | `/reservas/:codigo/validar` | Marca el boleto como utilizado (404 no existe, 409 ya utilizado) |

### Códigos de respuesta

`200`, `201`, `400` (datos inválidos), `404` (no existe), `409` (conflicto: código duplicado, asiento ocupado o boleto ya utilizado) y `500` (error del servidor). Los errores incluyen un campo `message` descriptivo.

### Despliegue en Railway

1. Crear un proyecto en [Railway](https://railway.app) y agregar un servicio **MySQL**.
2. Ejecutar el script `db/database.sql` (tablas `usuarios`, `peliculas` y `reservas`, el usuario genérico y datos de prueba) en esa base de datos.
3. Agregar un servicio desde el repositorio de la API en GitHub.
4. Configurar las **variables de entorno** del servicio con las credenciales de la base de datos (host, usuario, contraseña, nombre y puerto de MySQL, con los nombres que lee `src/config.js`). Las credenciales **no se suben al repositorio**.
5. Generar el dominio público en _Settings → Networking → Generate Domain_.
6. Verificar abriendo `https://api-cine-production.up.railway.app/peliculas` en el navegador.

---

## 🚀 Cómo correr la app

### Requisitos

- [Node.js](https://nodejs.org) (versión LTS)
- Un teléfono Android (o emulador) y la computadora en la **misma red Wi-Fi**
- Una cuenta gratuita de [Expo](https://expo.dev/signup) (solo para generar el development build)

### 1. Instalar dependencias

```bash
git clone <enlace-del-repositorio-de-la-app>
cd <carpeta-del-proyecto>
npm install
```

### 2. Configurar la URL de la API

Copia `.env.example` a `.env` y coloca la URL base del servicio (**sin** `/peliculas` ni `/reservas`):

```env
EXPO_PUBLIC_API_URL=https://api-cine-production.up.railway.app
```

### 3. Generar el development build (una sola vez)

Las notificaciones locales se verificaron en un **development build**, por lo que se recomienda usarlo en lugar de Expo Go.

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

- Cuando pregunte si quieres instalar y ejecutar el build en un emulador, responde **No** (si usarás tu teléfono).
- Al terminar, abre el enlace o escanea el QR desde el teléfono, descarga el **APK** e instálalo (Android pedirá permitir la instalación desde esa fuente).
- El build solo se repite si se agregan librerías nativas o se cambian los plugins de `app.json`.

### 4. Iniciar el servidor de desarrollo

```bash
npx expo start --dev-client
```

Abre la app **DesafioDos** instalada en el teléfono y conéctala al servidor (escaneando el QR de la terminal o eligiéndolo en la lista).

### 5. Probar el flujo completo

1. Acepta el **permiso de notificaciones** al abrir la app por primera vez.
2. En el catálogo, busca o filtra una película y entra a su detalle.
3. Compra boletos: elige asientos en el mapa y confirma. Debe aparecer la notificación **"¡Compra confirmada!"**.
4. Ve a **Mis Boletos** y abre el boleto para ver su código QR.
5. Entra a la **Zona de Personal** (se pedirá la biometría) y usa el **Escáner QR** para validar el boleto. Un segundo escaneo debe indicar que **ya fue utilizado**.
6. Revisa **Gestión de reservas**, **Gestión de películas** y el **Dashboard**.

> 💡 La biometría requiere tener una huella o rostro registrado en el dispositivo.

---

## 🧱 Estructura del proyecto

```
src/
├── app/                      # Rutas (expo-router)
│   ├── (client)/             # Experiencia del cliente: catálogo, detalle, compra, mis boletos
│   └── admin/                # Zona de Personal: escáner, películas, reservas, dashboard
├── components/               # Componentes reutilizables (formularios, mapa de asientos, QR, etc.)
├── config.ts                 # URL de la API y USUARIO_GENERICO_ID
├── redux/
│   ├── store.ts
│   ├── slices/               # peliculas, reservas, salas
│   └── thunk/                # createAsyncThunk hacia la API
├── services/
│   ├── api.ts                # apiFetch<T>() tipado
│   └── notificaciones.ts     # Permisos, canal de Android, handler y notificación de compra
├── store/                    # Datos locales de salas
└── types/                    # Interfaces de TypeScript
```

## 🛠️ Tecnologías

Expo · React Native · TypeScript · Redux Toolkit (`createAsyncThunk`) · Expo Router (React Navigation) · AsyncStorage · Flexbox · `expo-camera` · `expo-local-authentication` · `expo-notifications` · Node.js · Express · MySQL · Railway


