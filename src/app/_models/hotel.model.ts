import {HotelRoomRateModel} from "./hotel-room-rate.model";

export class HotelModel {

    public address: string;
    public city: string;
    public code: string;
    public country: string;
    public description: string;
    public email: string;
    public google_map_img: string;
    public location_coordinates: string;
    public images: string[];
    public name: string;
    public phone: string;
    public cheapest_rate_total: string;
    public currency: string;
    public nights: number;
    public rates: HotelRoomRateModel[]
}



