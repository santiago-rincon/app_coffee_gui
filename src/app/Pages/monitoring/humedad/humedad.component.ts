import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';
import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-humedad',
  templateUrl: './humedad.component.html',
  styleUrls: ['./humedad.component.css'],
})
export class HumedadComponent implements OnInit {
  @Input() umbral: any[] = [];
  dataHumedadA: any[] = [];
  dataHumedadS: any[] = [];
  multiS: any[] = [];
  // Variables para la pagina completa
  media: number = 0;
  max: number = 0;
  min: number = 0;
  mediaS: number = 0;
  maxS: number = 0;
  minS: number = 0;
  // Variables para la pagina filtrada
  date: string = '';
  mediaOfDate: number = 0;
  maxDate: number = 0;
  minDate: number = 0;
  dataFilter: any[] = [];
  multiFilter: any[] = [];
  showMediaOfDate: boolean = false;
  date2: string = '';
  mediaOfDate2: number = 0;
  maxDate2: number = 0;
  minDate2: number = 0;
  dataFilter2: any[] = [];
  multiFilter2: any[] = [];
  showMediaOfDate2: boolean = false;
  //
  filterDate: FormGroup;
  filterDate2: FormGroup;
  zeroData: boolean = false;
  zeroData2: boolean = false;
  // plot options
  multi: any[] = [];
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Humedad Ambiente (%)';
  yAxisLabel2: string = 'Humedad del Suelo (%)';
  timeline: boolean = true;
  autoScale: boolean = true;
  roundDomains: boolean = false;
  // Nodos habilitados
  @Input() nodes: any[] = [];
  selectedNode: number = 0;
  macAddress: string = '';
  filterHumedadS: any[] = [];
  filterHumedadA: any[] = [];
  nodeStatus: boolean = true;
  constructor(
    private firestore: FireStoreService,
    private fb: FormBuilder,
    private alerts: AlertsService
  ) {
    this.extractInformation('HumedadA');
    this.extractInformation2('HumedadS');
    this.filterDate = this.fb.group({
      date: ['', Validators.required],
    });
    this.filterDate2 = this.fb.group({
      date2: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  extractInformation(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.dataHumedadA = [];
      if (data.length != 0) {
        this.zeroData = false;
        this.multi = [
          {
            name: 'Humedad Ambiente',
            series: [],
          },
        ];
        data.forEach((element) => {
          const date = new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          this.dataHumedadA.push({
            time: date,
            measure: element.payload.doc.data().measure,
            node: element.payload.doc.data().node,
          });
          this.multi[0].series.push({
            name: date,
            value: element.payload.doc.data().measure,
          });
        });
        this.filterHumedadA = [];
        this.filterHumedadA = this.dataHumedadA;
        let measures: number[] = [];
        for (const i of this.dataHumedadA) {
          measures.push(i.measure);
        }
        this.media = 0;
        for (const i of measures) {
          this.media += i;
        }
        this.media /= measures.length;
        this.media = parseFloat(this.media.toFixed(2));
        this.max = Math.max(...measures);
        this.min = Math.min(...measures);
      } else {
        this.zeroData = true;
      }
    });
  }

  extractInformation2(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.dataHumedadS = [];
      if (data.length != 0) {
        this.zeroData2 = false;
        this.multiS = [
          {
            name: 'Humedad del Suelo',
            series: [],
          },
        ];
        data.forEach((element) => {
          const date = new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          this.dataHumedadS.push({
            time: date,
            measure: element.payload.doc.data().measure,
            node: element.payload.doc.data().node,
          });
          this.multiS[0].series.push({
            name: date,
            value: element.payload.doc.data().measure,
          });
        });
        this.filterHumedadS = [];
        this.filterHumedadS = this.dataHumedadS;
        let measures: number[] = [];
        for (const i of this.dataHumedadS) {
          measures.push(i.measure);
        }
        this.mediaS = 0;
        for (const i of measures) {
          this.mediaS += i;
        }
        this.mediaS /= measures.length;
        this.mediaS = parseFloat(this.mediaS.toFixed(2));
        this.maxS = Math.max(...measures);
        this.minS = Math.min(...measures);
      } else {
        this.zeroData2 = true;
      }
    });
  }

  consultDataForDate() {
    let date = this.filterDate.value.date;
    if (date === '') {
      this.alerts.alertError('Por favor ingresa una fecha');
    } else {
      date = [date.slice(0, 8), '0', date.slice(8)].join('');
      date = new Date(date).toLocaleDateString();
      const arrayFilter = this.filterHumedadA.filter((element) => {
        return element.time.toLocaleDateString() === date;
      });
      if (arrayFilter.length == 0) {
        this.alerts.alertInfo(
          'Lo siento',
          'No hay registros para la fecha ' + date
        );
      } else {
        let measures: number[] = [];
        for (const i of arrayFilter) {
          measures.push(i.measure);
        }
        let media: number = 0;
        for (const i of measures) {
          media += i;
        }
        media /= measures.length;
        media = parseFloat(media.toFixed(2));
        this.date = date;
        this.mediaOfDate = media;
        this.maxDate = Math.max(...measures);
        this.minDate = Math.min(...measures);
        this.showMediaOfDate = true;
        this.dataFilter = arrayFilter;
        this.multiFilter = [{ name: 'Humedad Ambiente', series: [] }];
        for (const i of arrayFilter) {
          this.multiFilter[0].series.unshift({
            name: i.time,
            value: i.measure,
          });
        }
      }
    }
  }

  consultDataForDate2() {
    let date2 = this.filterDate2.value.date2;
    if (date2 === '') {
      this.alerts.alertError('Por favor ingresa una fecha');
    } else {
      date2 = [date2.slice(0, 8), '0', date2.slice(8)].join('');
      date2 = new Date(date2).toLocaleDateString();
      const arrayFilter = this.filterHumedadS.filter((element) => {
        return element.time.toLocaleDateString() === date2;
      });
      if (arrayFilter.length == 0) {
        this.alerts.alertInfo(
          'Lo siento',
          'No hay registros para la fecha ' + date2
        );
      } else {
        let measures: number[] = [];
        for (const i of arrayFilter) {
          measures.push(i.measure);
        }
        let media: number = 0;
        for (const i of measures) {
          media += i;
        }
        media /= measures.length;
        media = parseFloat(media.toFixed(2));
        this.date2 = date2;
        this.mediaOfDate2 = media;
        this.maxDate2 = Math.max(...measures);
        this.minDate2 = Math.min(...measures);
        this.showMediaOfDate2 = true;
        this.dataFilter2 = arrayFilter;
        this.multiFilter2 = [{ name: 'Humedad del Suelo', series: [] }];
        for (const i of arrayFilter) {
          this.multiFilter2[0].series.unshift({
            name: i.time,
            value: i.measure,
          });
        }
      }
    }
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
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

  nodeSelected(e: any) {
    this.selectedNode = e.target.value;
    if (this.selectedNode == 0) {
      this.macAddress = '';
      this.filterHumedadA = [];
      this.filterHumedadA = this.dataHumedadA;
      this.filterHumedadS = [];
      this.filterHumedadS = this.dataHumedadS;
    } else {
      this.macAddress = this.nodes.filter(
        (n) => n.nodeId == e.target.value
      )[0].mac;
      this.nodeStatus = this.nodes.filter(
        (n) => n.nodeId == e.target.value
      )[0].nodeStatus;
      this.filterHumedadA = [];
      this.filterHumedadA = this.dataHumedadA.filter(
        (n) => n.node == e.target.value
      );
      this.filterHumedadS = [];
      this.filterHumedadS = this.dataHumedadS.filter(
        (n) => n.node == e.target.value
      );
    }
    this.multi = [
      {
        name: 'Humedad Ambiente',
        series: [],
      },
    ];
    this.multiS = [
      {
        name: 'Humedad del Suelo',
        series: [],
      },
    ];
    this.filterHumedadA.forEach((element) => {
      this.multi[0].series.push({
        name: element.time,
        value: element.measure,
      });
    });
    this.filterHumedadS.forEach((element) => {
      this.multiS[0].series.push({
        name: element.time,
        value: element.measure,
      });
    });
    this.showMediaOfDate = false;
    this.showMediaOfDate2 = false;
    if (this.filterHumedadA.length != 0) {
      this.zeroData = false;
      let measures: number[] = [];
      this.filterHumedadA.forEach((element) => {
        measures.push(element.measure);
      });
      this.media = 0;
      for (const i of measures) {
        this.media += i;
      }
      this.media /= measures.length;
      this.media = parseFloat(this.media.toFixed(2));
      this.max = Math.max(...measures);
      this.min = Math.min(...measures);
    } else {
      this.zeroData = true;
    }
    if (this.filterHumedadS.length != 0) {
      this.zeroData2 = false;
      let measures2: number[] = [];
      this.filterHumedadS.forEach((element) => {
        measures2.push(element.measure);
      });
      this.mediaS = 0;
      for (const i of measures2) {
        this.mediaS += i;
      }
      this.mediaS /= measures2.length;
      this.mediaS = parseFloat(this.mediaS.toFixed(2));
      this.maxS = Math.max(...measures2);
      this.minS = Math.min(...measures2);
    } else {
      this.zeroData2 = true;
    }
  }

  // exportPDF(id: string, nameFile: string) {
  //   var data = document.getElementById(id)!;
  //   html2canvas(data).then((canvas) => {
  //     // Few necessary setting options
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     var heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save(nameFile + '.pdf'); // Generated PDF
  //   });
  // }
}
