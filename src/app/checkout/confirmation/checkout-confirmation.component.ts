import {Component, Input, ViewEncapsulation, AfterViewInit} from "@angular/core";
import {Router} from "@angular/router";
import {ReservationModel} from "../../_models/reservation.model";

@Component({
    templateUrl: './checkout-confirmation.component.html',
    selector: 'checkout-confirmation',
    encapsulation: ViewEncapsulation.None
})
export class CheckoutConfirmationComponent {

    @Input()
    confirmation: {};

    @Input()
    reservation: ReservationModel;

    constructor(private router: Router) {
    }

    ngAfterViewInit() {
        //push dataLayer event manually, since Angularytics2 doesn't support GA's eCommerce plugin
        if (window['dataLayer'] != undefined) {
            var sku: string =
                this.reservation.hotel.code + ' - ' +
                this.confirmation['api_confirmation_code'] + ' - Travelodge Hotel ' +
                this.reservation.hotel.name;
            var price: string =
                (parseFloat(this.reservation.hotelRoomRate.total) /
                parseFloat(this.reservation.hotelRoomRate.nights))
                    .toFixed(2);
            var category: string =
                this.reservation.hotelRoomRate.rate_plan_code + ' - ' +
                this.reservation.hotelRoomRate.rate_name;
            var transactionId: string =
                this.reservation.hotel.code + ' - ' +
                'Travelodge Hotel ' + this.reservation.hotel.name + ' - ' +
                this.confirmation['api_confirmation_code'];
            window['dataLayer'].push({
                'event': 'transaction',
                'transactionId': transactionId,
                'transactionAffiliation': 'Travelodge Hotel - ' + this.reservation.hotel.name,
                'transactionTotal': this.reservation.hotelRoomRate.total,
                'transactionTax': '0.00',
                'transactionCurrency': this.reservation.hotelRoomRate.currency,
                'transactionProducts': [{
                    'sku': sku,
                    'name': this.reservation.hotelRoomRate.room_name,
                    'category': 'Travelodge MBE - ' + category,
                    'price': price,
                    'quantity': this.reservation.hotelRoomRate.nights
                }]
            });
        }
    }

}