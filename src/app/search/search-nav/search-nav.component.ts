import {Component, ViewEncapsulation, Input, Output, EventEmitter} from "@angular/core";
import {SearchService, ReservationService} from "../../_services";
import {SearchModel} from "../../_models";
import {Router} from "@angular/router";

@Component({
    templateUrl: './search-nav.component.html',
    selector: 'search-nav',
    encapsulation: ViewEncapsulation.None
})
export class SearchNavComponent {
    @Input() showFilters: boolean = false;
    @Input() criteria: SearchModel = new SearchModel();
    @Output() onSubmitted = new EventEmitter<boolean>();
    suggestOpen: boolean = false;

    constructor(private router: Router,
                private searchService: SearchService,
                private reservationService: ReservationService) {
    }

    ngOnInit() {
    }

    totalGuests(): string{
        let guests = this.criteria.occupancy.child_count + this.criteria.occupancy.adult_count
        if(guests == 1){
            return guests + ' guest';
        }
        return guests + ' guests';
    }
    totalDays(): string{
        let days = (+this.criteria.check_out - +this.criteria.check_in) / 1000 / 60 / 60 / 24;
        if(days == 1){
            return days + ' day';
        }
        return days + ' days';
    }
    suggestOpenToggle(isOpen: boolean) {
        this.suggestOpen = isOpen;
    }

    performSearch(){
        this.onSubmitted.emit(true);
        this.showFilters = false;
    }
}