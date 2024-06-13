import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { WeatherComponent } from './component/weather/weather.component';
import { TipCalculatorComponent } from './component/tipcalculator/tip-calculator.component';
import { RockpaperscissorsComponent } from './component/rockpaperscissors/rockpaperscissors.component';
import { GrocerylistComponent } from './component/grocerylist/grocerylist.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  { path: 'weather', component: WeatherComponent },
  {
    path: 'tip-calculator',
    component: TipCalculatorComponent,
  },
  {
    path: 'rock-paper-scissors',
    component: RockpaperscissorsComponent,
  },
  {
    path: 'grocery-list',
    component: GrocerylistComponent,
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
