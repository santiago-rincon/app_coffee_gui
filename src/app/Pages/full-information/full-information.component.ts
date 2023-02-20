import { Component, Input, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { colors } from 'src/app/Data/colorsScheme';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-full-information',
  templateUrl: './full-information.component.html',
  styleUrls: ['./full-information.component.css'],
})
export class FullInformationComponent implements OnInit {
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: colors,
  };
  legendPosition: LegendPosition = LegendPosition.Right;
  nodeCheckboxes: boolean = false;
  selectOption: boolean = true;
  filterData: any[] = [];
  actualVariable: string = '';
  Ylabel: string = '';
  grafic: boolean = true;
  umbral: number = 0;
  dataTable: any[] = [];
  unity: string = '';
  onlyData: boolean = false;
  maxMeasure: number = 0;
  minMeasure: number = 0;
  mediaMeasure: number = 0;
  variables: string[] = [
    'Temperatura',
    'Humedad Ambiente',
    'Humedad del Suelo',
    'CO2',
    'Radiación Solar',
  ];
  @Input() dataUmbral: any[] = [];
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
  @Input() options: any[] = [];

  constructor() {}

  ngOnInit(): void {}

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
    let filter = this.dataVariables.filter((a) => a.variable == variable);
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
    if (this.filterData.length > 1) {
      this.grafic = true;
      this.onlyData = false;
    } else {
      this.grafic = false;
      this.onlyData = true;
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
}
