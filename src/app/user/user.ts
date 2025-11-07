import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { BookListComponent } from "../books/book-list/book-list";
import { LoanManagementComponent } from "../books/loan-management/loan-management";
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, BookListComponent, LoanManagementComponent],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  router: any;
  constructor(
    public authService: AuthService
  ) {}

  // logout() {
  //   this.authService.logout();
  //   this.router.navigate(['/login']); 
  // }
}
