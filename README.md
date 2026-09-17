# Explora · Películas y clima

Aplicación de la prueba técnica frontend. Angular 21, TypeScript estricto y Angular Material, en un proyecto independiente de CaviPetrolAPI.

## Instalar y ejecutar

Requisitos: Node.js 24.14.1 o una versión compatible con Angular 21. Se recomienda npm 11.

```powershell
cd "C:\Prueba tecnica Cavipetrol\ExploradorAngular"
npm ci
npm start
```


Si npm 10 falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npx --yes npm@11 ci`. No es necesario modificar la instalación global de npm.

## Funcionalidades

- Home con películas de Studio Ghibli: póster, título, año de estreno, director, duración y valoración.
- Pestaña de clima actual para 12 ciudades (6 colombianas y 6 internacionales).
- Búsqueda por nombre, ignorando mayúsculas y tildes.
- Tabla Material ordenable y paginación de 5, 10 o 20 filas; al buscar se vuelve a la primera página.
- Navegación por teclado, etiquetas accesibles y paginador en español.
- Diseño responsive: controles apilados en móvil y desplazamiento horizontal dentro de la tabla.
- Loading, estado vacío, aviso de error, botón para reintentar, snackbar y actualización manual.
- Póster alternativo cuando falla una imagen. Consultas limitadas a 15 segundos y canceladas al salir de la página.

## Arquitectura

```text
src/app/
  core/
    data/cities.ts               # Ciudades y coordenadas
    models/                     # Contratos de las APIs y modelos de dominio
    services/                   # MovieService y WeatherService con HttpClient
  features/explore/             # Página: coordina carga, estado y navegación
  shared/data-table/            # Tabla reutilizable, filtro, orden y paginador
  app.routes.ts                # Rutas con lazy loading
  app.config.ts                # Proveedores HTTP y router
```

Componentes standalone con OnPush y signals para el estado. Los servicios convierten la respuesta externa a modelos tipados; la página transforma esos modelos a filas de presentación. La tabla no consume servicios HTTP.

Rutas: `/#/peliculas` y `/#/clima`. Se usa navegación hash para que los enlaces directos funcionen en alojamiento estático sin reglas de redirección.

## APIs y decisiones

1. [Studio Ghibli API](https://ghibliapi.vercel.app/): `GET /films`. API pública comunitaria. Devuelve el **año**, no una fecha completa; se presenta sin inventar mes ni día. La valoración es Rotten Tomatoes sobre 100. Se conserva el título original del proveedor.
2. [Open-Meteo](https://open-meteo.com/en/docs): `GET /v1/forecast` con coordenadas múltiples y `current=temperature_2m,weather_code,is_day&timezone=auto`. Se consulta todo en una petición y se traducen los códigos meteorológicos WMO. Datos atribuidos a Open-Meteo, CC BY 4.0; revisar sus condiciones para uso comercial.

La búsqueda y paginación son locales porque las colecciones son pequeñas. El clima muestra la hora local de cada dato; “Consultado a las” corresponde a la hora del navegador. Las ciudades se configuran en `cities.ts`; la búsqueda filtra esa lista, no realiza geocodificación mundial.

Las APIs y los pósteres requieren Internet y dependen de la disponibilidad y políticas CORS de sus proveedores. No se muestran datos ficticios como sustituto cuando hay errores.

## Pruebas y compilación

```powershell
npm test -- --watch=false
npm run build
```

Pruebas unitarias con Vitest, TestBed y HttpTestingController (sin Internet): conversión de películas, propagación de errores HTTP, correspondencia entre ciudades y temperaturas, respuesta incompleta, códigos meteorológicos, búsqueda sin tildes, paginación y recuperación tras error.

Salida de producción: `dist/explorador-angular/browser`.

## Publicación opcional en GitHub Pages

El proyecto incluye `.github/workflows/pages.yml`, que prueba, compila y publica. No se ha publicado ni creado un repositorio remoto automáticamente.

1. Subir **el contenido de ExploradorAngular como raíz de un repositorio propio** con rama `main`.
2. En GitHub, abrir **Settings → Pages → Source → GitHub Actions**.
3. Ejecutar el workflow **Publicar Explora** desde Actions, o hacer push a `main`.
4. La URL publicada se verá en el job de despliegue y en Settings → Pages.

El workflow calcula el base href usando la configuración de Pages y publica únicamente la carpeta de compilación. Si colocas Angular en una subcarpeta de otro repositorio, deberás ajustar el directorio de trabajo y las rutas del workflow.

Referencias: [compatibilidad Angular](https://angular.dev/reference/versions), [pruebas Angular](https://angular.dev/guide/testing), [workflows GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
