import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService, Loan } from '../../services/loans';
import { BookService, Book } from '../../services/books';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-loan-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-management.html',
  styleUrl: './loan-management.css'
})
export class LoanManagementComponent implements OnInit {
  loans = signal<Loan[]>([]);
  filteredLoans = signal<Loan[]>([]);
  loading = signal(false);
  error = signal('');
  activeTab = signal<'active' | 'returned'>('active');

  constructor(
    private loanService: LoanService,
    public bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.loading.set(true);
    this.error.set('');
    
    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id;
    const role = currentUser?.role;

    this.loanService.getLoans(userId, role).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.loans) {
          this.loanService.loans.set(response.loans);
          this.filterLoans();
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al cargar préstamos');
        console.error('Error al cargar préstamos:', err);
      }
    });
  }

  filterLoans() {
    const tab = this.activeTab();
    const filtered = this.loanService.loans().filter(loan => 
      tab === 'active' ? loan.status === 'active' : loan.status === 'returned'
    );
    this.filteredLoans.set(filtered);
  }

  returnBook(loanId: string) {
    if (confirm('¿Desea devolver este libro?')) {
      this.loanService.returnBook(loanId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Libro devuelto exitosamente');
            this.loadLoans();
          }
        },
        error: (err) => {
          console.error('Error al devolver libro:', err);
          alert('Error al devolver el libro');
        }
      });
    }
  }

  changeTab(tab: 'active' | 'returned') {
    this.activeTab.set(tab);
    this.filterLoans();
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-AR');
  }

  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(dueDate: Date): boolean {
    return this.getDaysUntilDue(dueDate) < 0;
  }
}
