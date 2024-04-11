import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'Home page',
  },
  // {
  //   path: ':city_name',
  //   component: WeatherDisplayComponent,
  //   title: 'Weather Display',
  // },
];

export default routes;
