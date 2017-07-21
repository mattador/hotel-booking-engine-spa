import {Injectable} from "@angular/core";
import {ReservationModel, ResponseModel, PartialReservationModel} from "../_models";
import {SharedService} from "./shared.service";
import "rxjs/add/operator/map";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs";

@Injectable()
export class ReservationService {

    DateJs: IDateJSStatic = <any>Date;
    getReservationUrl = '/booking-engine/api/v1.0/hotel/reservation';
    createReservationUrl = '/booking-engine/api/v1.0/hotel/reservation/create';
    modifyReservationUrl = '/booking-engine/api/v1.0/hotel/reservation/modify';
    cancelReservationUrl = '/booking-engine/api/v1.0/hotel/reservation/cancel';
    reservationModel$: BehaviorSubject<ReservationModel>;
    modifyReservation: PartialReservationModel = null;


    constructor(private shared: SharedService) {
        this.reservationModel$ = new BehaviorSubject(new ReservationModel());
    }

    setModifyReservation(reservation: PartialReservationModel):void{
        this.modifyReservation = reservation;
        if (!reservation){
            localStorage.removeItem('modifyReservation');
            return;
        }
        localStorage.setItem('modifyReservation', JSON.stringify(reservation));
    }
    getModifyReservation(){
        if (!this.modifyReservation){
            // If modifyReservation is not set, retrieve value from local storage.
            var stored: string = (navigator.cookieEnabled) ? localStorage.getItem('modifyReservation') : null;
            if (stored != null) {
                var data: Object = JSON.parse(stored);
                this.modifyReservation = new PartialReservationModel();
                for (var x in data){
                    this.modifyReservation[x] = data[x];
                }
            }
        }

        return this.modifyReservation;
    }

    getCriteria(){
        var reservation = this.reservationModel$.getValue();
        return {
            check_in: reservation.check_in.toString('yyyy-MM-dd'),
            check_out: reservation.check_out.toString('yyyy-MM-dd'),
            code: reservation.hotel.code,
            room_type_code: reservation.hotelRoomRate.room_type_code,
            rate_plan_code: reservation.hotelRoomRate.rate_plan_code,
            rate_plan_id: reservation.hotelRoomRate.rate_plan_id,
            phone: reservation.phone,
            email: reservation.email,
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            adult_count: reservation.adult_count,
            child_count: reservation.child_count,
            comments: reservation.comments,
            total: reservation.hotelRoomRate.total,
            currency: reservation.hotelRoomRate.currency,
            cc_type: reservation.cc_type,
            cc_number: reservation.cc_number,
            cc_expiry: reservation.cc_expiry_month + '' + reservation.cc_expiry_year,
            cc_ccv: reservation.cc_ccv,
            cc_holder_name: reservation.cc_holder_name,
            promotional_code: reservation.promotional_code
        }
    }

    /**
     * @param reservation
     * @returns {Promise<ResponseModel>}
     */
    createReservation(): Observable<ResponseModel> {
        var criteria = this.getCriteria();
        return this.shared.getHttp().post(this.shared.getBaseUrl() + this.createReservationUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .catch(this.shared.handleError);
    }

    updateReservation(): Observable<ResponseModel> {
        var criteria = this.getCriteria();
        criteria['api_confirmation_code'] = this.modifyReservation.api_confirmation_code;
        return this.shared.getHttp().post(this.shared.getBaseUrl() + this.modifyReservationUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .catch(this.shared.handleError);
    }

    getReservation(criteria: {}): Observable<ResponseModel> {
        return this.shared.getHttp().post(this.shared.getBaseUrl() + this.getReservationUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .catch(this.shared.handleError);
    }

    cancelReservation(criteria: {}): Observable<ResponseModel> {
        return this.shared.getHttp().post(this.shared.getBaseUrl() + this.cancelReservationUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .catch(this.shared.handleError);
    }

}
