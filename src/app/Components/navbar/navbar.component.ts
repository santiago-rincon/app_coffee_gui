import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sesion: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeMenu() {
    const checkbox = document.getElementById(
      'check'
    ) as HTMLInputElement | null;
    if (checkbox != null) {
      checkbox.checked = false;
    }
  }

  home() {
    this.router.navigate(['/home']);
  }
}
