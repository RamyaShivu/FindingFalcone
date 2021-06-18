import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataMapper } from 'src/app/shared/mappers/data.mapper';
import { FindFalconeService } from 'src/app/shared/services/find-falcone.service';
@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
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
  modalRaf;
  findResult = null;
  constructor(
    private findFalconeService: FindFalconeService,
    private formBuilder: FormBuilder,
    private modal: NgbModal
    ) { }

  ngOnInit(): void {
    this.initializeData();
  }

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

  displayForm(): void {
    this.destinationForm = this.formBuilder.group({
      destination1: ['', Validators.required],
      destination2: ['', Validators.required],
      destination3: ['', Validators.required],
      destination4: ['', Validators.required]
    });
  }


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
    for (const destination in this.hideOutsToDisplay) { // eachDest ==dest1, dest 2 etc
      if (destination !== currentDestination ) { // all others except currently selected dest
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
    this.disableVehicle = DataMapper.disableVehicle(this.vehicleDetailsForDestination, vehicleObj,
      currentDestination, prevVehicle, this.vehiclesToDisplay);
    this.userSelectionObj[currentDestination].vehicleSelected = vehicleObj.name;
    this.userSelectionObj[currentDestination].timeTaken = (hideoutSelected.distance / vehicleObj.speed);
    let counter = 0;
    Object.keys(this.userSelectionObj).forEach( key => {
      counter += this.userSelectionObj[key].vehicleSelected ? 1 : 0;
      this.totalTimeTaken += this.userSelectionObj[key].timeTaken;
    });
    this.disableFindButton = counter === 4 ? false : true;
  }

  async findFalcone(content){
    this.modalRaf = this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'});
    const reqBody = DataMapper.getRequestBodyToFindFalcone(this.destinationForm.value, this.userSelectionObj);
    reqBody.token = (await this.findFalconeService.getToken()).token;
    if (reqBody.token !== '') {
      this.findFalconeService.findFalcone(reqBody)
      .subscribe(finalRes => {
        this.findResult = finalRes;
      })
    }
  }
}


