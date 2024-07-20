import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/patients', pathMatch: 'full' },
  { path: 'patients', component: HomeComponent },
  { path: 'patient/details/:id', component: PatientDetailsComponent },
  { path: '**', redirectTo: '/patients' }, // Redirect to /patients for any unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
