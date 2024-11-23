import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component:LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'characters', component: CharacterListComponent}
];