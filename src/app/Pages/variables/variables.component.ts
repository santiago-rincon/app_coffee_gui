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
  cards = [
    {
      title: 'Temperatura',
      img: '../../../assets/temperatura.png',
      sensor: 'PT100',
      lastMeasure: '32°C',
      dateAndTime: '18/12/2022-3:00pm'
    },
    {
      title: 'Humedad',
      img: '../../../assets/humedad.png',
      sensor: 'PT100',
      lastMeasure: '32°C',
      dateAndTime: '18/12/2022-3:00pm'
    },
    {
      title: 'CO2',
      img: '../../../assets/co2.png',
      sensor: 'PT100',
      lastMeasure: '32°C',
      dateAndTime: '18/12/2022-3:00pm'
    },
    {
      title: 'Radiación Solar',
      img: '../../../assets/rd.png',
      sensor: 'PT100',
      lastMeasure: '32°C',
      dateAndTime: '18/12/2022-3:00pm'
    }
  ];
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
