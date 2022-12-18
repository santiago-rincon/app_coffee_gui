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
  pictures = [
    {
      source: '../../../../assets/album1.jpg',
      caption:
        'El producto fue presentado en el I Encuentro de Cafés Especiales, el cual reunió a los mejores empresarios del sector en el departamento. Por Juan Carlos Monzón Solórzano - Oficina Asesora de Comunicaciones. Esta iniciativa empresarial fue liderada por el docente Carlos Arturo Ramírez, quien dicta en el programa de Ingeniería Agronómica, las asignaturas de producción de cultivo y sanidad vegetal. En este nuevo campo multidimensional de aprendizaje, que traspasó las aulas, como dice el Modelo Educativo Digital Transmoderno (MEDIT), involucró a sus 44 estudiantes. La idea le surgió a partir de los cafetales que tiene la universidad en la Unidad Agroambiental La Esperanza. “Me di cuenta que la cosecha la estábamos sacando en la fase de pergamino seco y que debíamos aprovecharla para procesarla y producir nuestra propia marca, a la cual, terminamos llamando, UdeCafé. Lo que quería era que los estudiantes, interiorizaran muy bien todo el ciclo que consiste en: plantación, cosecha, transformación, curado, degustación, tueste, molido, empacado y comercialización. En sí, era darle un valor agregado”. ',
      tilte: 'UCundinamarca lanzó marca de café',
    },
    {
      source: '../../../../assets/album3.jpg',
      caption:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis fugiat deleniti nobis, neque vitae quas velit doloribus quis voluptatum unde! Deserunt, repudiandae laboriosam perspiciatis possimus nesciunt consequuntur totam perferendis quasi in ipsum quis saepe quia consectetur optio dicta recusandae expedita nihil! Facilis recusandae suscipit deleniti sint? Autem incidunt optio ratione ut illo, reprehenderit magni vel eum facilis accusantium mollitia deserunt ullam laudantium placeat aliquam dicta omnis maiores quidem fuga consequuntur blanditiis quos odit fugit id? Alias consequatur, rerum vitae, nisi natus, quasi nemo voluptatibus soluta illum dolorum amet quibusdam dicta. Neque error, itaque accusamus autem incidunt nisi aliquam dolorem vero alias magni sapiente ipsa nostrum. Error numquam ad laudantium asperiores ullam, explicabo sit consequuntur ducimus temporibus quis doloribus incidunt maxime, odit harum exercitationem atque repellat? Dolorem beatae cum delectus neque numquam eligendi maxime magnam, minus adipisci, fuga repudiandae, dolore facere. Vero quas, maiores nesciunt voluptatem optio alias voluptates? Nam obcaecati, doloremque cupiditate laudantium quam sunt possimus. Harum porro totam autem natus maxime temporibus, modi, sed debitis eos, tenetur quae ipsa? Distinctio culpa iusto in. Excepturi, nemo tempore cum qui adipisci similique quo esse ducimus incidunt illo rerum totam quia ratione itaque sequi! Sequi, eum doloremque eveniet labore ratione harum unde.',
      tilte: 'Lorem',
    },
    {
      source: '../../../../assets/album4.jpg',
      caption:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis fugiat deleniti nobis, neque vitae quas velit doloribus quis voluptatum unde! Deserunt, repudiandae laboriosam perspiciatis possimus nesciunt consequuntur totam perferendis quasi in ipsum quis saepe quia consectetur optio dicta recusandae expedita nihil! Facilis recusandae suscipit deleniti sint? Autem incidunt optio ratione ut illo, reprehenderit magni vel eum facilis accusantium mollitia deserunt ullam laudantium placeat aliquam dicta omnis maiores quidem fuga consequuntur blanditiis quos odit fugit id? Alias consequatur, rerum vitae, nisi natus, quasi nemo voluptatibus soluta illum dolorum amet quibusdam dicta. Neque error, itaque accusamus autem incidunt nisi aliquam dolorem vero alias magni sapiente ipsa nostrum. Error numquam ad laudantium asperiores ullam, explicabo sit consequuntur ducimus temporibus quis doloribus incidunt maxime, odit harum exercitationem atque repellat? Dolorem beatae cum delectus neque numquam eligendi maxime magnam, minus adipisci, fuga repudiandae, dolore facere. Vero quas, maiores nesciunt voluptatem optio alias voluptates? Nam obcaecati, doloremque cupiditate laudantium quam sunt possimus. Harum porro totam autem natus maxime temporibus, modi, sed debitis eos, tenetur quae ipsa? Distinctio culpa iusto in. Excepturi, nemo tempore cum qui adipisci similique quo esse ducimus incidunt illo rerum totam quia ratione itaque sequi! Sequi, eum doloremque eveniet labore ratione harum unde.',
      tilte: 'Lorem',
    },
    {
      source: '../../../../assets/album6.png',
      caption:
        'La gerente del Instituto Colombiano Agropecuario (ICA) seccional Cundinamarca, Nely Sánchez Vargas entregó a la Granja la Esperanza de la Universidad de Cundinamarca, ubicada en la vereda Guavio de la ciudad de Fusagasugá, la certificación de Buenas Prácticas Ganaderas en la Producción de Leche, por vigencia de dos años, de conformidad con lo establecido en la reglamentación sanitaria y de inocuidad vigente.',
      tilte:
        'El Instituto Colombiano Agropecuario (ICA) otorgó certificación a la Granja La Esperanza en Buenas Prácticas Ganaderas en la Producción de Leche.',
    },
  ];
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

  redirect(lat: number, long: number) {
    if (this.latMe == 0 || this.longMe == 0) {
      this.alerts.alertInfo(
        'No conozco tu ubicación aún',
        'Presiona primero el boton "Ubicame"'
      );
    } else {
      var url: string =
        'https://www.google.com/maps/dir/' +
        lat +
        ',' +
        long +
        '/Universidad+Cundinamarca+Granja+La+Esperanza,+Fusagasug%C3%A1,+Cundinamarca/@4.3098384,-74.4207296,13z/data=!3m1!4b1!4m17!1m6!3m5!1s0x8e3f0320a2764d0f:0x5035be9b9b0c5ff0!2sUniversidad+Cundinamarca+Granja+La+Esperanza!8m2!3d4.2760323!4d-74.386612!4m9!1m1!4e1!1m5!1m1!1s0x8e3f0320a2764d0f:0x5035be9b9b0c5ff0!2m2!1d-74.386612!2d4.2760323!3e0';
      window.open(url);
    }
  }

  showImage(path: string, caption: string, title: string = '') {
    this.alerts.alertImage(path, caption, title);
  }
}
