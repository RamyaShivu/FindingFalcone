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

  /* On load of this component, the total time taken is fetched from shared service and initialized
  Also, the find falcone result API is called*/
  ngOnInit(): void {
    this.totalTimeTaken = this.sharedService.getTimeTaken();
    this.getResult();
  }
  /* This method creates a request body required for finding falcone service and invokes the findFalcone service */
  async getResult() {
    const reqBody = this.sharedService.getRequestBody();
    this.findFalconeService.findFalcone(reqBody)
    .subscribe(finalRes => {
      this.findResult = finalRes;
    })
  }
  /* This method routes to home page when user clicks on Back to home button in result page */
  routeToHome() {
    this.router.navigate(['/home'])
  }
}
