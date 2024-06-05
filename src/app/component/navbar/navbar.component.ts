import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  token!: string;
  constructor(public auth: AuthService, private router: Router) {}

  logOut() {
    this.auth
      .signOut()
      .then(() => {
        // Sign-out successful, navigate to home page
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error during sign-out:', error);
        // Handle sign-out error if needed
      });
  }
}
