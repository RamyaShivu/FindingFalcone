/* A mapper file to modify the Destination and vehicle data as necessary */

// tslint:disable-next-line: no-namespace
export namespace DataMapper {
    export function dataForDestination(hideouts): any {
        const tempObj = {
            destination1: hideouts,
            destination2: hideouts,
            destination3: hideouts,
            destination4: hideouts
        };
        return tempObj;
    }

    export function modifyVehicleData(vehicles): any {
        const tempArray = [];
        vehicles.forEach( (veh, index) => {
            tempArray.push({
                id: index,
                name: veh.name,
                totalNo: veh.total_no,
                maxDistance: veh.max_distance,
                speed: veh.speed
            });
        });
        return tempArray;
    }

    export function getUserSelectionObj(): any {
        const  userSelectionObj =
        {
            destination1: {
                vehicleSelected: '',
                timeTaken: 0
            },
            destination2: {
                vehicleSelected: '',
                timeTaken: 0
            },
            destination3: {
                vehicleSelected: '',
                timeTaken: 0
            },
            destination4: {
                vehicleSelected: '',
                timeTaken: 0
            }
        };
        return userSelectionObj;
    }

    export function getVehicleAvailability(selectedDetsination, destinations, vehicles): any {
        const destinationSelected = destinations.find((_: { name: any; }) => _.name === selectedDetsination);
        const vehicleObj = {};
        vehicles.forEach(vehicle => {
            vehicleObj[vehicle.name] =
            destinationSelected.distance <= vehicle.max_distance ? true : false;
        });
        return vehicleObj;
    }
    export function disableVehicle(obj, currentVehicleObj, currentDestination, previousVehicle, vehiclesDetails, userSelections): any {
        let prevVehicleTotalNo = null;
        const userSelectedVehicles = [];
        for (const key in vehiclesDetails) {
            if (key === 'name' && vehiclesDetails.name === previousVehicle) {
                prevVehicleTotalNo = vehiclesDetails.totalNo;
            }
        }
        Object.keys(userSelections).forEach( key => {
            userSelectedVehicles.push(userSelections[key].vehicleSelected)
        })
        // tslint:disable-next-line: forin
        for (const key in obj) {
            if (key !== currentDestination) {
                obj[key].vehicles[currentVehicleObj.name] = currentVehicleObj.totalNo === 0
                        && (userSelections[key].vehicleSelected !== currentVehicleObj.name) ? true : false;
                obj[key].vehicles[previousVehicle] = prevVehicleTotalNo === 0 ? true : false;
            }
            if (key === currentDestination) {
                obj[key].vehicles[previousVehicle] = prevVehicleTotalNo === 0 ? true : false;
            }
        }
        return obj;
    }

    export function getVehicleDetailsForDestination(vehicles): any {
        const tempObj = {
            destination1: {vehicles: {}},
            destination2: {vehicles: {}},
            destination3: {vehicles: {}},
            destination4: {vehicles: {}},
        };
        for (const key in tempObj) {
            if (key) {
                vehicles.forEach(vehicle => {
                    tempObj[key].vehicles[vehicle.name] = false;
                });
            }
        }
        return tempObj;
    }

    export function getRequestBodyToFindFalcone(formValue, userSelections): any{
        const reqObj = {
            token: '',
            planet_names: [],
            vehicle_names: []

        };
        Object.keys(formValue).forEach(key => {
            reqObj.planet_names.push(formValue[key]);
        });
        Object.keys(userSelections).forEach(selection => {
            reqObj.vehicle_names.push(userSelections[selection].vehicleSelected);
        });
        return reqObj;
    }
}
