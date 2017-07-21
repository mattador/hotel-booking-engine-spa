import {Component, ViewEncapsulation, OnInit} from "@angular/core";
import {SubscriptionModel} from "../_models/subscription.model";
import {SubscriptionService} from "../_services/subscription.service";
import {ResponseModel} from "../_models/response.model";
import {Router} from "@angular/router";
import {SearchService} from "../_services/search.service";
import {SearchModel} from "../_models/search.model";
@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SubscriptionComponent {

    subscription: SubscriptionModel;

    router: Router;

    responseError: string = '';

    criteria: SearchModel;

    acceptedTerms: boolean = false;

    hasSubscribed: boolean = false;

    loading: boolean = false;

    loadingText: string = 'Hold on while we check your details...';

    selectOptionsDays: number[] = [];

    selectOptionsYears: number[] = [];

    error: {
        first_name: string,
        last_name: string,
        phone: string,
        email: string
    } = {
        first_name: '',
        last_name: '',
        phone: '',
        email: ''
    };

    fieldRules = {
        first_name: [/([a-zA-Z\-]+){3,}/, 'A valid first name is required.'],
        last_name: [/([a-zA-Z\-]+){2,}/, 'A valid last name is required.'],
        phone: [/\d/g, 'Please provide a valid mobile number.'],
        email: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/, 'A valid email is required.']
    }


    constructor(router: Router,
                private subscriptionService: SubscriptionService,
                private searchService: SearchService) {
        this.router = router;
        for (var d: number = 1; d <= 31; d++) {
            this.selectOptionsDays.push(d);
        }
        for (var y: number = 1909; y <= 2012; y++) {
            this.selectOptionsYears.push(y);
        }
    }

    ngOnInit() {
        this.subscription = new SubscriptionModel;
        this.criteria = this.searchService.searchModel$.getValue();
    }

    subscribeUser() {
        if (!this.validate(Object.keys(this.fieldRules))) {
            return;
        }
        this.loading = true;
        this.subscriptionService.createSubscription(this.subscription).subscribe(
            res => {
                if (!res.success) {
                    this.responseError = res.msg;
                } else {
                    this.criteria.promotional_code = 'SAVE10';
                    this.searchService.searchModel$.next(this.criteria);
                    this.searchService.save();
                    this.hasSubscribed = true;
                }
                this.loading = false;
            },
            err => {
                this.hasSubscribed = true;
                //this.responseError = "We couldn't process your information your right now, but either way we have applied a 10%* coupon to your session!";
                this.loading = false;
            }
        );
    }

    acceptTerms(el: any) {
        this.acceptedTerms = el.checked;
    }

    //copied from checkout module....combine or abstract
    validate(fields: string[] = []) {
        var valid = true;
        for (var f in fields) {
            if (fields[f] in this.fieldRules) {
                if (fields[f] == 'phone') {
                    //Always an edge case...
                    var number = this.subscription[fields[f]].match(this.fieldRules[fields[f]][0]);
                    if (number != null && number.length < 6) {
                        valid = false;
                        this.error[fields[f]] = this.fieldRules[fields[f]][1];
                    } else {
                        this.error[fields[f]] = '';
                    }
                } else if (!this.fieldRules[fields[f]][0].test(this.subscription[fields[f]])) {
                    valid = false;
                    this.error[fields[f]] = this.fieldRules[fields[f]][1];
                } else {
                    this.error[fields[f]] = '';
                }
            }
        }
        return valid;
    }
}