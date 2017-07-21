import { Pipe, PipeTransform } from '@angular/core';
import { ReservationService } from '../_services';
import { HotelModel } from '../_models';

/*
 * Filters valid hotels,
 * If the customer is modifying a reservation, only the
 * hotel in which the reservation was originally created
 * should be displayed on the result list.
 */
@Pipe({name: 'filterHotels'})
export class FilterHotelsPipe implements PipeTransform {

    constructor(private reservationService: ReservationService) {}

    transform(items: HotelModel[]): HotelModel[] {
        var r = this.reservationService.getModifyReservation();
        if (!r){
            return items;
        }

        return items.filter(item => item.code == r.code);
    }
}
