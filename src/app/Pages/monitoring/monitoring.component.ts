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
  constructor(
    private firestore: FireStoreService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService
  ) {
    this.extractThreshold();
  }

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

  extractThreshold() {
    this.firestore.getDataThreshold().subscribe((data) => {
      data.forEach((element) => {
        this.dataUmbral = [];
        this.dataUmbral.push({ ...element.payload.doc.data() });
      });
    });
  }
}
