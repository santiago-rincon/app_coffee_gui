import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CropComponent } from './Pages/crop/crop.component';
import { ErrorComponent } from './Pages/error/error.component';
import { HelpComponent } from './Pages/help/help.component';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { MonitoringComponent } from './Pages/monitoring/monitoring.component';
import { RecoverComponent } from './Pages/recover/recover.component';
import { RegisterComponent } from './Pages/register/register.component';
import { SettingsComponent } from './Pages/settings/settings.component';
import { VariablesComponent } from './Pages/variables/variables.component';
import { VerifyComponent } from './Pages/verify/verify.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'variables', component: VariablesComponent },
  { path: 'crop', component: CropComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'variables/monitoring', component: MonitoringComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'help', component: HelpComponent },
  { path: 'variables/monitoring/settings', component: SettingsComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
