import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css'],
})
export class CropComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private alerts: AlertsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.afAuth.currentUser.then((user) => {
    //   if (user && user.emailVerified) {
    //   } else {
    //     this.alerts.alertInfo(
    //       'No disponible',
    //       'Para acceder a este apartado debes iniciar sesión'
    //     );
    //     this.router.navigate(['/login']);
    //   }
    // });
  }
}
