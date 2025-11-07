import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { RouterOutlet, Router } from '@angular/router'; // 1. Importa Router

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet
  ],
  template: `
    <!-- Tu plantilla de layout -->
    <div class="d-flex flex-column min-vh-100 bg-gradient">
      <header class="bg-primary bg-opacity-10 text-center py-4 shadow-sm">
        <div class="container">
          <h1 class="display-5 fw-light text-white mb-3">🔐 Sistema de Gestion de Biblioteca</h1>
          
          <!-- 2. Botón descomentado para que funcione -->
          @if (authService.isLoggedIn()) {
            <button class="btn btn-danger btn-lg rounded-pill" (click)="logout()">
              🚪 Cerrar Sesión
            </button>
          }
        </div>
      </header>

      <main class="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div class="container">
          <!-- 
            3. ¡SIMPLIFICADO! 
            Solo necesitas UN router-outlet. 
            El enrutador (controlado por app.routes.ts) decidirá
            si muestra LoginComponent, AdminComponent, etc., aquí.
            Esto elimina el error de que el outlet se destruya.
          -->
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="bg-dark bg-opacity-25 text-center py-3">
        <p class="text-white-50 mb-0">Desarrollado con ❤️ usando Angular 20 y Signals</p>
      </footer>
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  // 4. El Router debe ser INYECTADO en el constructor, no declarado como 'any'
  constructor(
    public authService: AuthService,
    private router: Router // <-- Inyectado aquí
  ) {}

  ngOnInit() {
    this.authService.checkStoredUser();
  }

  // 5. Corregido con async/await para solucionar el error de navegación
  async logout() {
    // PRIMERO, navega a la página de login y espera a que termine.
    await this.router.navigate(['/login']);
    
    // SEGUNDO, actualiza el estado (esto cambiará el @if de arriba).
    this.authService.logout();
  }
}