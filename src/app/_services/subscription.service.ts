import {Injectable} from "@angular/core";
import {SubscriptionModel, ResponseModel} from "../_models/index";
import {SharedService} from "./shared.service";
import "rxjs/add/operator/map";
import {Observable} from "rxjs";

@Injectable()
export class SubscriptionService {


    createSubscriptionUrl = '/booking-engine/api/v1.0/subscription/create';

    constructor(private shared: SharedService) {
    }

    createSubscription(subscription: SubscriptionModel): Observable<ResponseModel> {
        var criteria = {
            first_name: subscription.first_name,
            last_name: subscription.last_name,
            email: subscription.email,
            phone: subscription.phone,
            dob_day: subscription.dob_day,
            dob_month: subscription.dob_month,
            dob_year: subscription.dob_year
        }
        return this.shared.getHttp().post(this.shared.getBaseUrl() + this.createSubscriptionUrl, {criteria: criteria})
            .map(response => response.json() as ResponseModel)
            .timeout(30000)
            .catch(this.shared.handleError);
    }

}
