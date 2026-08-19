import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProveedores } from './admin-proveedores';

describe('AdminProveedores', () => {
  let component: AdminProveedores;
  let fixture: ComponentFixture<AdminProveedores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProveedores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProveedores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
