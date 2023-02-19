import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';
import * as XLSX from 'xlsx';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { colors } from 'src/app/Data/colorsScheme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css'],
})
export class MonitoringComponent implements OnInit {
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: colors,
  };
  legendPosition: LegendPosition = LegendPosition.Right;
  dataUmbral: any[] = [];
  nodes: any[] = [];
  variables: string[] = [
    'Temperatura',
    'Humedad Ambiente',
    'Humedad del Suelo',
    'CO2',
    'Radiación Solar',
  ];
  nodeCheckboxes: boolean = false;
  selectOption: boolean = true;
  options: any[] = [];
  dataVaribels: any[] = [
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
    { unity: '(U)', collection: 'Rad', variable: 'Radiación Solar', data: [] },
  ];
  filterData: any[] = [];
  actualVariable: string = '';
  Ylabel: string = '';
  grafic: boolean = true;
  umbral: number = 0;
  dataTable: any[] = [];
  unity: string = '';
  onlyData:boolean=false
  maxMeasure: number = 0;
  minMeasure: number = 0;
  mediaMeasure: number = 0;
  filterDate: FormGroup;
  unityDate: string = '';
  YlabelDate: string = '';
  umbralDate: number = 0;
  filterDataDate: any[] = [];
  dataTableDate: any[] = [];
  maxMeasureDate: number = 0;
  minMeasureDate: number = 0;
  mediaMeasureDate: number = 0;
  graficDate: boolean = true;
  showDate: boolean = false;
  nodeCheckboxesDate: boolean = false;
  actualVariableDate: string = '';
  noData:boolean=false
  constructor(
    private firestore: FireStoreService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService,
    private fb: FormBuilder
  ) {
    this.extractInformation();
    this.filterDate = this.fb.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      variableDate: ['', Validators.required],
    });
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
    this.dataVaribels.forEach((element) => {
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

  variableSelected(e: any) {
    this.actualVariable = e.target.value;
    this.newFilterData(this.actualVariable);
  }

  allNodes(e: any) {
    if (e.target.checked) {
      this.nodeCheckboxes = false;
      this.options.forEach((z) => (z.selected = true));
      this.newFilterData(this.actualVariable);
    } else {
      this.nodeCheckboxes = true;
    }
  }

  newFilterData(variable: string) {
    let filter = this.dataVaribels.filter((a) => a.variable == variable);
    let allData = filter[0].data;
    this.unity = filter[0].unity;
    this.Ylabel = variable + ' ' + this.unity;
    this.umbral = this.dataUmbral[0][`${filter[0].collection}`];
    this.filterData = [];
    let maxDate = 0;
    let minDate = 0;
    this.dataTable = [];
    for (const option of this.options) {
      if (option.selected) {
        let series: any[] = [];
        let nodeData = allData.filter((e: any) => e.node == option.id);
        let index = this.options.findIndex((h) => h.id == option.id);
        if (nodeData.length > 0) {
          this.dataTable.push(...nodeData);
          nodeData.forEach((element: any) => {
            if (minDate == 0) {
              minDate = element.dateAndTime.getTime();
            }
            if (element.dateAndTime.getTime() > maxDate) {
              maxDate = element.dateAndTime.getTime();
            }
            if (element.dateAndTime.getTime() < minDate) {
              minDate = element.dateAndTime.getTime();
            }
            series.push({
              name: element.dateAndTime,
              value: element.measure,
            });
          });
          this.filterData.push({
            name: 'Nodo ' + option.id,
            series: series,
          });
          this.options[index].disabled = false;
        } else {
          this.options[index].disabled = true;
        }
      }
    }
    let measures: number[] = [];
    for (const i of this.dataTable) {
      measures.push(i.measure);
    }
    this.mediaMeasure = 0;
    for (const i of measures) {
      this.mediaMeasure += i;
    }
    this.mediaMeasure /= measures.length;
    this.mediaMeasure = parseFloat(this.mediaMeasure.toFixed(2));
    this.maxMeasure = Math.max(...measures);
    this.minMeasure = Math.min(...measures);
    this.selectOption = false;
    this.filterData.push({
      name: 'Umbral',
      series: [
        { name: new Date(maxDate), value: this.umbral },
        { name: new Date(minDate), value: this.umbral },
      ],
    });
    if (this.filterData.length > 1 && this.filterData[0].series.length>1) {
      this.grafic = true;
      this.onlyData=false
    } else {
      this.grafic = false;
      this.onlyData=true
    }
  }

  exportExcel(id: string, nameFile: string) {
    /* pass here the table id */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, nameFile + '.xlsx');
  }

  allNodesDate() {
    this.options.forEach((z) => (z.selected = true));
  }

  consultDataForDate() {
    this.allNodesDate()
    this.nodeCheckboxesDate = false;
    this.showDate = false;
    let initialDate = this.filterDate.value.initialDate;
    let finalDate = this.filterDate.value.finalDate;
    let variableDate = this.filterDate.value.variableDate;
    this.actualVariableDate = variableDate;
    if (variableDate == '' || initialDate == '' || finalDate == '') {
      this.alerts.alertError(
        'Por favor completa todos los campos del formulario'
      );
    } else if (initialDate === finalDate) {
      this.alerts.alertError('Por favor ingresa dos fechas diferentes');
    } else {
      initialDate = initialDate.replace(
        /^(\d{4})-(\d{2})-(\d{2})$/g,
        '$2/$3/$1'
      );
      finalDate = finalDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$2/$3/$1');
      initialDate = new Date(initialDate);
      finalDate = new Date(finalDate);
      if (initialDate.getTime() > finalDate.getTime()) {
        let temp = initialDate;
        initialDate = finalDate;
        finalDate = temp;
      }
      let filter = this.dataVaribels.filter((a) => a.variable == variableDate);
      let allData = filter[0].data;
      this.unityDate = filter[0].unity;
      this.YlabelDate = variableDate + ' ' + this.unityDate;
      this.umbralDate = this.dataUmbral[0][`${filter[0].collection}`];
      this.filterDataDate = [];
      let maxDate = 0;
      let minDate = 0;
      this.dataTableDate = [];
      for (const option of this.options) {
        if (option.selected) {
          let series: any[] = [];
          let nodeData = allData.filter(
            (e: any) =>
              e.node == option.id &&
              e.dateAndTime >= initialDate &&
              e.dateAndTime <= finalDate
          );
          let index = this.options.findIndex((h) => h.id == option.id);
          if (nodeData.length > 0) {
            this.dataTableDate.push(...nodeData);
            nodeData.forEach((element: any) => {
              if (minDate == 0) {
                minDate = element.dateAndTime.getTime();
              }
              if (element.dateAndTime.getTime() > maxDate) {
                maxDate = element.dateAndTime.getTime();
              }
              if (element.dateAndTime.getTime() < minDate) {
                minDate = element.dateAndTime.getTime();
              }
              series.push({
                name: element.dateAndTime,
                value: element.measure,
              });
            });
            this.filterDataDate.push({
              name: 'Nodo ' + option.id,
              series: series,
            });
            this.options[index].disabled = false;
          } else {
            this.options[index].disabled = true;
          }
        }
      }
      if (this.dataTableDate.length == 0) {
        this.noData = true;
      } else {
        let measures: number[] = [];
        for (const i of this.dataTableDate) {
          measures.push(i.measure);
        }
        this.mediaMeasureDate = 0;
        for (const i of measures) {
          this.mediaMeasureDate += i;
        }
        this.mediaMeasureDate /= measures.length;
        this.mediaMeasureDate = parseFloat(this.mediaMeasureDate.toFixed(2));
        this.maxMeasureDate = Math.max(...measures);
        this.minMeasureDate = Math.min(...measures);
        this.filterDataDate.push({
          name: 'Umbral',
          series: [
            { name: new Date(maxDate), value: this.umbralDate },
            { name: new Date(minDate), value: this.umbralDate },
          ],
        });
        if (this.filterDataDate.length > 1) {
          this.graficDate = true;
        } else {
          this.graficDate = false;
        }
        this.showDate = true;
        this.nodeCheckboxesDate = true;
        this.noData=false
      }
    }
  }
}
