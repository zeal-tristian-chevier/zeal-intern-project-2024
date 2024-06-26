import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerError: string = '';
  successfulSignUp: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: fb.control('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: fb.control('', [Validators.required, Validators.minLength(7)]),
    });
  }

  public onSubmit() {
    this.auth
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .then((res) => {
        if (res.data.user != null && res.data.user.role === 'authenticated') {
          this.router.navigate(['/dashboard']);
        } else if (res.error.message != null) {
          this.registerError = res.error.message;
        }
      })
      .catch((err) => {
        console.log(err);
        if (this.registerError.length === 0) {
          this.registerError = err.message;
        }
      });
  }
}
