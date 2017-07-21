import {NavigationExtras} from "@angular/router";
import {OccupancyModel, QueryParams} from '../_models'
import {Query} from "@angular/core";
import {wordpressLocationSearchTerms} from "./locations.model";
export class SearchModel {

    DateJs: IDateJSStatic = <any>Date;

    public check_in: Date;
    public check_out: Date;
    public occupancy: OccupancyModel = {
        room_count: 1,
        adult_count: 1,
        child_count: 0
    };
    public location: {
        searchTerm: string,
        area_codes: string[],
        hotel_codes: string[],
        coordinates: {
            longitude: string,
            latitude: string
        }
    } = {
        searchTerm: '',
        area_codes: [],
        hotel_codes: [],
        coordinates: {
            longitude: '',
            latitude: ''
        }
    };

    public range: {
        min: number,
        max: number
    } = {
        min: 0,
        max: 0
    };

    public promotional_code: string = '';

    constructor() {
        this.check_in = this.DateJs.today();
        this.check_out = this.DateJs.today().addDays(1)
    }

    public isValid(): boolean {
        if (this.location.hotel_codes.length == 0 && this.location.area_codes.length == 0) {
            return false;
        }
        if (!(this.check_in instanceof Date) || !(this.check_out instanceof Date)) {
            return false;
        }
        return true;
    }

    public toQueryParams(extra_params: Object = {}, remove_params: string[] = []): NavigationExtras {
        // Transforms the criteria into Query Params for routing.
        let queryParams = new QueryParams();
        return queryParams.buildFromCriteria(this).getNavigationExtras(extra_params, remove_params);
    }

    public populateCriteria(queryParams: QueryParams): void {
        // Populates search criteria out of the url params.
        function iterate_objects(instance: SearchModel, params: Object): void {
            for (let x in instance) {
                // Skip functions
                if (typeof(instance[x]) == 'function') {
                    continue;
                }
                // Skip if the param is not an object and doesn't exist on QueryParams.
                if (!(x in params) && typeof(instance[x]) != 'object') {
                    continue;
                }
                if (instance[x] instanceof Date) {
                    instance[x] = instance.DateJs.parse(queryParams[x]);
                } else if (instance[x] instanceof Array) {
                    try {
                        instance[x] = JSON.parse(params[x]);
                    } catch (e) {
                        continue;
                    }
                } else if (typeof (instance[x]) == 'object') {
                    iterate_objects(instance[x], params);
                } else if (typeof (instance[x]) == 'string') {
                    //Address search term "bug" where param is set to a number coming from WordPress select value
                    if (x == 'searchTerm' && !isNaN(params[x])) {
                        instance[x] = wordpressLocationSearchTerms[params[x]]
                    } else {
                        instance[x] = params[x]
                    }
                } else if (typeof (instance[x]) == 'number') {
                    instance[x] = parseInt(params[x]) || 0;
                }
            }
        }

        iterate_objects(this, queryParams);
    }

}
