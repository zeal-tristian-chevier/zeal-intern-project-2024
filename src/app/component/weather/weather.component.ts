import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  http = inject(HttpClient);
  weatherData: any = [];
  city: string = "Dallas";
  ngOnInit(): void {
    this.fetchWeatherData();
  }
  fetchWeatherData() {
    this.http
      .get(
        `http://api.weatherapi.com/v1/current.json?key=${environment.weatherAPI.key}&q=${this.city}&aqi=no`
      )
      .subscribe((data) => {
        this.weatherData = data;
        console.log(this.weatherData);
      });
  }
}
