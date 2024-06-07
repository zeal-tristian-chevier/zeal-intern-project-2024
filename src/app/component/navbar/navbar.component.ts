import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TabMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  items: MenuItem[] = [];
  activeItem!: MenuItem;
  private authStatusSubscription!: Subscription;

  constructor(public auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.isAuthenticated = await this.auth.isAuthenticated();
    this.items = this.getMenuItems();
    this.activeItem = this.items[0];

    this.authStatusSubscription = this.auth.authStatus$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.items = this.getMenuItems();
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  ngOnDestroy() {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  getMenuItems(): MenuItem[] {
    return [
      { label: 'Dashboard', routerLink: '/dashboard', visible: this.isAuthenticated },
      { label: 'Logout', routerLink: '/login', visible: this.isAuthenticated, command: () => this.logOut() },
      { label: 'Login', routerLink: '/login', visible: !this.isAuthenticated },
      { label: 'Register', routerLink: '/register', visible: !this.isAuthenticated },
    ];
  }

  onActiveItemChange(event: MenuItem): void {
    console.log('Active item changed:', event);
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Error during sign-out:', error);
    });
  }
}
