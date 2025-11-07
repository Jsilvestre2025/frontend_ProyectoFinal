import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Admin } from './admin/admin';
import { User } from './user/user';
import { BookFormComponent } from './books/book-form/book-form';
import { UserAdmin } from './user-interfas/user-admin/user-admin';
import { BookListComponent } from './books/book-list/book-list';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, data: { renderMode: 'csr' }  },
  { 
    path: 'admin', 
    component: Admin, 
    data: { renderMode: 'csr' }, // Marcamos el padre como CSR
    children: [
      // /admin/books cargará la lista (que ahora también tiene el formulario)
      { path: 'books', component: BookListComponent },
      
      // Redirigimos /admin a /admin/books
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      
      // ¡HEMOS ELIMINADO LAS RUTAS 'books/add' y 'books/edit/:id'!
    ]
  },
  { path: 'user', component: User, data: { renderMode: 'csr' }  },
  { path: 'users', component: UserAdmin, data: { renderMode: 'csr' }  },
  { path: '**', redirectTo: '/login' }
];