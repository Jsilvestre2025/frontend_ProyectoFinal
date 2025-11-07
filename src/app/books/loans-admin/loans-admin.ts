import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, Loan } from '../../services/loans';
import { BookService, Book } from '../../services/books';
import { AuthService } from '../../services/auth';

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-loans-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans-admin.html',
  styleUrl: './loans-admin.css'
})
export class LoansAdminComponent implements OnInit {
  loans = signal<Loan[]>([]);
  books = signal<Book[]>([]);
  users = signal<User[]>([]); 
  loading = signal(false);
  error = signal('');
  
  selectedBookId = '';
  selectedUserId = '';
  dueDays = 14;

  constructor(
    private loanService: LoanService,
    private bookService: BookService,
    private authService: AuthService 
  ) {}

  ngOnInit() {
    this.loadLoans();
    this.loadBooks();
    this.loadUsers();
  }

  loadLoans() {
    this.loading.set(true);
    this.loanService.getLoans().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.loans) {
          this.loanService.loans.set(response.loans);
          this.loans.set(response.loans);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al cargar préstamos');
        console.error('Error al cargar préstamos:', err);
      }
    });
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (response) => {
        if (response.success && response.books) {
          this.books.set(response.books);
        }
      },
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  loadUsers() {
    this.authService.getStudents().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.users.set(response.users);
        }
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  createLoan() {
    if (!this.selectedBookId || !this.selectedUserId) {
      alert('Seleccione un libro y un usuario');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + this.dueDays);

    const loanData: Partial<Loan> = {
      bookId: this.selectedBookId,
      userId: this.selectedUserId,
      dueDate: dueDate
    };

    this.loanService.createLoan(loanData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Préstamo creado exitosamente');
          this.selectedBookId = '';
          this.selectedUserId = '';
          this.loadLoans();
        }
      },
      error: (err) => {
        console.error('Error al crear préstamo:', err);
        alert('Error al crear el préstamo: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  returnLoan(loanId: string) {
    if (confirm('¿Desea registrar la devolución de este libro?')) {
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

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-AR');
  }
  getReturnedLoans() {
  return this.loans().filter(loan => loan.status === 'returned');
}

getActiveLoans() {
  return this.loans().filter(loan => loan.status === 'active');
}
}
