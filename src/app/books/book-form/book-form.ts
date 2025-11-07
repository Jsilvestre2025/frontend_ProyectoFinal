import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from '../../services/books';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = signal(false);
  bookId: string | null = null;
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Obtener el ID del libro desde la URL
    this.bookId = this.route.snapshot.paramMap.get('id');

    if (this.bookId) {
      this.isEditMode.set(true);
      this.loadBook();
    }
  }

  initForm() {
    const currentYear = new Date().getFullYear();

    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
      category: ['', Validators.required],
      publishYear: [
        currentYear,
        [Validators.required, Validators.min(1000), Validators.max(currentYear)],
      ],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      availableCopies: [1, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  loadBook() {
    if (this.bookId) {
      this.loading.set(true);
      this.bookService.getBookById(this.bookId).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success && response.book) {
            this.bookForm.patchValue(response.book);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Error al cargar el libro');
          console.error('Error al cargar libro:', err);
        },
      });
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.markFormGroupTouched(this.bookForm);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const bookData: Book = this.bookForm.value;

    if (this.isEditMode() && this.bookId) {
      // Modo edición
      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            alert('Libro actualizado exitosamente');
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Error al actualizar el libro');
          console.error('Error al actualizar libro:', err);
        },
      });
    } else {
      // Modo creación
      this.bookService.createBook(bookData).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.success) {
            alert('Libro creado exitosamente');
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          this.loading.set(false);
          if ((err = 400)) {
            this.error.set('Error al crear el libro, ISBN existente');
            console.error('Error al crear libro:', err);
          } else {
            this.error.set('Error al crear el libro');
            console.error('Error al crear libro:', err);
          }

        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helpers para validación en el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `Valor mínimo: ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Valor máximo: ${field.errors?.['max'].max}`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato inválido (solo números y guiones)';
    }
    return '';
  }
}
