import { Pipe, PipeTransform } from '@angular/core';
import { OccupancyModel } from '../_models/occupancy.model'
/*
 * Returns the total number of rooms and guests.
 */
@Pipe({name: 'stay'})
export class StayPipe implements PipeTransform {
    transform(value: OccupancyModel): string {
        let room = (value.room_count > 1)? 'rooms': 'room';
        let guests = (value.child_count + value.adult_count > 1)? 'guests': 'guest';
        return  value.room_count + ' ' + room + ', ' + (value.child_count + value.adult_count) + ' ' + guests;
    }
}
