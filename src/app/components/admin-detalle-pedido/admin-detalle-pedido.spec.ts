import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetallePedido } from './admin-detalle-pedido';

describe('AdminDetallePedido', () => {
  let component: AdminDetallePedido;
  let fixture: ComponentFixture<AdminDetallePedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetallePedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDetallePedido);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
