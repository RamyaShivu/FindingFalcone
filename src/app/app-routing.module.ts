import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindComponent } from './components/find/find.component';
import { HomeComponent } from './components/home/home.component';
import { ResultComponent } from './components/result/result.component';

const routes: Routes = [
  {
    path: 'find',
    component: FindComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
