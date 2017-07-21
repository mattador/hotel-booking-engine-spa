import {Routes} from "@angular/router";
import {SearchComponent} from "./search/index";
import {HotelsComponent} from "./hotels/index";
import {HotelComponent} from "./hotels/hotel/index";
import {CheckoutComponent} from "./checkout/index";
import {BookingComponent} from "./booking/index";
import {SubscriptionComponent} from "./subscription/index";

export const ROUTES: Routes = [
    {path: '', component: SearchComponent},
    {path: 'search', component: HotelsComponent},
    {path: 'search/hotel/:address', component: HotelComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'booking', component: BookingComponent},
    {path: 'booking/:confirmation_code/:last_name', component: BookingComponent},
    {path: 'subscribe', component: SubscriptionComponent},
    {path: '**', component: SearchComponent}
];