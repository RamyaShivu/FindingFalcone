import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FindFalconeService } from 'src/app/shared/services/find-falcone.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomeComponent } from '../home/home.component';

import { ResultComponent } from './result.component';
class MockRouterClass {
  navigate() {}
}
class FindServiceMockClass {
  findFalcone() {
    return of({planet_name: 'Donlon', status: 'success'})
  }
}
class SharedServiceMockClass {
  getRequestBody() {
    return {token: 'abc123', planet_names: [], vehicle_names: []}
  }
  getTimeTaken() {
    return 200
  };
}
describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  const mocRoutes = [
    {
      path: 'home',
      component: HomeComponent
    }
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultComponent, HomeComponent ],
      imports: [HttpClientModule, RouterTestingModule.withRoutes(mocRoutes)],
      providers: [
        {provide: Router, useClass: MockRouterClass},
        {provide: FindFalconeService, useClass: FindServiceMockClass},
        {provide: SharedService, useClass: SharedServiceMockClass}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('test get result function', async () => {
    await component.getResult()
    expect(component.findResult.status).toBe('success');
  });
  it('test route to home', () => {
    const route = TestBed.inject(Router);
    const routerSpy = spyOn(route, 'navigate');
    component.routeToHome();
    expect(routerSpy).toHaveBeenCalled();
  });
});
