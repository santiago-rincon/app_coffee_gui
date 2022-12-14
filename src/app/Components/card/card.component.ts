import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() title: string=''
  @Input() img: string=''
  @Input() content: string=''
  @Input() button_content: string=''
  @Input() link :string='#'
  constructor() { }

  ngOnInit(): void {
  }

}
