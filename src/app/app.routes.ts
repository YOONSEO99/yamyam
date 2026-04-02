import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('@app/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('@app/pages/search/search.component').then(m => m.SearchComponent) },
  { path: 'lessons/new', loadComponent: () => import('@app/pages/new-lesson/new-lesson.component').then(m => m.NewLessonComponent) },
  { path: 'lessons/:id/edit', loadComponent: () => import('@app/pages/edit-lesson/edit-lesson.component').then(m => m.EditLessonComponent) },
  { path: 'lessons/:id', loadComponent: () => import('@app/pages/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent) },
  { path: 'my-lessons', loadComponent: () => import('@app/pages/my-lessons/my-lessons.component').then(m => m.MyLessonsComponent) },
  { path: 'favourites', loadComponent: () => import('@app/pages/favourites/favourites.component').then(m => m.FavouritesComponent) },
  { path: 'login', loadComponent: () => import('@app/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('@app/pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('@app/pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'users', loadComponent: () => import('@app/pages/all-users/all-users.component').then(m => m.AllUsersComponent) },
  { path: '**', redirectTo: '' }
];
