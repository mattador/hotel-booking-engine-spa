import {
    Component,
    ViewEncapsulation,
    ElementRef,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {HotelService} from "../../_services/hotel.service";
import {LocationsModel, SearchModel, defaultLocations} from "../../_models";
import {Subscription} from "rxjs";


@Component({
    templateUrl: './search-location.component.html',
    selector: 'search-location',
    encapsulation: ViewEncapsulation.None,
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class SearchLocationComponent {

    constructor(private hotelService: HotelService, private elementRef: ElementRef) {
    }

    @Input()
    public criteria: SearchModel;

    @Output()
    public suggestOpen: EventEmitter<any> = new EventEmitter();

    public isOpen: boolean = false;

    public searchSubscription: Subscription;

    public currentsearchTerm: string = '';


    locations: LocationsModel = null;


    searchLocations(value: string, override: boolean = false, eventType: string = 'none') {
        //console.log(eventType);
        if (value.trim() == '' && !override) {
            this.reset();
            return;
        }
        //Cancel last ajax request if still running
        if (this.searchSubscription) {
            if (value == this.currentsearchTerm) {
                return;
            }
            this.searchSubscription.unsubscribe();
        }
        this.currentsearchTerm = value;
        //console.log('sending off search for "' + value + '"');
        this.searchSubscription = this.hotelService.getAutoSuggest(value).subscribe(
            res => {
                if (!res.success || (res.data.hotels.length == 0 && res.data.areas.length == 0)) {
                    this.reset(false);
                } else {
                    this.locations = res.data;
                }
            },
            err => {
                this.reset(false);
            }
        );
    }

    onClick(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hide();
        }
    }

    show() {
        this.isOpen = true;
        if (this.criteria.location.searchTerm.length == 0) {
            this.locations = defaultLocations;
        } else {
            this.searchLocations(this.criteria.location.searchTerm);
        }
        this.suggestOpen.emit(true);
    }

    hide() {
        this.isOpen = false;
        if (this.criteria.location.hotel_codes.length == 0 && this.criteria.location.area_codes.length == 0) {
            this.criteria.location.searchTerm = '';
        }
        this.suggestOpen.emit(false);
    }

    reset(removeSearchTerm: boolean = true) {
        var searchTerm: string;
        if (removeSearchTerm) {
            searchTerm = '';
        } else {
            searchTerm = this.criteria.location.searchTerm;
        }
        this.criteria.location = {
            searchTerm: searchTerm,
            area_codes: [],
            hotel_codes: [],
            coordinates: {
                longitude: '',
                latitude: ''
            }
        };
        this.criteria.range = {
            min: 0,
            max: 0
        };
        this.criteria.promotional_code = '';
        this.locations = undefined;
    }

    /**
     * @todo Heavy clean up required
     *
     * @param entity
     */
    add(entity: any, type: string = 'hotel') {
        this.criteria.location.hotel_codes = [];
        this.criteria.location.area_codes = [];
        if (type == 'area') {
            this.criteria.location.area_codes.push(entity.code);
        } else {
            this.criteria.location.hotel_codes.push(entity.code);
        }
        this.criteria.location.searchTerm = entity.name;
        this.hide();
    }

}
