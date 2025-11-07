import { Component, input, signal, computed } from '@angular/core';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { BotonPersonalizado } from '../boton-personalizado/boton-personalizado';
import { BookListComponent } from '../books/book-list/book-list';
import { LoansAdminComponent } from '../books/loans-admin/loans-admin';
import { UserAdmin } from "../user-interfas/user-admin/user-admin";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, BookListComponent, LoansAdminComponent, UserAdmin],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  router: any;
  constructor(public authService: AuthService) {}
  // Input signal para recibir el nombre de usuario
  readonly username = input<string | null>(null);
  // Signals para el estado del panel
  readonly activeSection = signal<'Libros' | 'Usuarios' | 'Prestamos'>('Libros');
  readonly lastLogin = signal(new Date());
  // Computed signals para datos derivados
  readonly welcomeTitle = computed(() => {
    const user = this.username();
    return user ? `Panel de Administración - ${user}` : 'Panel de Administración';
  });
  readonly formattedLastLogin = computed(() => {
    return this.lastLogin().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });
  readonly sectionTitle = computed(() => {
    const section = this.activeSection();
    switch (section) {
      case 'Libros': return '📊 Libros';
      case 'Usuarios': return '👥 Gestión de Usuarios';
      case 'Prestamos': return '⚙️ Prestamos';
      default: return '📊 Libros';
    }
  });
  // Método para cambiar de sección
  changeSection(section: 'Libros' | 'Usuarios' | 'Prestamos') {
    this.activeSection.set(section);
  }
  
  // Método para simular acción
  performAction(action: string) {
    alert(`Acción ejecutada: ${action}`);
  }
  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']); 
  // }
}
