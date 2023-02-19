import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {
  @Input()text:string='Debes seleccionar al menos un nodo para mostrar los datos.'

  constructor() { }

  ngOnInit(): void {
  }

}
