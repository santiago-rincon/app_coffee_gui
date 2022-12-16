import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertsService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sesion!: boolean;
  currentUser!: any
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alerts: AlertsService
  ) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.sesion = true;
        this.currentUser = user.email;
      } else {
        this.sesion = false;
      }
    });
  }

  changeMenu() {
    const checkbox = document.getElementById(
      'check'
    ) as HTMLInputElement | null;
    if (checkbox != null) {
      checkbox.checked = false;
    }
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.changeMenu();
      this.router.navigate(['/login']);
    });
  }

  home() {
    this.router.navigate(['/home']);
  }

  viewProfile() {
    this.alerts.alertProfile(this.currentUser)
  }
}
