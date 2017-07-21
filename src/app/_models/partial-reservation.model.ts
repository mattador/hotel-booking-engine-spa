export class PartialReservationModel {

    //status and code
    public api_confirmation_code: string;
    public status: string;
    public can_cancel: boolean;
    public cancelation_terms: string

    //variables
    public nights: string;
    public check_in: string;
    public check_out: string;
    public total: string;
    public currency: string;

    //hotel
    public code: string;
    public name: string;
    public description: string;
    public google_map_img: string;
    public address: string;
    public country: string;

    //hotel room
    public room_type_name: string;
    public images: string[];

}
