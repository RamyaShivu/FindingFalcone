import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { FindFalconeService } from './find-falcone.service';

describe('FindFalconeService', () => {
  let service: FindFalconeService;
  let httpMock: HttpTestingController;
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    service = TestBed.inject(FindFalconeService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('test getAllHideOuts', async () => {
    service.getAllHideOuts().subscribe((hideouts) => {
      expect(hideouts.length).toEqual(6);
    });
    const request = httpMock.expectOne(
      `https://findfalcone.herokuapp.com/planets`
    );
    expect(request.request.method).toBe('GET');
    request.flush(planetData);
  });
  it('test getAllVehicles', async () => {
    service.getAllVehicles().subscribe((vehicles) => {
      expect(vehicles.length).toEqual(4);
    });
    const request = httpMock.expectOne(
      `https://findfalcone.herokuapp.com/vehicles`
    );
    expect(request.request.method).toBe('GET');
    request.flush(vehicleData);
  });
  it('test getToken', async () => {
    const token = service.getToken().then( res => {
      expect(res.token).toBe('abc123');
    })
    const request = httpMock.expectOne(
      `https://findfalcone.herokuapp.com/token`
    );
    expect(request.request.method).toBe('POST');
    request.flush({token: 'abc123'});
  });
  it('test findFalcone', async () => {
    const reqBody = {
      token: 'abc1234q',
      planet_names: ['Donlon', 'Jebing', 'Enchai', 'Sapir'],
      vehicle_names: [
        'Space pod',
        'Space rocket',
        'Space shuttle',
        'Space ship',
      ],
    };
    service.findFalcone(reqBody).subscribe((finalRes) => {
      console.log(finalRes)
      expect(finalRes.status).toBe(false);
    });
    const request = httpMock.expectOne(
      `https://findfalcone.herokuapp.com/find`
    );
    expect(request.request.method).toBe('POST');
    request.flush({status: false});
  });
});
