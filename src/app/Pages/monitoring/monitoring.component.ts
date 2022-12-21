import { Component, OnInit } from '@angular/core';
import { FireStoreService } from 'src/app/Services/fire-store.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements OnInit {
  dataUmbral: any[] = [];
  constructor(private firestore: FireStoreService) {
    this.extractThreshold();
  }

  ngOnInit(): void {}

  extractThreshold() {
    this.firestore.getDataThreshold().subscribe((data) => {
      data.forEach((element) => {
        this.dataUmbral=[]
        this.dataUmbral.push({ ...element.payload.doc.data() });
      });
    });
  }
}
