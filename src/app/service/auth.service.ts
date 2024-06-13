import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase_client: SupabaseClient;
  private _currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  authStatus$ = this._currentUser.asObservable();

  constructor() {
    this.supabase_client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    // Check initial authentication status
    this.checkAuthStatus();

    // Listen for auth changes
    this.supabase_client.auth.onAuthStateChange((event, session) => {
      this.handleAuthStateChange(event, session);
    });
  }

  // Get current user as an observable
  get currentUser() {
    return this.authStatus$;
  }

  // Register a new user
  signUp(email: string, password: string): Promise<any> {
    return this.supabase_client.auth
      .signUp({
        email,
        password,
      })
      .then((response) => {
        this.checkAuthStatus(); // Update the user state after sign up
        return response;
      });
  }

  // Log in an existing user
  signIn(email: string, password: string): Promise<any> {
    return this.supabase_client.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((response) => {
        this.checkAuthStatus(); // Update the user state after sign in
        return response;
      });
  }

  // Sign out the current user
  public signOut(): Promise<any> {
    return this.supabase_client.auth.signOut().then((response) => {
      this._currentUser.next(null); // Clear the current user on sign out
      return response;
    });
  }

  // Check if the user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const res = await this.supabase_client.auth.getUser();
      return res.data.user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Private method to handle authentication state changes
  private handleAuthStateChange(event: AuthChangeEvent, session: Session | null) {
    if (session) {
      const user: User = session.user as User;
      this._currentUser.next(user); // Store the user object
    } else {
      this._currentUser.next(null); // No user is authenticated
    }
  }

  // Check the current authentication status
  private async checkAuthStatus() {
    const res = await this.supabase_client.auth.getUser();
    if (res.data.user) {
      const user: User = res.data.user as User;
      this._currentUser.next(user); // Update the current user
    } else {
      this._currentUser.next(null); // No user is authenticated
    }
  }
}
