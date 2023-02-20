import { Component, Input, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { colors } from 'src/app/Data/colorsScheme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/Services/alerts.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-information-variable-date',
  templateUrl: './information-variable-date.component.html',
  styleUrls: ['./information-variable-date.component.css'],
})
export class InformationVariableDateComponent implements OnInit {
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: colors,
  };
  legendPosition: LegendPosition = LegendPosition.Right;
  actualNode: number = 0;
  selectOption: boolean = true;
  dataFilter: any[] = [];
  dataTable: any[] = [];
  information: boolean = false;
  macAddress: string = '';
  on: boolean = false;
  @Input() nodes: any[] = [];
  @Input() dataVariables: any[] = [];
  options: any[] = [
    { variable: 'Temperatura', selected: true, disabled: false },
    { variable: 'Humedad Ambiente', selected: true, disabled: false },
    { variable: 'Humedad del Suelo', selected: true, disabled: false },
    { variable: 'CO2', selected: true, disabled: false },
    { variable: 'Radiación Solar', selected: true, disabled: false },
  ];
  filterDate: FormGroup;
  noData: boolean = false;
  constructor(private alerts: AlertsService, private fb: FormBuilder) {
    this.filterDate = this.fb.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      node: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  hideInformation() {
    this.information = false;
  }

  allVariables() {
    for (const option of this.options) {
      option.selected = true;
    }
    this.consultDataForDate();
  }

  consultDataForDate() {
    let initialDate = this.filterDate.value.initialDate;
    let finalDate = this.filterDate.value.finalDate;
    let node = this.filterDate.value.node;
    this.actualNode = node;
    if (node == '' || initialDate == '' || finalDate == '') {
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
      this.dataFilter = [];
      this.dataTable = [];
      let index = this.nodes.findIndex((k) => k.nodeId == node);
      this.macAddress = this.nodes[index].mac;
      if (this.nodes[index].nodeStatus) {
        this.on = true;
      } else {
        this.on = false;
      }
      if (
        this.options.findIndex(
          (f) => f.selected == true && f.disabled == false
        ) == -1
      ) {
        this.options.forEach((z) => (z.selected = true));
      }
      for (const option of this.options) {
        if (option.selected) {
          let series: any[] = [];
          let index = this.dataVariables.findIndex(
            (c) => c.variable == option.variable
          );
          let temp = this.dataVariables[index].data.filter(
            (a: any) =>
              a.node == node &&
              a.dateAndTime >= initialDate &&
              a.dateAndTime <= finalDate
          );
          if (temp.length > 0) {
            temp.forEach((b: any) => {
              series.push({
                name: b.dateAndTime,
                value: b.measure,
              });
              this.dataTable.push({
                variable:
                  option.variable + ' ' + this.dataVariables[index].unity,
                ...b,
              });
            });
            this.dataFilter.push({
              name: option.variable + ' ' + this.dataVariables[index].unity,
              series: series,
            });
            this.information = true;
            option.disabled = false;
          } else {
            option.disabled = true;
          }
        }
      }
      if (this.dataFilter.length > 0) {
        this.information = true;
        this.noData = false;
      } else {
        this.information = false;
        this.noData = true;
      }
    }
  }

  exportExcel(id: string, nameFile: string) {
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, nameFile + '.xlsx');
  }
}
