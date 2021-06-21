import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataMapper } from 'src/app/shared/mappers/data.mapper';
import { FindFalconeService } from 'src/app/shared/services/find-falcone.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styles: []
})
export class ResultComponent implements OnInit {
  findResult = null;
  totalTimeTaken = null;
  constructor(
    private sharedService: SharedService,
    private findFalconeService: FindFalconeService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.totalTimeTaken = this.sharedService.getTimeTaken();
    this.getResult();
  }
  async getResult() {
    const reqBody = this.sharedService.getRequestBody();
    this.findFalconeService.findFalcone(reqBody)
    .subscribe(finalRes => {
      this.findResult = finalRes;
    })
  }
  routeToHome() {
    this.router.navigate(['/home'])
  }
}
