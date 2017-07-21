import {Component, ViewEncapsulation} from "@angular/core";
import {HotelModel} from "../../_models/index";
import {ReservationService} from "../../_services/reservation.service";
import {Router, ActivatedRoute} from "@angular/router";
import {HotelRoomRateModel} from "../../_models";
import {HotelService} from "../../_services/hotel.service";
import {QueryParams} from "../../_models";

@Component({
    templateUrl: './hotel.component.html',
    selector: 'hotel',
    encapsulation: ViewEncapsulation.None
})
export class HotelComponent {

    hotel: HotelModel;
    selectedRoomRate: HotelRoomRateModel;
    selectedRoomCollapsed: boolean = false;
    selectedRoomType: number = 0;
    selectedRoomTypeOption: number = 0;
    queryParams: QueryParams = new QueryParams();
    subscription: any;


    constructor(private reservationService: ReservationService, private hotelService: HotelService, private router: Router, private route:ActivatedRoute) {}

    ngOnInit() {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.queryParams = new QueryParams().build(params)
                this.hotel = this.hotelService.hotel;
                // If users refresh the page or new users arrive to this page, the hotel will not be defined and they
                // will be redirected back to the "search" page, keeping the 'hotel_code' queryParam which will allow an
                // automatic redirection to this page once the search is performed.
                if (!this.hotel){
                    this.prevPage([])
                    return;
                }
                this.selectedRoomRate = this.hotel.rates[0][0];
                this.selectedRoomType = 0;
                this.selectedRoomTypeOption = 0;
                this.checkoutRedirection(); // Redirects to checkout page when query params "rate_plan_code" and "room_type_code" are defined and valid.

            }
        );
    }
    ngOnDestroy() {
        //Subscription to queryParams must be closed, otherwise it will be triggered every time the URL changes.
        this.subscription.unsubscribe();
    }

    prevPage(remove_query_params: string[] = ['hotel_code']){
        this.router.navigate(['/search'], this.queryParams.getNavigationExtras({}, remove_query_params));
    }

    initReservation() {
        var reservation = this.reservationService.reservationModel$.getValue();
        reservation.hotelRoomRate = this.selectedRoomRate;
        reservation.hotel = this.hotel;
        this.reservationService.reservationModel$.next(reservation);
        this.router.navigate(['/checkout'], this.queryParams.getNavigationExtras({
            hotel_code: this.hotel.code,
            room_type_code: this.selectedRoomRate.room_type_code,
            rate_plan_code: this.selectedRoomRate.rate_plan_code
        }));
    }

    selectRoomType(i: number) {
        // When clicking hover an already selected room type, the view should extend or collapse depending on his previous state.
        if(i == this.selectedRoomType){
            this.selectedRoomCollapsed = (this.selectedRoomCollapsed)? false: true;
            return;
        }
        let lastRatePlan = this.hotel.rates[this.selectedRoomType][this.selectedRoomTypeOption]['rate_plan_code'];
        this.selectedRoomType = i;
        this.selectedRoomCollapsed = false;
        this.selectRoomTypeOption(this.defaultRoomTypeOption(lastRatePlan));

    }

    defaultRoomTypeOption(lastRatePlan:number):number{
        // If customer has selected a new room, the default rate
        // will be the same he chose on the previous room (if exists)
        for (let x in this.hotel.rates[this.selectedRoomType]){
            if(this.hotel.rates[this.selectedRoomType][x]['rate_plan_code'] == lastRatePlan){
                return parseInt(x);
            }
        }
        return 0;
    }

    selectRoomTypeOption(ii: number) {
        this.selectedRoomTypeOption = ii;
        this.selectedRoomRate = this.hotel.rates[this.selectedRoomType][this.selectedRoomTypeOption];
    }

    checkoutRedirection():void{
        // Redirects to checkout page when query params "rate_plan_code" and "room_type_code" are defined and valid.
        if (this.queryParams.room_type_code != '' && this.queryParams.rate_plan_code != ''){
            for (let room in this.hotel.rates){
                for (let rate in this.hotel.rates[room]){
                    if (this.hotel.rates[room][rate].room_type_code == this.queryParams.room_type_code && this.hotel.rates[room][rate].rate_plan_code == this.queryParams.rate_plan_code){
                        this.selectedRoomRate = this.hotel.rates[room][rate];
                        this.initReservation();
                        return;
                    }
                }
            }
        }
    }

}