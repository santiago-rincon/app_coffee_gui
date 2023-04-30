import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sesion: boolean = false;
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.sesion = true;
      } else {
        this.sesion = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.sesion) {
      Swal.fire({
        icon: 'info',
        title: '¿No sabes cómo navegar en la aplicación?',
        text: 'Descarga el manual de usuario de usuario, o ve a la sección de preguntas frecuentes',
        footer:
          '<a href="/assets/user_manual.pdf" download="manual_de_usuario.pdf">Click aquí para descargar</a>',
        confirmButtonText: 'Ir a preguntas frecuentes',
        confirmButtonColor: '#3085d6',
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/help']);
        }
      });
    }
  }
}
