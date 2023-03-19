import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';

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
      sensor: 'SHT 40',
      lastMeasure: '',
      dateAndTime: new Date(),
    },
    {
      title: 'Humedad',
      img: '../../../assets/humedad.png',
      sensor: 'SHT 31',
      lastMeasureA: '',
      lastMeasureS: '',
      dateAndTimeA: new Date(),
      dateAndTimeS: new Date(),
    },
    {
      title: 'CO',
      img: '../../../assets/co2.png',
      sensor: 'NDIR',
      lastMeasure: '',
      dateAndTime: new Date(),
    },
    {
      title: 'Radiación solar',
      img: '../../../assets/rd.png',
      sensor: 'GY 30',
      lastMeasure: '',
      dateAndTime: new Date(),
    },
  ];
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService,
    private firestore: FireStoreService
  ) {
    this.firestore.getLastData('Temperatura').subscribe((data) => {
      this.cards[0].dateAndTime = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[0].lastMeasure=data[0].payload.doc.data().measure + ' °C'
    });
    this.firestore.getLastData('HumedadA').subscribe((data) => {
      this.cards[1].dateAndTimeA = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[1].lastMeasureA = data[0].payload.doc.data().measure + ' %';
    });
    this.firestore.getLastData('HumedadS').subscribe((data) => {
      this.cards[1].dateAndTimeS = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[1].lastMeasureS = data[0].payload.doc.data().measure + ' %';
    });
    this.firestore.getLastData('CO2').subscribe((data) => {
      this.cards[2].dateAndTime = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[2].lastMeasure = data[0].payload.doc.data().measure + ' ppm';
    });
    this.firestore.getLastData('Rad').subscribe((data) => {
      this.cards[3].dateAndTimeS = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[3].lastMeasureS = data[0].payload.doc.data().measure + ' &#956;mol/s.m&#178;';
    });
  }

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
      } else {
        this.alerts.alertInfo(
          'No disponible',
          'Para acceder a este apartado debes iniciar sesión'
        );
        this.router.navigate(['/login']);
      }
    });
  }
}
