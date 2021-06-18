import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataMapper } from 'src/app/shared/mappers/data.mapper';
import { FindFalconeService } from 'src/app/shared/services/find-falcone.service';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styles: []
})
export class FindComponent implements OnInit {
  hideOutsAvailable = [];
  vehicles = [];
  destinationForm: FormGroup;
  hideOutsToDisplay;
  vehiclesToDisplay;
  formData;
  userSelectionObj = {};
  vehicleAvailibility = {
    destination1: {vehicles: {}},
    destination2: {vehicles: {}},
    destination3: {vehicles: {}},
    destination4: {vehicles: {}},
  };
  disableVehicle = null;
  vehicleDetailsForDestination = null;
  totalTimeTaken = 0;
  disableFindButton = true;
  findResult = null;
  constructor(
    private findFalconeService: FindFalconeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
    this.initializeData();
    localStorage.clear();
  }
  /* The below function makes the initial API calls to show the destinations and vehicles  */
  initializeData(): void {
    this.findFalconeService.getAllHideOuts().subscribe( result => {
      this.hideOutsAvailable = result;
      this.hideOutsToDisplay = DataMapper.dataForDestination(this.hideOutsAvailable);
      this.userSelectionObj = DataMapper.getUserSelectionObj();
      this.displayForm();
    });
    this.findFalconeService.getAllVehicles().subscribe( result => {
      this.vehicles = result;
      this.vehiclesToDisplay = DataMapper.modifyVehicleData(this.vehicles);
      this.vehicleDetailsForDestination = DataMapper.getVehicleDetailsForDestination(this.vehicles);
    });
  }

  /* The below function builds the destination reactive form*/
  displayForm(): void {
    this.destinationForm = this.formBuilder.group({
      destination1: ['', Validators.required],
      destination2: ['', Validators.required],
      destination3: ['', Validators.required],
      destination4: ['', Validators.required]
    });
  }

  /* The below function is invoked whenever a destination is selected and modifies data accrodingly*/
  onHideoutSelection(currentDestination): void {
    this.vehicleAvailibility[currentDestination].vehicles =
     DataMapper.getVehicleAvailability(this.destinationForm.controls[currentDestination].value, this.hideOutsAvailable, this.vehicles);
    const formObj = this.destinationForm.value;
    const hideOutsSelected = []; // All selected hideouts
    for (const key in formObj) {
      if (formObj[key] !== '') {
        hideOutsSelected.push(formObj[key]);
      }
    }
    for (const destination in this.hideOutsToDisplay) { 
      if (destination !== currentDestination ) { 
        let allOptions = this.hideOutsAvailable;
        hideOutsSelected.forEach(selectedDest => {
          if (formObj[destination] !== selectedDest ) {
            allOptions = allOptions.filter( opt => {
              return opt.name !== selectedDest;
            });
          }
          this.hideOutsToDisplay[destination] = allOptions;
        });
      }
    }
  }
  /* The below function is invoked whenever a vehicle is selected for a destination 
  and enables and disables the vehicles depending on vehicle availibilty*/
  onVehicleSelection(vehicleObj, currentDestination): void {
    this.totalTimeTaken = 0;
    const hideoutSelected = this.hideOutsAvailable.find( hideout =>
      hideout.name === this.destinationForm.controls[currentDestination].value);
    const prevVehicle = this.userSelectionObj[currentDestination].vehicleSelected;
      /* If the vehicle is not selected for that destination */
    if (this.userSelectionObj[currentDestination].vehicleSelected === '') {
      this.vehiclesToDisplay.map( vehicle => {
        if (vehicle.name === vehicleObj.name) {
          vehicle.totalNo = vehicle.totalNo !== 0 ? vehicle.totalNo - 1 : 0;
        }
      });
    } else {
      this.vehiclesToDisplay.map( vehicle => {
        if (vehicle.name === vehicleObj.name) {
          vehicle.totalNo = vehicle.totalNo !== 0 ? vehicle.totalNo - 1 : 0;
        }
      });
      this.vehiclesToDisplay.map( vehicle => {
        if (vehicle.name === prevVehicle) {
          const orginialObj = this.vehicles.find( veh => veh.name === prevVehicle);
          const maxNo = orginialObj.total_no;
          vehicle.totalNo = vehicle.totalNo < maxNo ? vehicle.totalNo + 1 : maxNo;
        }
      });
    }
    this.userSelectionObj[currentDestination].vehicleSelected = vehicleObj.name;
    this.userSelectionObj[currentDestination].timeTaken = (hideoutSelected.distance / vehicleObj.speed);
    this.disableVehicle = DataMapper.disableVehicle(this.vehicleDetailsForDestination, vehicleObj,
      currentDestination, prevVehicle, this.vehiclesToDisplay, this.userSelectionObj);
    let counter = 0;
    Object.keys(this.userSelectionObj).forEach( key => {
      counter += this.userSelectionObj[key].vehicleSelected ? 1 : 0;
      this.totalTimeTaken += this.userSelectionObj[key].timeTaken;
    });
    this.disableFindButton = counter === 4 ? false : true;
  }
  /* The below function is invoked when user clicks on Find Falcone button*/
  async findFalcone(){
    const reqBody = DataMapper.getRequestBodyToFindFalcone(this.destinationForm.value, this.userSelectionObj);
    reqBody.token = (await this.findFalconeService.getToken()).token;
    if (reqBody.token !== '') {
      this.sharedService.setTimeTaken(this.totalTimeTaken);
      this.sharedService.setRequestBody(reqBody);
      this.router.navigate(['/result']);
    }
  }
  /* The below function is invoked when user closes the results modal*/
  reInitializeComponent() {
    this.hideOutsAvailable = [];
    this.vehicles = [];
    this.disableFindButton = true;
    this.totalTimeTaken = 0;
    this.initializeData();
  }
}


