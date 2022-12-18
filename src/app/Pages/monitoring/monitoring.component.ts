import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements OnInit {
  show: string = 'Temperatura';
  variables: string[] = ['Temperatura', 'Humedad', 'CO2', 'Radiación Solar'];
  constructor() {}

  ngOnInit(): void {}

  select(e: any) {
    switch (e.target.value) {
      case 'Temperatura':
        this.show = 'Temperatura';
        break;
      case 'Humedad':
        this.show = 'Humedad';
        break;
      case 'CO2':
        this.show = 'CO2';
        break;
      case 'Radiación Solar':
        this.show = 'rad';
        break;
    }
  }
}
