import {Component, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
    templateUrl: './app.Component.html',
    selector: 'app',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    constructor(router: Router) {
        // Using Rx's built in `distinctUntilChanged ` feature to handle url change c/o @dloomb's answer
        router.events.distinctUntilChanged((previous: any, current: any) => {
            // Subscribe to any `NavigationEnd` events where the url has changed
            if(current instanceof NavigationEnd) {
                return previous.url === current.url;
            }
            return true;
        }).subscribe((x: any) => {
            //window['ga']('send', 'pageview', x.url);
            //window['woopra'].track(); // Track woopra URL
        });
    }
}
