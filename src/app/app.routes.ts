import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) },
  { path: 'classes/new', loadComponent: () => import('./pages/new-class/new-class.component').then(m => m.NewClassComponent) },
  { path: 'classes/:id', loadComponent: () => import('./pages/class-detail/class-detail.component').then(m => m.ClassDetailComponent) },
  { path: 'my-classes', loadComponent: () => import('./pages/my-classes/my-classes.component').then(m => m.MyClassesComponent) },
  { path: 'favourites', loadComponent: () => import('./pages/favourites/favourites.component').then(m => m.FavouritesComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'users', loadComponent: () => import('./pages/all-users/all-users.component').then(m => m.AllUsersComponent) },
  { path: '**', redirectTo: '' }
];
