import {Component, ViewEncapsulation} from "@angular/core";
import {SearchModel} from "../_models/search.model";
import {SearchService, ReservationService} from "../_services";
import {Router} from "@angular/router";
import {defaultLocations} from "../_models/locations.model";

@Component({
    templateUrl: './search.component.html',
    selector: 'search',
    encapsulation: ViewEncapsulation.None
})
export class SearchComponent {

    DateJs: IDateJSStatic = <any>Date;

    criteria: SearchModel;

    disableDeparture: Boolean = false;

    warning: string = '';

    suggestOpen: boolean = false;

    constructor(private router: Router,
                private searchService: SearchService,
                private reservationService: ReservationService) {
    }

    ngOnInit() {
        this.criteria = this.searchService.searchModel$.getValue();
        if (!this.criteria.isValid()) {
            this.criteria = new SearchModel();
        }
        // Check if the customer is deep linking into a location or area (SEO friendly)
        if (!this.prepopulateSearchParams()) {
            //Else check if the customer is modifying his reservation.
            this.modifyingReservation()
        }
    }

    prepopulateSearchParams(): boolean {
        var url: RegExpMatchArray = this.router.url.match(/(hotel|dest)\/(.+)/);
        if (url !== null && url.length > 2) {
            var location: string = url[2].split('?')[0].split('/')[0];
            var type: string = url[1] == 'hotel' ? 'hotels' : 'areas';
            for (var i in defaultLocations[type]) {
                if (location == defaultLocations[type][i]['url']) {
                    this.criteria.location.hotel_codes = [defaultLocations[type][i]['code']];
                    this.criteria.location.searchTerm = defaultLocations[type][i]['name'];
                    return true;
                }
            }
        }
        return false;
    }

    modifyingReservation() {
        // If customer is modifying a reservation, we need to modify criteria adding "hotel code" and "hotel name".
        var modifyReservation = this.reservationService.getModifyReservation();
        if (modifyReservation) {
            this.criteria.location.searchTerm = modifyReservation.name;
            this.criteria.location.hotel_codes = [modifyReservation.code];
        }
    }

    search() {
        this.warning = '';
        if (!this.criteria.isValid()) {
            this.warning = 'Please choose your place of stay';
            return;
        }
        this.searchService.searchModel$.next(this.criteria);
        this.searchService.save();
        this.router.navigate(['/search'], this.criteria.toQueryParams());
    }

    suggestOpenToggle(isOpen: boolean) {
        this.suggestOpen = isOpen;
    }

}