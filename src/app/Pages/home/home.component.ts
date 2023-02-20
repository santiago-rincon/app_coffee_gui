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
  sesion!: boolean;
  constructor(private afAuth: AngularFireAuth,private router:Router) {}

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
    Swal.fire({
      icon: 'info',
      title: '¿No sabes como navegar en la aplicación?',
      text: 'Descargar la guía de usario, o ve a la sección de preguntas frecuentes',
      footer:
        '<a href="/assets/album1.jpg" download="gía_de_usuario.jpg">Click aquí para descargar</a>',
        confirmButtonText: 'Ir a preguntas frecuentes',
        confirmButtonColor: '#3085d6',
      showCloseButton: true
    }).then(result=>{
      if (result.isConfirmed) {
        this.router.navigate(['/help']);
      }
    })
  }
}
