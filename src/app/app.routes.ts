import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./home/home.component').then((c) => c.HomeComponent) },
  { path: 'form', loadComponent: () => import('./form/form.component').then((c) => c.FormComponent) },
];
