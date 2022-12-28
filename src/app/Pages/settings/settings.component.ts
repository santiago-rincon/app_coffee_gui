import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';
import Swal from 'sweetalert2';
import { adminHashes } from 'src/app/Data/hashes';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  userAdmin: boolean = false;
  registersShow: boolean = false;
  registers: number = 0;
  dataUmbral: any[] = [];
  variableData: any[] = [];
  umbralSet: FormGroup;
  deleteRegister: FormGroup;
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
    private alerts: AlertsService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.extractThreshold();
    this.umbralSet = fb.group({
      parameter: ['', [Validators.required]],
      value: ['', Validators.required],
    });
    this.deleteRegister = fb.group({
      deleteVariable: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      for (const hash of adminHashes) {
        if (user?.uid == hash) {
          this.userAdmin = true;
        }
      }
      if (
        user &&
        user.emailVerified &&
        this.userAdmin
      ) {
      } else {
        this.alerts.alertInfo(
          'No disponible',
          'Para acceder a este apartado debes ser un usuario administrador'
        );
        this.router.navigate(['/variables/monitoring']);
      }
    });
  }

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

  numberRegister(e: any) {
    let value = e.target.value;
    switch (value) {
      case 'Temperatura':
        this.firestore
          .getDataVariablesWithoutOrder('Temperatura')
          .subscribe((data) => {
            this.variableData = [];
            data.forEach((element) => {
              this.variableData.push({
                id: element.payload.doc.id,
              });
            });
            this.registers = this.variableData.length;
            this.registersShow = true;
          });
        break;
      case 'Humedad Ambiente':
        this.firestore
          .getDataVariablesWithoutOrder('HumedadA')
          .subscribe((data) => {
            this.variableData = [];
            data.forEach((element) => {
              this.variableData.push({
                id: element.payload.doc.id,
              });
            });
            this.registers = this.variableData.length;
            this.registersShow = true;
          });
        break;
      case 'Humedad del Suelo':
        this.firestore
          .getDataVariablesWithoutOrder('HumedadS')
          .subscribe((data) => {
            this.variableData = [];
            data.forEach((element) => {
              this.variableData.push({
                id: element.payload.doc.id,
              });
            });
            this.registers = this.variableData.length;
            this.registersShow = true;
          });
        break;
      case 'CO2':
        this.firestore.getDataVariablesWithoutOrder('CO2').subscribe((data) => {
          this.variableData = [];
          data.forEach((element) => {
            this.variableData.push({
              id: element.payload.doc.id,
            });
          });
          this.registers = this.variableData.length;
          this.registersShow = true;
        });
        break;
      case 'Radiación Solar':
        this.firestore.getDataVariablesWithoutOrder('Rad').subscribe((data) => {
          this.variableData = [];
          data.forEach((element) => {
            this.variableData.push({
              id: element.payload.doc.id,
            });
          });
          this.registers = this.variableData.length;
          this.registersShow = true;
        });
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

  deleteData() {
    const variable = this.deleteRegister.value.deleteVariable;
    if (variable == '') {
      this.alerts.alertError('Selecciona una variable');
    } else {
      Swal.fire({
        title: '¿Estas seguro?',
        text:
          'Eliminarás todos los registros de ' +
          variable.toLowerCase() +
          ' almacenados en la base de datos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          switch (variable) {
            case 'Temperatura':
              for (const id of this.variableData) {
                this.firestore.deleteData(id.id, 'Temperatura');
              }
              break;
            case 'Humedad Ambiente':
              for (const id of this.variableData) {
                this.firestore.deleteData(id.id, 'HumedadA');
              }
              break;
            case 'Humedad del Suelo':
              for (const id of this.variableData) {
                this.firestore.deleteData(id.id, 'HumedadS');
              }
              break;
            case 'CO2':
              for (const id of this.variableData) {
                this.firestore.deleteData(id.id, 'CO2');
              }
              break;
            case 'Radiación Solar':
              for (const id of this.variableData) {
                this.firestore.deleteData(id.id, 'Rad');
              }
              break;
          }
          Swal.fire(
            'Eliminado',
            'Los registros de ' +
              variable.toLowerCase() +
              ' se eliminaron correctamente',
            'success'
          );
        }
      });
    }
  }
}
