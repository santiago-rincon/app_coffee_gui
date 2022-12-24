import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() color: string = 'blue';
  @Input() text: string = 'inserte parámtro texto'
  @Input() showExcel: boolean = false
  @Input() showPDF: boolean = false
  constructor() {}

  ngOnInit(): void {}
}
