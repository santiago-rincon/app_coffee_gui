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
      sensor: 'PT100',
      lastMeasure: '',
      dateAndTime: '',
    },
    {
      title: 'Humedad',
      img: '../../../assets/humedad.png',
      sensor: 'PT100',
      lastMeasureA: '',
      lastMeasureS: '',
      dateAndTimeA: '',
      dateAndTimeS: '',
    },
    {
      title: 'CO',
      img: '../../../assets/co2.png',
      sensor: 'PT100',
      lastMeasure: '',
      dateAndTime: '',
    },
    {
      title: 'Radiación Solar',
      img: '../../../assets/rd.png',
      sensor: 'PT100',
      lastMeasure: '',
      dateAndTime: '',
    },
  ];
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService,
    private firestore: FireStoreService
  ) {
    this.firestore.getLastData('Temperatura').subscribe((data) => {
      const date = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.parseTime(0, data, '°C', date);
    });
    this.firestore.getLastData('HumedadA').subscribe((data) => {
      const date = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[1].lastMeasureA =
        data[0].payload.doc.data().measure + ' %';
      if (date.getMinutes() == 0) {
        this.cards[1].dateAndTimeA =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          '-' +
          date.getHours() +
          ':00';
      } else {
        this.cards[1].dateAndTimeA =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          '-' +
          date.getHours() +
          ':' +
          date.getMinutes();
      }
    });
    this.firestore.getLastData('HumedadS').subscribe((data) => {
      const date = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.cards[1].lastMeasureS =
        data[0].payload.doc.data().measure + ' %';
      if (date.getMinutes() == 0) {
        this.cards[1].dateAndTimeS =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          '-' +
          date.getHours() +
          ':00';
      } else {
        this.cards[1].dateAndTimeS =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          '-' +
          date.getHours() +
          ':' +
          date.getMinutes();
      }
    });
    this.firestore.getLastData('CO2').subscribe((data) => {
      const date = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.parseTime(2, data, 'ppm', date);
    });
    this.firestore.getLastData('Rad').subscribe((data) => {
      const date = new Date(
        data[0].payload.doc.data().dateAndTime.seconds * 1000 +
          data[0].payload.doc.data().dateAndTime.nanoseconds / 1000000
      );
      this.parseTime(3, data, 'U', date);
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

  parseTime(position: number, data: any[], unity: string, date: any) {
    this.cards[position].lastMeasure =
      data[0].payload.doc.data().measure + ' ' + unity;
    if (date.getMinutes() == 0) {
      this.cards[position].dateAndTime =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        '-' +
        date.getHours() +
        ':00';
    } else {
      this.cards[position].dateAndTime =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        '-' +
        date.getHours() +
        ':' +
        date.getMinutes();
    }
  }
}
