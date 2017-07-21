import {Component, ViewEncapsulation} from "@angular/core";
import {ReservationService} from "../_services/reservation.service";
import {ResponseModel} from "../_models/response.model";
import {PartialReservationModel} from "../_models/partial-reservation.model";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'booking',
    templateUrl: './booking.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BookingComponent {

    reservation: PartialReservationModel;

    router: Router;

    loader: boolean = false;

    search: {
        api_confirmation_code: string,
        last_name: string
    } = {
        api_confirmation_code: '',
        last_name: ''
    }

    error: {
        api_confirmation_code: string,
        last_name: string
    } = {
        api_confirmation_code: '',
        last_name: ''
    }

    isCanceled: boolean = false;

    responseError: string = '';

    loadingText: string = 'Loading booking...';

    constructor(router: Router,
                private route: ActivatedRoute,
                private reservationService: ReservationService) {
        //make public for AOT compilation
        this.router = router;
    }

    ngOnInit() {
        // If customer is currently modifying his booking,
        // he can access the booking detail straight away.
        if(this.reservationService.modifyReservation){
            this.reservation = this.reservationService.modifyReservation;
            this.responseError = "";
            this.isCanceled = false;
            this.loader = false;
            return;
        }

        this.route.params.subscribe(params => {
            if (params['confirmation_code'] != undefined) {
                this.search.api_confirmation_code = params['confirmation_code'];
                this.search.last_name = params['last_name'];
            }
        });
    }

    validate(el: string) {
        var valid = true;
        if (this.search[el].trim().length == 0) {
            this.error[el] = 'This is a required field';
            valid = false;
        } else {
            this.error[el] = '';
        }
        return valid;
    }

    getReservation() {
        if (!this.validate('api_confirmation_code') || !this.validate('last_name')) {
            return;
        }
        this.responseError = "";
        this.isCanceled = false;
        this.loader = true;
        this.reservationService.getReservation(this.search).subscribe(
            res => {
                if (!res.success) {
                    this.responseError = res.msg;
                } else {
                    this.reservation = res.data as PartialReservationModel
                }
                this.loader = false;
            },
            err => {
                this.responseError = "You're booking can't be retrieved right now";
                this.loader = false;
            }
        );
    }

    modifyReservation(){
        if (!this.reservation.can_cancel) {
            return;
        }
        this.reservationService.setModifyReservation(this.reservation);
        this.router.navigate(['']);
    }

    cancelReservation() {
        if (!this.reservation.can_cancel) {
            return;
        }
        this.loadingText = 'Hold on while we try to cancel your booking...';
        this.loader = true;
        this.reservationService.cancelReservation({
            'api_confirmation_code': this.reservation.api_confirmation_code
        }).subscribe(
            res => {
                if (!res.success) {
                    this.responseError = res.msg;
                } else {
                    this.isCanceled = true;
                    this.reservation = null;
                    this.responseError = "";
                }
                this.loader = false;
                this.loadingText = 'Loading booking...';
            },
            err => {
                this.responseError = "You're booking cannot be canceled right now.";
                this.loader = false;
                this.loadingText = 'Loading booking...';
            }
        );
    }

}