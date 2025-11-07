import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
export interface User {
  _id?: string; 
  username: string; 
  password?: string; 
  role: string; 
  name: string; 
  email: string;
  createdAt?: Date;
}

export interface UserResponse {
  success: boolean;
  users?: User[];
  user?: User;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/list`);
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}${id}`);
  }

  // Crear nuevo usuario
  createUser(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}`, user);
  }

  // Actualizar usuario
  updateUser(id: string, user: User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`);
  }
}