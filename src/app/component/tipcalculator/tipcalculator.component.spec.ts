import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipcalculatorComponent } from './tipcalculator.component';

describe('TipcalculatorComponent', () => {
  let component: TipcalculatorComponent;
  let fixture: ComponentFixture<TipcalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipcalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
