import {Component, ViewEncapsulation, Input} from '@angular/core';
import {SearchModel} from "../../_models/index";

@Component({
    templateUrl: './search-occupancy.component.html',
    selector: 'search-occupancy',
    encapsulation: ViewEncapsulation.None
})
export class SearchOccupancyComponent {

    MAX_ADULT_COUNT: number = 3;
    MAX_CHILD_COUNT: number = 2;
    MAX_OCCUPANT_COUNT: number = 3;

    public showOccupancyOptions: boolean = false;

    @Input()
    public criteria: SearchModel;

    addChild() {
        if (this.criteria.occupancy.child_count < this.MAX_CHILD_COUNT
            && (this.criteria.occupancy.child_count + this.criteria.occupancy.adult_count) < this.MAX_OCCUPANT_COUNT
        ) {
            this.criteria.occupancy.child_count++;
        }
    }

    removeChild() {
        if (this.criteria.occupancy.child_count > 0) {
            this.criteria.occupancy.child_count--;
        }
    }

    addAdult() {
        if (this.criteria.occupancy.adult_count < this.MAX_ADULT_COUNT
            && (this.criteria.occupancy.child_count + this.criteria.occupancy.adult_count) < this.MAX_OCCUPANT_COUNT
        ) {
            this.criteria.occupancy.adult_count++;
        }
    }

    removeAdult() {
        if (this.criteria.occupancy.adult_count > 1) {
            this.criteria.occupancy.adult_count--;
        }
    }

}