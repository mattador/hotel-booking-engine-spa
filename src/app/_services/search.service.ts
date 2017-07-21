import {Injectable} from "@angular/core";
import {SearchModel} from "../_models";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class SearchService {

    DateJs: IDateJSStatic = <any>Date;

    searchModel$: BehaviorSubject<SearchModel>;

    constructor(private route: ActivatedRoute) {
        var search: SearchModel = this.load();
        if (search == undefined) {
            search = new SearchModel();
        }
        this.searchModel$ = new BehaviorSubject(search);
    }

    // Saves search criteria in local storage
    public save() {
        try { // some apple phones seem to have issues with persistant storage
            var search: SearchModel = this.searchModel$.getValue();
            var searchCriteriaObject: Object = {
                promotional_code: search.promotional_code,
                check_in: search.check_in.toString('yyyy-MM-dd'),
                check_out: search.check_out.toString('yyyy-MM-dd'),
                location: search.location,
                occupancy: search.occupancy,
                range: search.range
            }
            if (navigator.cookieEnabled) {
                localStorage.setItem('searchCriteria', JSON.stringify(searchCriteriaObject));
            }

        } catch (e) {
            //console.log((<Error>e).message);
        }
    }

    // Retrieves search criteria from local storage
    public load() {
        var stored: string = (navigator.cookieEnabled) ? localStorage.getItem('searchCriteria') : null;
        if (stored != null) {
            var search: SearchModel = new SearchModel();
            var object: Object = JSON.parse(stored);
            search.promotional_code = object['promotional_code'];
            search.check_in = new Date(this.DateJs.parse(object['check_in']));
            search.check_out = new Date(this.DateJs.parse(object['check_out']));
            search.location = object['location'];
            search.occupancy = object['occupancy'];
            search.range = object['range'];
            return search;
        }
    }
    getQueryParams(){
        return this.route.queryParams;
    }
}
