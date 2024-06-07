import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { WeatherComponent } from './component/weather/weather.component';
import { TipcalculatorComponent } from './component/tipcalculator/tipcalculator.component';
import { RockpaperscissorsComponent } from './component/rockpaperscissors/rockpaperscissors.component';
import { GrocerylistComponent } from './component/grocerylist/grocerylist.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'weather', component: WeatherComponent, canActivate: [AuthGuard] },
  { path: 'tip-calculator', component: TipcalculatorComponent, canActivate: [AuthGuard] },
  { path: 'rock-paper-scissors', component: RockpaperscissorsComponent, canActivate: [AuthGuard] },
  { path: 'grocery-list', component: GrocerylistComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
