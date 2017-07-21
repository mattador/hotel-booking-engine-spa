import {Location} from "@angular/common";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {isDevMode} from "@angular/core";
import {Observable} from "rxjs";
@Injectable()
export class SharedService {

    constructor(private http: Http, private location: Location) {
    }

    public getBaseUrl(): string {
        if (process.env.ENV === 'development') {
            return 'http://' + window.location.hostname + ':8000';
        } else {
            return 'https://' + window.location.hostname;
        }
    }

    public getHttp() {
        return this.http;
    }

    public handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.msg ? error.msg : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
