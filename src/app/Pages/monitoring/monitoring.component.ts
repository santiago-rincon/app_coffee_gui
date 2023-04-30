import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements OnInit {
  dataUmbral: any[] = [];
  nodes: any[] = [];
  options: any[] = [];
  dataVariables: any[] = [
    {
      unity: '(°C)',
      collection: 'Temperatura',
      variable: 'Temperatura',
      data: [],
    },
    {
      unity: '(%)',
      collection: 'HumedadA',
      variable: 'Humedad Ambiente',
      data: [],
    },
    {
      unity: '(%)',
      collection: 'HumedadS',
      variable: 'Humedad del Suelo',
      data: [],
    },
    { unity: '(ppm)', collection: 'CO2', variable: 'CO2', data: [] },
    { unity: '(μmol/s.m²)', collection: 'Rad', variable: 'Radiación Solar', data: [] },
  ];
  constructor(
    private firestore: FireStoreService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService
  ) {
    this.extractInformation();
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

  extractInformation() {
    this.firestore.getNodes().subscribe((nodesList) => {
      this.nodes = [];
      nodesList.forEach((element) => {
        this.nodes.push(element.payload.doc.data());
      });
      this.nodes.sort((a, b) => a.nodeId - b.nodeId);
      this.options = [];
      this.nodes.forEach((element) => {
        this.options.push({
          id: element.nodeId,
          selected: true,
          disabled: false,
        });
      });
    });
    this.firestore.getDataThreshold().subscribe((data) => {
      this.dataUmbral = [];
      data.forEach((element) => {
        this.dataUmbral.push({ ...element.payload.doc.data() });
      });
    });
    this.dataVariables.forEach((element) => {
      this.firestore.getDataVariables(element.collection).subscribe((info) => {
        element.data = [];
        info.forEach((e) => {
          const date = new Date(
            e.payload.doc.data().dateAndTime.seconds * 1000 +
              e.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          element.data.push({
            dateAndTime: date,
            measure: e.payload.doc.data().measure,
            node: e.payload.doc.data().node,
          });
        });
      });
    });
  }
}
