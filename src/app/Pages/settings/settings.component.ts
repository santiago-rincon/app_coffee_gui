import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  dataUmbral: any[] = [];
  umbralSet: FormGroup;
  variables = [
    'Temperatura',
    'Humedad Ambiente',
    'Humedad del Suelo',
    'CO2',
    'Radiación Solar',
  ];
  unity: string = '-';
  constructor(
    private firestore: FireStoreService,
    private fb: FormBuilder,
    private alerts: AlertsService
  ) {
    this.extractThreshold();
    this.umbralSet = fb.group({
      parameter: ['', [Validators.required]],
      value: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  extractThreshold() {
    this.firestore.getDataThreshold().subscribe((data) => {
      data.forEach((element) => {
        this.dataUmbral = [];
        this.dataUmbral.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  filter(e: any) {
    let value = e.target.value;
    switch (value) {
      case 'Temperatura':
        this.unity = '°C';
        break;
      case 'Humedad Ambiente':
        this.unity = '%';
        break;
      case 'Humedad del Suelo':
        this.unity = '%';
        break;
      case 'CO2':
        this.unity = 'ppm';
        break;
      case 'Radiación Solar':
        this.unity = 'U';
        break;
    }
  }

  updateUmbral() {
    const parameter = this.umbralSet.value.parameter;
    const value = this.umbralSet.value.value;
    if (parameter == '' || value == '') {
      this.alerts.alertError('Completa todos los campos del formulario');
    } else {
      switch (parameter) {
        case 'Temperatura':
          this.firestore.updateData(
            this.dataUmbral[0].id,
            { Temperatura: value },
            'Umbrales'
          );
          break;
        case 'Humedad Ambiente':
          this.firestore.updateData(
            this.dataUmbral[0].id,
            { Humedad: value },
            'Umbrales'
          );
          break;
        case 'Humedad del Suelo':
          this.firestore.updateData(
            this.dataUmbral[0].id,
            { Humedad: value },
            'Umbrales'
          );
          break;
        case 'CO2':
          this.firestore.updateData(
            this.dataUmbral[0].id,
            { CO2: value },
            'Umbrales'
          );
          break;
        case 'Radiación Solar':
          this.firestore.updateData(
            this.dataUmbral[0].id,
            { Rad: value },
            'Umbrales'
          );
          break;
      }
      this.alerts.alertSuccess(
        'El umbral de la varibale ' +
          parameter.toLowerCase() +
          ' fue actualizada correctamente',
        4000,
        'Actualizado'
      );
    }
  }
}
