import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('test setTimeTaken', () => {
    service.setTimeTaken(200);
    expect(service.timeTaken).toEqual(200);
  });
  it('test getTimeTaken', () => {
    service.setTimeTaken(200);
    const time = service.getTimeTaken();
    expect(time).toEqual(200);
  });
  it('test getTimeTaken - local store branch', () => {
    service.setTimeTaken(200);
    service.timeTaken = null;
    const time = service.getTimeTaken();
    expect(time).toEqual(200);
  });
  it('test setRequestBody', () => {
    const reqBody = {token: 'abc123'}
    service.setRequestBody(reqBody)
    expect(service.findRequestBody).toEqual(reqBody);
  });
  it('test getRequestBody', () => {
    const reqBody = {token: 'abc123'}
    service.setRequestBody(reqBody)
    const result = service.getRequestBody();
    expect(result).toEqual(reqBody);
  });
  it('test getRequestBody - local store branch', () => {
    const reqBody = {token: 'abc123'}
    service.setRequestBody(reqBody)
    service.findRequestBody = null;
    const result = service.getRequestBody();
    expect(result).toEqual(reqBody);
  });
});
