import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireBaseCodeErrorService } from 'src/app/Services/fire-base-code-error.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  registerUser: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private alerts: AlertsService,
    private codeError: FireBaseCodeErrorService
  ) {
    this.registerUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  registerNewUser() {
    const email = this.registerUser.value.email;
    const password = this.registerUser.value.password;
    const repeatPassword = this.registerUser.value.repeatPassword;
    if (email == '' || password == '' || repeatPassword == '') {
      this.alerts.alertError('Completa todos los campos del formulario');
      return;
    } else if (password != repeatPassword) {
      this.alerts.alertError('Las contraseñas no coinciden');
      return;
    }
    this.loading = true;
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.loading = false;
        this.verifyUser(user)
      })
      .catch((error) => {
        this.loading = false;
        this.alerts.alertError(this.codeError.codeErrors(error.code));
      });
  }

  verifyUser(user:any) {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.alerts.alertSuccess(
          'El correo ' + user.user?.email + ' fue registrado exitosamente',
          5000
        );
        this.router.navigate(['/verify']);
      });
  }
}
