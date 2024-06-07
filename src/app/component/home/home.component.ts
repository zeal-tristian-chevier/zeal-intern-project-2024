import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isAuthenticated: boolean = false;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.isAuthenticated = await this.auth.isAuthenticated();
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }
}
