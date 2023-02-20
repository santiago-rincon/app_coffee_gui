import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { colors } from 'src/app/Data/colorsScheme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-information-for-date',
  templateUrl: './information-for-date.component.html',
  styleUrls: ['./information-for-date.component.css'],
})
export class InformationForDateComponent implements OnInit {
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: colors,
  };
  information: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right;
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
  noData: boolean = false;
  variables: string[] = [
    'Temperatura',
    'Humedad Ambiente',
    'Humedad del Suelo',
    'CO2',
    'Radiación Solar',
  ];
  @Input() options: any[] = [];
  @Input() dataVariables: any[] = [
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
  @Input() dataUmbral: any[] = [];

  constructor(private alerts: AlertsService, private fb: FormBuilder) {
    this.filterDate = this.fb.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      variableDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  hideInformation() {
    this.information = false;
    this.noData = false;
  }

  exportExcel(id: string, nameFile: string) {
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, nameFile + '.xlsx');
  }

  allNodesDate() {
    this.options.forEach((z) => (z.selected = true));
    this.consultDataForDate();
  }

  consultDataForDate() {
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
      let filter = this.dataVariables.filter((a) => a.variable == variableDate);
      let allData = filter[0].data;
      this.unityDate = filter[0].unity;
      this.YlabelDate = variableDate + ' ' + this.unityDate;
      this.umbralDate = this.dataUmbral[0][`${filter[0].collection}`];
      this.filterDataDate = [];
      let maxDate = 0;
      let minDate = 0;
      this.dataTableDate = [];
      if (
        this.options.findIndex(
          (f) => f.selected == true && f.disabled == false
        ) == -1
      ) {
        this.options.forEach((z) => (z.selected = true));
      }
      console.log(this.options);
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
        this.noData = false;
        this.information = true;
      }
    }
  }
}
