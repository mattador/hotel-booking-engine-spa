import {Component, ViewEncapsulation} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {HotelModel, SearchModel} from "../_models";
import {SearchService, HotelService} from "../_services/index";
import {SlugifyPipe} from 'ngx-pipes/src/app/pipes/string/slugify';

import {error} from "util";
import {Observable, Subscription, Subscriber} from "rxjs";
import {QueryParams} from "../_models";

@Component({
    templateUrl: './hotels.component.html',
    selector: 'hotels',
    encapsulation: ViewEncapsulation.None,
    providers: [SlugifyPipe]
})
export class HotelsComponent {

    CDN:string = process.env.CDN;
    hotels: HotelModel[] = [];

    criteria: SearchModel = new SearchModel();
    queryParams: QueryParams;
    loading: boolean = false;
    subscription: any;

    showFilters: boolean = false;

    showLastResult: any;

    warning: string = '';

    loadingText: string = 'Book direct at<br> Travelodge Hotels for:';
    orderBy:string = 'cheapest_rate_total';

    constructor(private searchService: SearchService,
                private hotelService: HotelService,
                private router: Router,
                private slugifyPipe: SlugifyPipe) {
        //Obtain the previous URL
        this.router.events.pairwise().filter(event => event[0] instanceof NavigationEnd).subscribe((event: object) => {
            this.hotelService.lastUrl = event[0].url
        });
    }

    displayLastResult(): boolean {
        // Display last result if user is returning from "/checkout" or "/search/hotel" routes.
        if (this.hotelService.lastResult.length && /^\/search\/hotel\/|^\/checkout/.exec(this.hotelService.lastUrl)) {
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.subscription = this.searchService.getQueryParams().subscribe((params) => {
            this.queryParams = new QueryParams().build(params);
            this.criteria.populateCriteria(this.queryParams);
            //If user is returning from some page, displays the results of the previous search.
            if (this.displayLastResult()) {
                this.hotels = this.hotelService.lastResult;
                this.hotelProfileRedirection() // Redirects to specific hotel profile if the "hotel_code" query param is defined.
                return;
            }
            //Otherwise check availability.
            this.loadResults();
            this.loading = true;
        });
    }

    ngOnDestroy() {
        //Subscription to queryParams must be closed, otherwise it will be triggered every time the URL changes.
        this.subscription.unsubscribe();
    }

    setActiveHotel(hotel: HotelModel) {
        this.hotelService.hotel = hotel;
        this.router.navigate(['/search/hotel/' + this.slugifyPipe.transform(hotel.name)], this.queryParams.getNavigationExtras({hotel_code: hotel.code}));
    }

    loadResults() {
        this.loading = true;
        this.showFilters = false;
        this.searchService.searchModel$.next(this.criteria);
        this.searchService.save();
        this.hotels = [];
        if (!this.criteria.isValid()) {
            this.router.navigate(['']);
        } else {
            // Workaround for the timezone issue, http() sends requests using UTC +00 date format, resulting in
            // wrong dates for most of the timezones. Removing the time information fixes the issue.
            var criteria: SearchModel = Object.assign({}, this.criteria, {
                check_in: this.criteria.check_in.toString('yyyy-MM-dd'),
                check_out: this.criteria.check_out.toString('yyyy-MM-dd')
            });
            this.hotelService.getAvailability(criteria).subscribe(
                res => {
                    if (!res.success || res.data.length == 0) {
                        this.hotels = this.hotelService.lastResult = [];
                    } else {
                        this.hotels = this.hotelService.lastResult = res.data as HotelModel[];
                        this.hotelProfileRedirection() // Redirects to specific hotel profile if the "hotel_code" query param is defined.
                    }
                    this.loading = false;
                },
                err => {
                    //console.log(err);
                    this.hotels = this.hotelService.lastResult = [];
                    this.loading = false;
                }
            );
        }
    }

    hotelProfileRedirection(): void {
        // Redirects to specific hotel profile if the query param "hotel_code" is defined
        if (this.queryParams.hotel_code != '') {
            for (let h in this.hotels) {
                if (this.hotels[h].code == this.queryParams.hotel_code) {
                    this.setActiveHotel(this.hotels[h]);
                    return;
                }
            }
        }
        //if there is only one hotel code in hotel_codes array and area codes array is empty then set active hotel to result
        if (
            //prevent loop when pressing back
            this.hotelService.lastUrl.substr(0, "/search/hotel/".length) != "/search/hotel/"
            && this.criteria.location.hotel_codes.length == 1
            && this.criteria.location.area_codes.length == 0
        ) {
            this.setActiveHotel(this.hotels[0]);
        }
    }

    firstImage(images: any):string{
        return (images.length > 0)? "url(" + this.CDN + 'hotels/' + images[0] +")" : '';
    }

    onChange(value:string):void{
        this.orderBy = value;
        let hotels = this.hotels;
        var mapped = hotels.map(function(hotel: any, key: number) {
            return { index: key, value: hotel[value] };
        })

        // sorting the mapped array containing the reduced values
        mapped.sort(function(a, b) {
            return +(a.value > b.value) || +(a.value === b.value) - 1;
        });

        // container for the resulting order
        this.hotels = mapped.map(function(row){
            return hotels[row.index];
        });
    }
    topHotelMessage():string{
        if (this.orderBy == 'cheapest_rate_total')
            return 'Lowest price';

        if (this.orderBy == 'distance')
            return 'Closest to City';

        return 'Most popular';
    }
}
