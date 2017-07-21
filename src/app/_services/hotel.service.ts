import {Injectable} from "@angular/core";
import {SearchModel, ResponseModel, HotelModel} from "../_models/index";
import {SharedService} from "./shared.service";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import {Observable} from "rxjs";


@Injectable()
export class HotelService {

    availabilityUrl = '/booking-engine/api/v1.0/hotel/availability';
    autoSuggestUrl = '/booking-engine/api/v1.0/hotel/auto-suggest';
    hotel: HotelModel;
    lastResult : HotelModel[] = [];
    lastUrl : string = '';


    constructor(private shared: SharedService) {
    }

    /**
     * This particular call is a little heavy and may time out,
     * hence I've allowed it to retry once before failing
     */
    getAvailability(criteria: SearchModel): Observable<ResponseModel> {
        return this.shared.getHttp()
            .post(this.shared.getBaseUrl() + this.availabilityUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .timeout(30000)
            .catch(this.shared.handleError);
    }

    getAutoSuggest(criteria: string): Observable<ResponseModel> {
        return this.shared.getHttp().post(
            this.shared.getBaseUrl() + this.autoSuggestUrl,
            {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .timeout(10000)
            .catch(this.shared.handleError);
    }

}