//Native angular components
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ROUTES} from "./app.routes";
//Third party
import {AccordionModule} from "ngx-accordion";
import {SwiperModule} from 'angular2-useful-swiper';
//Components
import {AppComponent} from "./app.component";
import {BookingComponent} from "./booking/index";
import {CheckoutComponent} from "./checkout/index";
import {CheckoutConfirmationComponent} from "./checkout/confirmation/index";
import {HotelComponent} from "./hotels/hotel/index";
import {HotelImagesComponent} from "./hotels/hotel/images/index";
import {HotelsComponent} from "./hotels/index";
import {SearchComponent} from "./search/index";
import {SearchCalendarComponent} from "./search/calendar/index";
import {SearchLocationComponent} from "./search/location/index";
import {SearchOccupancyComponent} from "./search/occupancy/index";
import {TopNavigatorComponent} from "./top-navigator/top-navigator.component";
import {SubscriptionComponent} from "./subscription/index";
import {LoaderComponent} from "./loader/index";
import {SearchNavComponent} from "./search/search-nav";
import {FocusDirective} from './_directives/index';
import {NgPipesModule} from 'ngx-pipes';

//Services
import {
    SharedService,
    HotelService,
    SearchService,
    ReservationService,
    CalendarService,
    SubscriptionService
} from "./_services/index";
//Pipes
import {FormatDescriptionPipe} from "./_pipes/index";
import {StayPipe, FilterHotelsPipe} from "./_pipes";


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(ROUTES),
        AccordionModule,
        SwiperModule,
        NgPipesModule
    ],
    declarations: [
        AppComponent,
        BookingComponent,
        CheckoutComponent,
        CheckoutConfirmationComponent,
        HotelComponent,
        HotelImagesComponent,
        HotelsComponent,
        SearchComponent,
        SearchCalendarComponent,
        SearchLocationComponent,
        SearchOccupancyComponent,
        SearchNavComponent,
        SubscriptionComponent,
        LoaderComponent,
        TopNavigatorComponent,
        FormatDescriptionPipe,
        StayPipe,
        FilterHotelsPipe,
        FocusDirective
    ],
    providers: [
        //shared between all components at this level
        //remember to only add it at component specific level if sharing is not necessary
        HotelService,
        SearchService,
        ReservationService,
        SharedService,
        CalendarService,
        SubscriptionService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
