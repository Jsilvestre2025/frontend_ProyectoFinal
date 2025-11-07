import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
export interface Loan {
  _id?: string;
  bookId: any;
  userId: any;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  status: 'active' | 'returned' | 'overdue';
  createdAt?: Date;
}

export interface LoanResponse {
  success: boolean;
  loans?: Loan[];
  loan?: Loan;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = environment.apiUrl + '/prestamos';
  
  loans = signal<Loan[]>([]);

  constructor(private http: HttpClient) {}

  // Obtener préstamos
  getLoans(userId?: string, role?: string): Observable<LoanResponse> {
    let params = '';
    if (userId && role) {
      params = `?userId=${userId}&role=${role}`;
    }
    return this.http.get<LoanResponse>(`${this.apiUrl}${params}`);
  }

  // Crear préstamo
  createLoan(loan: Partial<Loan>): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.apiUrl, loan);
  }

  // Devolver libro
  returnBook(id: string): Observable<LoanResponse> {
    return this.http.put<LoanResponse>(`${this.apiUrl}/${id}/return`, {});
  }
}
