import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase_client: SupabaseClient;
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor() {
    this.supabase_client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );

    // Check initial authentication status
    this.checkAuthStatus();

    // Listen for auth changes
    this.supabase_client.auth.onAuthStateChange((event, session) => {
      this.authStatusSubject.next(!!session);
    });
  }

  //Register
  signUp(email: string, password: string): Promise<any> {
    return this.supabase_client.auth
      .signUp({
        email,
        password,
      })
      .then((response) => {
        this.checkAuthStatus();
        return response;
      });
  }

  //Login
  signIn(email: string, password: string): Promise<any> {
    return this.supabase_client.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((response) => {
        this.checkAuthStatus();
        return response;
      });
  }

  //SignOut
  public signOut(): Promise<any> {
    return this.supabase_client.auth.signOut().then((response) => {
      this.checkAuthStatus();
      return response;
    });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const res = await this.supabase_client.auth.getUser();
      return res.data.user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  private async checkAuthStatus() {
    const isAuthenticated = await this.isAuthenticated();
    this.authStatusSubject.next(isAuthenticated);
  }
}
