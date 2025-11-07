import { Component, signal, output, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { BotonPersonalizado } from '../boton-personalizado/boton-personalizado';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BotonPersonalizado],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');
  constructor(private authService: AuthService,
    private router: Router) {}
  // Output signal para comunicar el login exitoso
  readonly loginSuccess = output<string>();

  // Computed signal para validar el formulario
  readonly isFormValid = computed(() => {
    return this.username().length > 0 && this.password().length > 0;
  })

  // Computed signal para el estado del botón
  readonly buttonText = computed(() => {
    return this.loading() ? '🔄 Iniciando sesión...' : '🔑 Iniciar Sesión';
  })
    // Método para actualizar username
  updateUsername(value: string){
    this.username.set(value);
    this.cleanError();
  }
  // Método para actualizar password
  updatePassword(value: string) {
    this.password.set(value);
    this.cleanError();
  }
  private cleanError(){
    if (this.error()){
      this.error.set('');
    }
  }
  onLogin() {
    if (!this.username || !this.password) {
      this.error.set('Por favor complete todos los campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const username = this.username();
    const password = this.password();
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.user) {
          this.authService.setUser(response.user);
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'user') {
            this.router.navigate(['/user']);
          }
        } else {
          this.error.set(response.message || 'Error de autenticación');
        }
      },
      error: (err) => {
        this.loading.set(false);

        if (err.status === 401) {
          // El servidor respondió "No autorizado"
          this.error.set('Usuario o contraseña incorrectos');
        } else {
          // Cualquier otro error (ej. 500, o el servidor está caído)
          this.error.set('Error de conexión con el servidor');
        }
      },
    });
  }
}
