import {Component, ViewEncapsulation} from "@angular/core";
import {ReservationModel, QueryParams, SearchModel, PartialReservationModel} from "../_models";
import {Router, ActivatedRoute} from "@angular/router";
import {ReservationService, SearchService} from "../_services/index";

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CheckoutComponent {

    reservation: ReservationModel;

    router: Router;
    queryParams: QueryParams = new QueryParams();
    focus:string = 'top_focus';
    responseError: string = '';
    confirmation: {};
    step: number = 1;
    loader: boolean = false;
    loadingText: string = 'Thanks for choosing Travelodge. Please hold on while we confirm your booking...';
    subscription: any;
    modifyReservation: PartialReservationModel = null;

    error: {
        first_name: string,
        last_name: string,
        phone: string,
        email: string,
        cc_holder_name: string,
        cc_number: string,
        cc_ccv: string,
        conditions_accepted: string,
    } = {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        cc_holder_name: '',
        cc_number: '',
        cc_ccv: '',
        conditions_accepted: '',
    };

    fieldRules = {
        first_name: [/.+/, 'A valid first name is required.'],
        last_name: [/.+/, 'A valid last name is required.'],
        email: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/, 'A valid email is required.'],
        phone: [/\d/g, 'Please provide a valid contact number.'],
        cc_number: [/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
            'The credit card number you have entered is not valid'],
        cc_holder_name: [/.+/, 'The card holder\'s name doesn\'t appear to be valid.'],
        cc_ccv: [/\d{3,}/, 'A card\'s security code should be 3 or 4 digits long.']
    }

    constructor(router: Router,
                private route: ActivatedRoute,
                private reservationService: ReservationService,
                private searchService: SearchService) {
        //make public for AOT compilation
        this.router = router;
    }

    ngOnInit() {
        this.modifyReservation = this.reservationService.modifyReservation;
        this.subscription = this.route.queryParams.subscribe(params => this.queryParams.build(params));
        this.reservation = this.reservationService.reservationModel$.getValue();
        if (this.reservation.hotel.code == undefined) {
            this.prevPage([]);
        }
        var criteria: SearchModel = this.searchService.searchModel$.getValue()
        this.reservation.adult_count = criteria.occupancy.adult_count;
        this.reservation.child_count = criteria.occupancy.child_count;
        this.reservation.promotional_code = criteria.promotional_code;
        this.reservation.check_in = criteria.check_in;
        this.reservation.check_out = criteria.check_out;
    }

    ngOnDestroy() {
        //Subscription to queryParams must be closed, otherwise it will be triggered every time the URL changes.
        this.subscription.unsubscribe();
    }

    prevPage(remove_query_params: string[] = ['rate_plan_code', 'room_type_code']){
        // Redirect to previous page on first step.
        if (this.step == 1 ) {
            this.router.navigate(['/search'], this.queryParams.getNavigationExtras({}, remove_query_params));
            return;
        }
        // Otherwise redirect to main page.
        this.router.navigate(['']);
    }

    validate(fields: string[] = []) {
        var valid = true;
        this.focus = '';
        // First check if conditions were accepted
        if (!this.reservation['conditions_accepted']){
            valid = false;
            this.error['conditions_accepted'] = 'You must accept the conditions'
        }
        for (var f in fields) {
            this.error[fields[f]] = '';
            if (fields[f] in this.fieldRules) {
                if (fields[f] == 'phone') {
                    //Always an edge case...
                    var number = this.reservation[fields[f]].match(this.fieldRules[fields[f]][0]);
                    if (number == null || number.length < 6) {
                        valid = false;
                        this.error[fields[f]] = this.fieldRules[fields[f]][1];
                        if(!this.focus){
                            this.focus = fields[f];
                        }

                    } else {
                        this.error[fields[f]] = '';
                    }
                } else if (!this.fieldRules[fields[f]][0].test(this.reservation[fields[f]])) {
                    valid = false;
                    this.error[fields[f]] = this.fieldRules[fields[f]][1];
                    if(!this.focus){
                        this.focus = fields[f];
                    }
                } else {
                    this.error[fields[f]] = '';
                }
            }
        }
        return valid;
    }

    flattenBookingData():Object {
        //Creates a flatten reservation dictionary for Woopra (Woopra doesn't support nesting)
        return {
            first_name: this.reservation.first_name,
            last_name: this.reservation.last_name,
            email: this.reservation.email,
            phone: this.reservation.phone,
            hotel: this.reservation.hotel.name,
            rate_name: this.reservation.hotelRoomRate.rate_name,
            room_name: this.reservation.hotelRoomRate.room_name,
            total: this.reservation.hotelRoomRate.total,
            check_in: this.reservation.check_in.toString('yyyy-MM-dd'),
            check_out: this.reservation.check_out.toString('yyyy-MM-dd'),
            comments: this.reservation.comments,
            adult_count: this.reservation.adult_count,
        }
    }

    newReservation(){
        this.reservationService.createReservation().subscribe(
            res => {
                if (!res.success) {
                    this.responseError = res.msg;
                } else {
                    this.step = 3;
                    this.confirmation = res.data;
                    //clean up reservation
                    this.reservationService.reservationModel$.next(new ReservationModel());
                    //window['woopra'].track("new_reservation", this.flattenBookingData());
                }
                this.loader = false;
            },
            err => {
                this.responseError = "Sorry! We couldn't place your booking due to connectivity issues, please try again in a few minutes.";
                this.loader = false;
            }
        );
    }

    updateReservation(){
        this.reservationService.updateReservation().subscribe(
            res => {
                if (!res.success) {
                    this.responseError = res.msg;
                } else {
                    this.step = 3;
                    this.confirmation = res.data;
                    //clean up reservation
                    this.reservationService.reservationModel$.next(new ReservationModel());
                    this.reservationService.setModifyReservation(null);
                    //window['woopra'].track("new_reservation", this.flattenBookingData());
                }
                this.loader = false;
            },
            err => {
                this.responseError = "Sorry! We couldn't place your booking due to connectivity issues, please try again in a few minutes.";
                this.loader = false;
            }
        );
    }

    createReservation() {
        // If reservation fails, store results in Woopra.
        if (!this.validate(Object.keys(this.fieldRules))) {
            //window['woopra'].track("validation_error", this.error);
            //window['woopra'].track("reservation_failed", this.flattenBookingData());
            return;
        }
        this.responseError = "";
        this.loader = true;
        this.reservationService.reservationModel$.next(this.reservation);
        if (this.modifyReservation){
            this.updateReservation();
            return;
        }

        this.newReservation();
    }

}