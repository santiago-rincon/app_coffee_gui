import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { VariablesComponent } from './Pages/variables/variables.component';
import { ErrorComponent } from './Pages/error/error.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { CardComponent } from './Components/card/card.component';
import { RegisterComponent } from './Pages/register/register.component';
import { RecoverComponent } from './Pages/recover/recover.component';
import { VerifyComponent } from './Pages/verify/verify.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './Components/spinner/spinner.component';
import { CropComponent } from './Pages/crop/crop.component';
import { AgmCoreModule } from '@agm/core';
import { ButtonComponent } from './Components/button/button.component';
import { PicturesComponent } from './Components/pictures/pictures.component';
import { MonitoringComponent } from './Pages/monitoring/monitoring.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { DataTablesModule } from "angular-datatables";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SettingsComponent } from './Pages/settings/settings.component';
import { HelpComponent } from './Pages/help/help.component';
import { ProofComponent } from './Components/proof/proof.component';
import { NoDataComponent } from './Components/no-data/no-data.component';
import { FullInformationComponent } from './Pages/full-information/full-information.component';
import { InformationForDateComponent } from './Pages/information-for-date/information-for-date.component';
import { InformationVariableComponent } from './Pages/information-variable/information-variable.component';
import { InformationVariableDateComponent } from './Pages/information-variable-date/information-variable-date.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VariablesComponent,
    ErrorComponent,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    RegisterComponent,
    RecoverComponent,
    VerifyComponent,
    SpinnerComponent,
    CropComponent,
    ButtonComponent,
    PicturesComponent,
    MonitoringComponent,
    SettingsComponent,
    HelpComponent,
    ProofComponent,
    NoDataComponent,
    FullInformationComponent,
    InformationForDateComponent,
    InformationVariableComponent,
    InformationVariableDateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({apiKey: "AIzaSyDejP1x-AIbiDj58gKcL3XQ5BqczBcS8jU"}),
    FormsModule,
    AngularFirestoreModule,
    DataTablesModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
