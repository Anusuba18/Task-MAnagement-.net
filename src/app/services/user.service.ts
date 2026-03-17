import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  api = 'http://localhost:5020/api/User';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(this.api);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}