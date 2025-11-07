import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from '../../services/books';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookListComponent implements OnInit {
  searchTerm = '';
  filteredBooks = signal<Book[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    public bookService: BookService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading.set(true);
    this.error.set('');
    
    this.bookService.getBooks().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.books) {
          this.bookService.books.set(response.books);
          this.filteredBooks.set(response.books);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error al cargar libros');
        console.error('Error al cargar libros:', err);
      }
    });
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.bookService.books().filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
    this.filteredBooks.set(filtered);
  }

  addBook() {
    this.router.navigate(['/books/add']); //
  }

  editBook(id: string) {
    this.router.navigate(['/books/edit', id]); //
  }

  deleteBook(id: string, title: string) {
    if (confirm(`¿Está seguro de eliminar el libro "${title}"?`)) {
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Libro eliminado exitosamente');
            this.loadBooks();
          }
        },
        error: (err) => {
          console.error('Error al eliminar libro:', err);
          alert('Error al eliminar el libro');
        }
      });
    }
  }
}
