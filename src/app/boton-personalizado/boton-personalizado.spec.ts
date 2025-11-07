import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonPersonalizado } from './boton-personalizado';

describe('BotonPersonalizado', () => {
  let component: BotonPersonalizado;
  let fixture: ComponentFixture<BotonPersonalizado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonPersonalizado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonPersonalizado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
