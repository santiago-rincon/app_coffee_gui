import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.css'],
})
export class VariablesComponent implements OnInit {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService
  ) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
      } else {
        this.alerts.alertInfo(
          'No disponible',
          'Para acceder a este apartado debes iniciar sesión'
        );
        this.router.navigate(['/login'])

      }
    });
  }
}
