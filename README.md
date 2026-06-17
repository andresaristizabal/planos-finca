# planos-finca
claude planos

Ver [guia-planos-finca.md](./guia-planos-finca.md) para las buenas prácticas a seguir al elaborar planos de arquitectura de fincas (levantamiento del terreno, normativa, zonificación, diseño bioclimático, infraestructura, tipos de planos, escalas y herramientas).

## App de visualización (app/)

Aplicación HTML/CSS/JavaScript con [Three.js](https://threejs.org/) que sirve como visor 2D/3D de los planos: alterna entre una vista en planta (cámara ortográfica cenital, sin perspectiva, como un plano técnico) y una vista 3D libre (cámara en perspectiva con orbit controls). Trae datos de ejemplo (zonas de vivienda, establo, bodega y cultivo) que se deben reemplazar por la geometría real del plano.

```bash
cd app
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción en app/dist
```

### Publicación en GitHub Pages

El workflow [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) construye `app/` y lo publica en GitHub Pages automáticamente en cada push a `main` que toque la carpeta `app/` (también se puede disparar a mano desde la pestaña *Actions*).

**Paso manual único (requiere permisos de administración del repo):** en GitHub, ir a *Settings → Pages → Build and deployment → Source* y seleccionar **GitHub Actions**. Una vez configurado, el sitio queda disponible en `https://<usuario>.github.io/planos-finca/`.
