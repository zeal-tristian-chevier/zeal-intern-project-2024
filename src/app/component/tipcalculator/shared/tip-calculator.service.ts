import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TipCalulatorService {
  constructor() {}
  add(x: number, y: number) {
    return x + y;
  }
  calculateTip(bill: number, tipPercent: number) {
    return bill * (tipPercent / 100);
  }
}
