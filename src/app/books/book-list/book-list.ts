import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from '../../services/books';
import { AuthService } from '../../services/auth';
import { BookFormComponent } from '../book-form/book-form';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookListComponent implements OnInit {
  searchTerm = '';
  filteredBooks = signal<Book[]>([]);
  loading = signal(false);
  error = signal('');
  //NUEVAS SIGNALS PARA CONTROLAR LA VISTA
  viewMode = signal<'list' | 'form'>('list'); // 'list' o 'form'
  currentBookId = signal<string | null>(null); // ID del libro a editar
  constructor(
    public bookService: BookService,
    public authService: AuthService,
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

  showAddForm() {
    this.currentBookId.set(null); // No hay ID porque es un libro nuevo
    this.viewMode.set('form'); // Cambia la vista al formulario
  }

  showEditForm(id: string) {
    this.currentBookId.set(id); // Guarda el ID del libro a editar
    this.viewMode.set('form'); // Cambia la vista al formulario
  }
  // FUNCIÓN PARA VOLVER A LA LISTA
  // Esta se llamará desde el componente hijo (el formulario)
  onFormClosed() {
    this.viewMode.set('list'); //Cambia la vista de vuelta a 'list'
    this.loadBooks(); //Recarga los libros por si hay nuevos datos
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
