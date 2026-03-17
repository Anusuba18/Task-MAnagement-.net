import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent {
  user: any = {};

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.user.role = 'User';
    this.auth.register(this.user).subscribe(() => {
      alert('User Registered');
      this.router.navigate(['/login']);
    });
  }
}