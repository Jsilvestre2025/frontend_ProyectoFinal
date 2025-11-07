import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  totalCopies: number;
  stock: number;
  description: string;
  coverImage?: string;
}

export interface BookResponse {
  success: boolean;
  books?: Book[];
  book?: Book;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl + '/libros';
  
  // Signal para mantener la lista de libros
  books = signal<Book[]>([]);

  constructor(private http: HttpClient) {}

  // Obtener todos los libros
  getBooks(): Observable<BookResponse> {
    return this.http.get<BookResponse>(this.apiUrl);
  }

  // Obtener un libro por ID
  getBookById(id: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo libro
  createBook(book: Book): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, book);
  }

  // Actualizar un libro
  updateBook(id: string, book: Book): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, book);
  }

  // Eliminar un libro
  deleteBook(id: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${this.apiUrl}/${id}`);
  }
}
