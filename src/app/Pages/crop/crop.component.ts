import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css'],
})
export class CropComponent implements OnInit {
  latFarm: number = 4.276781237312783;
  longFarm: number = -74.38679698232124;
  latMe: number = 0;
  longMe: number = 0;
  zoom: number = 12;
  showPositionMe: boolean = false;
  constructor(
    private afAuth: AngularFireAuth,
    private alerts: AlertsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.afAuth.currentUser.then((user) => {
    //   if (user && user.emailVerified) {
    //   } else {
    //     this.alerts.alertInfo(
    //       'No disponible',
    //       'Para acceder a este apartado debes iniciar sesión'
    //     );
    //     this.router.navigate(['/login']);
    //   }
    // });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latMe = position.coords.latitude;
      this.longMe = position.coords.longitude;
      this.showPositionMe = true;
    });
  }

  redirect(lat:number,long:number) {
    if (this.latMe==0||this.longMe==0) {
      this.alerts.alertInfo('No conozco tu ubicación','Presiona el boton "Ubicame"')
    } else {
      var url:string='https://www.google.com/maps/dir/'+lat+','+long+'/Universidad+Cundinamarca+Granja+La+Esperanza,+Fusagasug%C3%A1,+Cundinamarca/@4.3098384,-74.4207296,13z/data=!3m1!4b1!4m17!1m6!3m5!1s0x8e3f0320a2764d0f:0x5035be9b9b0c5ff0!2sUniversidad+Cundinamarca+Granja+La+Esperanza!8m2!3d4.2760323!4d-74.386612!4m9!1m1!4e1!1m5!1m1!1s0x8e3f0320a2764d0f:0x5035be9b9b0c5ff0!2m2!1d-74.386612!2d4.2760323!3e0'
      window.open(url)
      
    }
  }

  showImage(path:string, caption:string,title:string=''){
    this.alerts.alertImage(path,caption,title)
  }
}
