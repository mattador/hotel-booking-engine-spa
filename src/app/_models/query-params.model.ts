import {NavigationExtras} from "@angular/router";

export class QueryParams {

    public check_in: string = '';
    public check_out: string = '';
    public room_count: string = '';
    public adult_count: string = '';
    public child_count: string = '';
    public searchTerm: string = '';
    public area_codes: string = '';
    public hotel_codes: string = '';
    public longitude: string = '';
    public latitude: string = '';
    public min: string = '';
    public max: string = '';
    public hotel_code: string = '';
    public room_type_code: string = '';
    public rate_plan_code: string = '';
    public promotional_code: string = '';

    build(params:Object):QueryParams{
        for (let x in params){
            if (x in this){
                this[x] = params[x];
            }
        }
        return this
    }

    buildFromCriteria(params:Object): QueryParams{
        // Build query params out of the search criteria.
        function iterate_objects(instance: QueryParams, params:Object):void{
            for (let x in params){
                // Skip functions;
                if(typeof(params[x]) == 'function'){continue;}
                if(params[x] instanceof Date) {
                    instance[x] = params[x].toString('yyyy-MM-dd');
                }else if(params[x] instanceof Array){
                    instance[x] = JSON.stringify(params[x]);
                }else if (typeof (params[x]) == 'object'){
                    iterate_objects(instance, params[x]);
                }else if(typeof (params[x]) == 'string'){
                    instance[x] = params[x]
                }else if(typeof (params[x]) == 'number'){
                    instance[x] = params[x].toString();
                }
            }
        }
        iterate_objects(this, params);
        return this;
    }

    getNavigationExtras(extra: Object={}, remove:string[]=[]):NavigationExtras{
        let params:NavigationExtras ={queryParams:{}}
        for (let x in this){
            // Skip functions.s
            if(typeof(this[x]) == 'function'){continue}
            // Skip the item if it's within the remove list.
            if (remove.indexOf(x) != -1){continue;}
            let data = JSON.stringify(this[x]);
            // Skip param if empty.
            if (!this[x]){continue}
            params.queryParams[x] = this[x];
        }
        // Add extra params.
        for(let x in extra){
            params.queryParams[x] = extra[x];
        }

        return params;
    }
}
