import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/Services/alerts.service';
import { FireStoreService } from 'src/app/Services/fire-store.service';
import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-rad',
  templateUrl: './rad.component.html',
  styleUrls: ['./rad.component.css'],
})
export class RadComponent implements OnInit {
  @Input() umbral: any[] = [];
  dataRad: any[] = [];
  // Variables para la pagina completa
  media: number = 0;
  max: number = 0;
  min: number = 0;
  // Variables para la pagina filtrada
  date: string = '';
  mediaOfDate: number = 0;
  maxDate: number = 0;
  minDate: number = 0;
  dataFilter: any[] = [];
  multiFilter: any[] = [];
  showMediaOfDate: boolean = false;
  //
  filterDate: FormGroup;
  zeroData: boolean = false;
  // plot options
  multi: any[] = [];
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Radiación Solar (U)';
  timeline: boolean = true;
  autoScale: boolean = true;
  roundDomains: boolean = false;

  constructor(
    private firestore: FireStoreService,
    private fb: FormBuilder,
    private alerts: AlertsService
  ) {
    this.extractInformation('Rad');
    this.plotFormat('Rad');
    this.filterDate = this.fb.group({
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  extractInformation(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.dataRad = [];
      if (data.length != 0) {
        this.zeroData=false
        data.forEach((element) => {
          const date = new Date(
            element.payload.doc.data().dateAndTime.seconds * 1000 +
              element.payload.doc.data().dateAndTime.nanoseconds / 1000000
          );
          if (date.getMinutes() == 0) {
            this.dataRad.push({
              date:
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':00',
              measure: element.payload.doc.data().measure,
            });
          } else {
            this.dataRad.push({
              date:
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear(),
              time: date.getHours() + ':' + date.getMinutes(),
              measure: element.payload.doc.data().measure,
            });
          }
        });
        let measures: number[] = [];
        for (const i of this.dataRad) {
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
        this.zeroData=true
      }
    });
  }

  plotFormat(collection: string) {
    this.firestore.getDataVariables(collection).subscribe((data) => {
      this.multi = [
        {
          name: 'Radiación Solar',
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

  consultDataForDate() {
    let date = this.filterDate.value.date;
    if (date === '') {
      this.alerts.alertError('Por favor ingresa una fecha');
    } else {
      date = date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
      const arrayFilter = this.dataRad.filter((element, index) => {
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
        this.multiFilter = [{ name: 'Radiación Solar', series: [] }];
        for (const i of arrayFilter) {
          this.multiFilter[0].series.unshift({
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
