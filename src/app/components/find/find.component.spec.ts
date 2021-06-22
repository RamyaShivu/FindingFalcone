import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { FindFalconeService } from 'src/app/shared/services/find-falcone.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ResultComponent } from '../result/result.component';

import { FindComponent } from './find.component';

const planetData = [
  { name: 'Donlon', distance: 100 },
  { name: 'Enchai', distance: 200 },
  { name: 'Jebing', distance: 300 },
  { name: 'Sapir', distance: 400 },
  { name: 'Lerbin', distance: 500 },
  { name: 'Pingasor', distance: 600 },
];
const vehicleData = [
  { name: 'Space pod', total_no: 2, max_distance: 200, speed: 2 },
  { name: 'Space rocket', total_no: 1, max_distance: 300, speed: 4 },
  { name: 'Space shuttle', total_no: 1, max_distance: 400, speed: 5 },
  { name: 'Space ship', total_no: 2, max_distance: 600, speed: 10 },
];
class FindServiceMockClass {
  getAllHideOuts() {
    return of(planetData);
  }
  getAllVehicles() {
    return of(vehicleData);
  }
  getToken() {
    return new Promise((resolve, reject) => resolve({ token: 'abc123' }));
  }
}
class SharedServiceMockClass {
  setRequestBody() {}
  setTimeTaken() {};
}
describe('FindComponent', () => {
  let component: FindComponent;
  let fixture: ComponentFixture<FindComponent>;
  const mocRoutes = [
    {
      path: 'result',
      component: ResultComponent
    }
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindComponent, ResultComponent],
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule.withRoutes(mocRoutes)],
      providers: [
        { provide: FindFalconeService, useClass: FindServiceMockClass },
        { provide: SharedService, useClass: SharedServiceMockClass }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should invoke initializedata function', () => {
    expect(component.hideOutsAvailable).toEqual(planetData);
    expect(component.vehicles).toEqual(vehicleData);
  });
  it('testing onHideoutSelection function', async () => {
    await component.initializeData();
    component.destinationForm.controls['destination1'].setValue('Donlon');
    await component.onHideoutSelection('destination1');
    expect(component.hideOutsToDisplay['destination2'].length).toEqual(5);
  });
  it('testing onVehicleSelection function', async () => {
    await component.initializeData();
    component.destinationForm.controls['destination1'].setValue('Donlon');
    await component.onHideoutSelection('destination1');
    const vehicleObjSelected = {
      name: 'Space pod',
      total_no: 2,
      max_distance: 200,
      speed: 2,
    };
    await component.onVehicleSelection(vehicleObjSelected, 'destination1');
    expect(component.userSelectionObj['destination1'].vehicleSelected).toEqual(
      'Space pod'
    );
  });
  it('testing onVehicleSelection function - to increase the count of prev vehicle', async () => {
    await component.initializeData();
    component.destinationForm.controls['destination1'].setValue('Donlon');
    await component.onHideoutSelection('destination1');
    component.userSelectionObj['destination1'].vehicleSelected = 'Space rocket';
    component.vehiclesToDisplay[1].totalNo = 1
    const vehicleObjSelected = {
      name: 'Space pod',
      total_no: 1,
      max_distance: 200,
      speed: 2,
    };
    await component.onVehicleSelection(vehicleObjSelected, 'destination1');
    expect(component.userSelectionObj['destination1'].vehicleSelected).toEqual(
      'Space pod'
    );
  });
  it('testing find falcone function', async () => {
    const sharedService = TestBed.inject(SharedService);
    const spy = spyOn(sharedService, 'setRequestBody');
    await component.findFalcone();
    expect(spy).toHaveBeenCalled();
  });
});
