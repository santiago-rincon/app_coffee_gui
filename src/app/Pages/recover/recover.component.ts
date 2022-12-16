import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireBaseCodeErrorService } from 'src/app/Services/fire-base-code-error.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css'],
})
export class RecoverComponent implements OnInit {
  loading: boolean = false;
  recoverPassword: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alerts: AlertsService,
    private codeError: FireBaseCodeErrorService
  ) {
    this.recoverPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  recover() {
    const email = this.recoverPassword.value.email;
    if (email == '') {
      this.alerts.alertError('Ingresa un correo electrónico');
      return;
    }
    this.loading = true;
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.alerts.alertSuccess(
          'Te enviamos un correo para reestablecer tu contraseña, revisa el spam si no encuentras el correo en la bandeja de entrada',
          6000,
          'Revisa tu correo'
        );
        this.router.navigate(['/login']);
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
}
