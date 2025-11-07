import { Component, OnInit, signal } from '@angular/core';
import { User, UserResponse, UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.css',
})
export class UserAdmin implements OnInit {
  // Señales (Signals) para manejar el estado
  users = signal<User[]>([]);

  // Señal para el formulario de nuevo usuario
  newUser = signal<User>({
    username: '',
    password: '', // El formulario debería tener un campo de password
    name: '',
    email: '',
    role: 'user', // Valor por defecto
  });

  loading = signal(false);
  message = signal('');

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Cargar todos los usuarios
  loadUsers() {
    this.loading.set(true);
    this.message.set('');

    this.userService.getUsers().subscribe({
      next: (response: UserResponse) => {
        if (response.success && (response.users || response.user)) {
          const userList = response.users || response.users || [];
          this.users.set(userList);
          this.message.set(`${userList.length} usuarios cargados`);
        } else {
          this.message.set(response.message || 'No se pudieron cargar los usuarios');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.loading.set(false);
        this.message.set('Error de conexión al cargar usuarios');
      },
    });
  }

  // Crear nuevo usuario
  createUser() {
    const userToCreate = this.newUser();
    if (!userToCreate.username || !userToCreate.password || !userToCreate.email) {
      this.message.set('Username, password y email son requeridos');
      return;
    }

    this.loading.set(true);
    this.userService.createUser(userToCreate).subscribe({
      next: (response: UserResponse) => {
        if (response.success && response.user) {
          // Agrega el nuevo usuario a la lista usando 'update'
          this.users.update((currentUsers) => [response.user!, ...currentUsers]);

          // Resetea el formulario
          this.newUser.set({ username: '', password: '', name: '', email: '', role: 'user' });
          this.message.set('Usuario creado exitosamente');
        } else {
          this.message.set(response.message || 'Error al crear usuario');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error creando usuario:', error);
        this.loading.set(false);
        // Captura el error de 'username' duplicado (si tu API lo envía)
        if (error.status === 400 && error.error?.message.includes('ya existe')) {
          this.message.set(error.error.message);
        } else {
          this.message.set('Error creando usuario');
        }
      },
    });
  }

  // Eliminar usuario
  deleteUser(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.userService.deleteUser(id).subscribe({
      next: (response: UserResponse) => {
        if (response.success) {
          // Filtra el usuario eliminado de la lista
          this.users.update((currentUsers) => currentUsers.filter((user) => user._id !== id));
          this.message.set('Usuario eliminado exitosamente');
        } else {
          this.message.set(response.message || 'Error al eliminar');
        }
      },
      error: (error) => {
        console.error('Error eliminando usuario:', error);
        this.message.set('Error eliminando usuario');
      },
    });
  }

  // Alternar rol del usuario (Ejemplo de 'update')
  toggleUserRole(user: User) {
    if (!user._id) return;

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const updatedUser = { role: newRole }; // Solo envía el campo a cambiar

    this.userService.updateUser(user._id, updatedUser as User).subscribe({
      // (Se castea a 'User' para que coincida)
      next: (response: UserResponse) => {
        if (response.success && response.user) {
          // Actualiza el usuario en la lista
          this.users.update((currentUsers) =>
            currentUsers.map((u) => (u._id === user._id ? response.user! : u))
          );
          this.message.set(`Rol de ${response.user.name} actualizado a ${response.user.role}`);
        } else {
          this.message.set(response.message || 'Error al actualizar');
        }
      },
      error: (error) => {
        console.error('Error actualizando usuario:', error);
        this.message.set('Error actualizando usuario');
      },
    });
  }
}
