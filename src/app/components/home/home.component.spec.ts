import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FindComponent } from '../find/find.component';

import { HomeComponent } from './home.component';
class MockRouterClass {
  navigate() {}
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mocRoutes = [
    {
      path: 'find',
      component: FindComponent
    }
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, FindComponent ],
      imports: [RouterTestingModule.withRoutes(mocRoutes)],
      providers: [{provide: Router, useClass: MockRouterClass}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('test find falcone function', () => {
    const route = TestBed.inject(Router);
    const routerSpy = spyOn(route, 'navigate');
    component.findFalcone();
    expect(routerSpy).toHaveBeenCalled();
  });
});
