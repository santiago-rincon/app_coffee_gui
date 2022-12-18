import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.css']
})
export class PicturesComponent implements OnInit {
  @Input() image:string=''
  @Input() caption:string=''
  constructor() { }

  ngOnInit(): void {
  }

}
