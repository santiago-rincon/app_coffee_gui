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
  constructor(
    private firestore: FireStoreService,
    private fb: FormBuilder,
    private alerts: AlertsService
  ) {
    this.extractInformation('HumedadA');
    this.plotFormat('HumedadA');
    this.extractInformation2('HumedadS');
    this.plotFormat2('HumedadS');
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
        data.forEach((element) => {
          const date = new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          if (date.getMinutes() <= 9) {
            this.dataHumedadA.push({
              date:
                ((date.getDate()<10)?'0'+date.getDate():date.getDate()) +
                '/' +
                ((date.getMonth() + 1<10?'0'+(date.getMonth()+1):(date.getMonth()+1))) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':0' + date.getMinutes(),
              measure: element.payload.doc.data().measure,
            });
          } else {
            this.dataHumedadA.push({
              date:
                ((date.getDate()<10)?'0'+date.getDate():date.getDate()) +
                '/' +
                ((date.getMonth() + 1<10?'0'+(date.getMonth()+1):(date.getMonth()+1))) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':' + date.getMinutes(),
              measure: element.payload.doc.data().measure,
            });
          }
        });
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

  plotFormat(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.multi = [
        {
          name: 'Humedad Ambiente',
          series: [],
        },
      ];
      data.forEach((element) => {
        this.multi[0].series.push({
          name: new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          ),
          value: element.payload.doc.data().measure,
        });
      });
    });
  }

  extractInformation2(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.dataHumedadS = [];
      if (data.length != 0) {
        this.zeroData2 = false;
        data.forEach((element) => {
          const date = new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          if (date.getMinutes() <= 9) {
            this.dataHumedadS.push({
              date:
                ((date.getDate()<10)?'0'+date.getDate():date.getDate()) +
                '/' +
                ((date.getMonth() + 1<10?'0'+(date.getMonth()+1):(date.getMonth()+1))) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':0' + date.getMinutes(),
              measure: element.payload.doc.data().measure,
            });
          } else {
            this.dataHumedadS.push({
              date:
                ((date.getDate()<10)?'0'+date.getDate():date.getDate()) +
                '/' +
                ((date.getMonth() + 1<10?'0'+(date.getMonth()+1):(date.getMonth()+1))) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':' + date.getMinutes(),
              measure: element.payload.doc.data().measure,
            });
          }
        });
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

  plotFormat2(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.multiS = [
        {
          name: 'Humedad del Suelo',
          series: [],
        },
      ];
      data.forEach((element) => {
        this.multiS[0].series.push({
          name: new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          ),
          value: element.payload.doc.data().measure,
        });
      });
    });
  }

  consultDataForDate() {
    let date = this.filterDate.value.date;
    if (date === '') {
      this.alerts.alertError('Por favor ingresa una fecha');
    } else {
      date = date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
      const arrayFilter = this.dataHumedadA.filter((element, index) => {
        return element.date === date;
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

        console.log('log');
      }
    }
  }

  consultDataForDate2() {
    let date2 = this.filterDate2.value.date2;
    if (date2 === '') {
      this.alerts.alertError('Por favor ingresa una fecha');
    } else {
      date2 = date2.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
      const arrayFilter = this.dataHumedadS.filter((element, index) => {
        return element.date === date2;
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

        console.log('log');
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
