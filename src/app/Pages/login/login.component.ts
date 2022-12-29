import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireBaseCodeErrorService } from 'src/app/Services/fire-base-code-error.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('inputPass') input!: ElementRef;
  showPassword: boolean = false;
  loading: boolean = false;
  loginUser: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alerts: AlertsService,
    private codeError: FireBaseCodeErrorService,
    private renderer2: Renderer2
  ) {
    this.loginUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login() {
    const email = this.loginUser.value.email;
    const password = this.loginUser.value.password;
    if (email == '' || password == '') {
      this.alerts.alertError('Completa todos los campos del formulario');
      return;
    }
    this.loading = true;
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.loading = false;
        if (user.user?.emailVerified) {
          this.alerts.alertSuccess(
            'Correo: ' + user.user?.email,
            3000,
            'Bienvenido, ahora puedes usar todas las herramientas'
          );
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/verify']);
        }
      })
      .catch((error) => {
        this.loading = false;
        if (
          this.codeError.codeErrors(error.code) ==
          'El correo no se encunetra registrado'
        ) {
          this.alerts.alertQuestion();
        } else {
          this.alerts.alertError(this.codeError.codeErrors(error.code), 4000);
        }
      });
  }

  loginGoogle() {
    this.loading = true;
    this.afAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((user) => {
        this.loading = false;
        this.alerts.alertSuccess(
          'Usuario: ' + user.user?.displayName,
          3000,
          'Bienvenido, ahora puedes usar todas las herramientas'
        );
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.loading = false;
        this.alerts.alertError(this.codeError.codeErrors(error.code), 4000);
      });
  }

  showPass(): void {
    const input = this.input.nativeElement;
    if (input.type === 'password') {
      this.renderer2.setAttribute(input, 'type', 'text');
      this.showPassword = !this.showPassword;
    } else {
      this.renderer2.setAttribute(input, 'type', 'password');
      this.showPassword = !this.showPassword;
    }
  }
}
