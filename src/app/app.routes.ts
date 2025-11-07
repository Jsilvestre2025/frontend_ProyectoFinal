import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Admin } from './admin/admin';
import { User } from './user/user';
import { BookFormComponent } from './books/book-form/book-form';
import { UserAdmin } from './user-interfas/user-admin/user-admin';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin },
  { path: 'user', component: User },
  { path: 'books/add', component: BookFormComponent},
  { path: 'books/edit/:id', component: BookFormComponent,
        data: { renderMode: 'csr' }  },
  { path: 'users', component: UserAdmin },
  { path: '**', redirectTo: '/login' }
];