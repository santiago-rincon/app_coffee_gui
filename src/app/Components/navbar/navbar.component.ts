import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { 
    this.changeMenu()
  }

  ngOnInit(): void {
  }

  changeMenu(){
    const checkbox = document.getElementById("check") as HTMLInputElement | null
    if(checkbox!=null){
      checkbox.checked=false
    }
  }

}
