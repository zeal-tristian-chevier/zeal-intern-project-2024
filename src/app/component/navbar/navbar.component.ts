import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs'; // Import Observable and Subscription
import { User } from '@supabase/supabase-js'; // Import User from Supabase

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
  currentUser$!: Observable<User | null>;

  constructor(public auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.currentUser$ = this.auth.currentUser; // Assigning the observable here
    this.items = this.getMenuItems();
    this.activeItem = this.items[0];
    // Subscribe to authentication status changes
    this.authStatusSubscription = this.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user; // True if user is logged in
      this.items = this.getMenuItems(); // Update menu items based on auth status
      this.cdr.detectChanges(); // Manually trigger change detection
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
    // This function can be implemented to handle active menu item change
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Error during sign-out:', error);
    });
  }
}
