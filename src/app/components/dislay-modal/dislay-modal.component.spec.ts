import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DislayModalComponent } from './dislay-modal.component';

describe('DislayModalComponent', () => {
  let component: DislayModalComponent;
  let fixture: ComponentFixture<DislayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DislayModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DislayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
