import {HotelModel, HotelRoomRateModel} from "./index";

export class ReservationModel {

    hotel: HotelModel;
    hotelRoomRate: HotelRoomRateModel;

    public first_name: string = '';
    public last_name: string = '';
    public phone: string = '';
    public email: string = '';
    public adult_count: number = 1;
    public child_count: number = 0;
    public comments: string = '';
    public cc_holder_name: string = '';
    public cc_number: string = '';
    public cc_expiry_month: string = '02';
    public cc_expiry_year: string = '17';
    public cc_ccv: string = '';
    public cc_type: string = 'VI';
    public promotional_code: string = '';
    //added because hotel rate dates sometimes differ
    public check_in: Date;
    public check_out: Date;
    public currency: string;
    public conditions_accepted: boolean = false;

    constructor() {
        this.hotel = new HotelModel();
        this.hotelRoomRate = new HotelRoomRateModel();
    }

}