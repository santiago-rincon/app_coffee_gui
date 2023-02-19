import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.css'],
})
export class ProofComponent implements OnInit {
  variables:string[]=['Temperatura','Humedad', 'Radiación Solar', 'CO2']
  constructor() {}

  ngOnInit(): void {}

  selected(i:number,e:any){
    console.log(i,e.target.checked); 
  }
}
