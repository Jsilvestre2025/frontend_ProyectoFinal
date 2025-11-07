import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas que deben renderizarse en el cliente
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },
  {
    path: 'user',
    renderMode: RenderMode.Client
  },
  {
    path: 'books/add',
    renderMode: RenderMode.Client
  },
  {
    path: 'books/edit/:id',
    renderMode: RenderMode.Client
  },
  // El resto de las rutas pueden ser prerenderizadas
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];