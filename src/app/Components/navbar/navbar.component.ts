import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertsService } from 'src/app/Services/alerts.service';
import { adminHashes } from 'src/app/Data/hashes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() showSettings: boolean = false;
  sesion: boolean = false;
  nameCurrentUser: string | null = '';
  currentUser: string | null = '';
  userRol: string = '';
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
        this.nameCurrentUser = user.displayName;
        this.userRol = 'Invitado';
        for (const hash of adminHashes) {
          if (user.uid == hash) {
            this.userRol = 'Administrador';
            break;
          }
        }
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
    if (this.nameCurrentUser != null) {
      this.alerts.alertProfile(this.currentUser, this.userRol,this.nameCurrentUser);
    } else {
      this.alerts.alertProfile(this.currentUser, this.userRol);
    }
  }
}
