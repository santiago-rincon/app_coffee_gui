import { Component, Input, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { colors } from 'src/app/Data/colorsScheme';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-information-variable',
  templateUrl: './information-variable.component.html',
  styleUrls: ['./information-variable.component.css'],
})
export class InformationVariableComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {}

  nodeSelected(e: any) {
    this.selectOption = false;
    this.dataFilterForNode(e.target.value);
    let index = this.nodes.findIndex((k) => k.nodeId == e.target.value);
    this.macAddress = this.nodes[index].mac;
    if (this.nodes[index].nodeStatus) {
      this.on = true;
    } else {
      this.on = false;
    }
  }

  newFilterData() {
    this.dataFilterForNode(this.actualNode);
  }

  allVariables() {
    for (const option of this.options) {
      option.selected = true;
    }
    this.dataFilterForNode(this.actualNode);
  }

  dataFilterForNode(nodeID: number) {
    this.actualNode = nodeID;
    this.dataFilter = [];
    this.dataTable = [];
    for (const option of this.options) {
      if (option.selected) {
        let series: any[] = [];
        let index = this.dataVariables.findIndex(
          (c) => c.variable == option.variable
        );
        let temp = this.dataVariables[index].data.filter(
          (a: any) => a.node == nodeID
        );
        if (temp.length > 0) {
          temp.forEach((b: any) => {
            series.push({
              name: b.dateAndTime,
              value: b.measure,
            });
            this.dataTable.push({
              variable:option.variable + ' ' + this.dataVariables[index].unity,
              ...b
            })
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
    if (this.dataFilter.length == 0) {
      this.information = false;
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
