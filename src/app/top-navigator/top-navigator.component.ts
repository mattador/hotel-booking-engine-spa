import {Component, ViewEncapsulation} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {ReservationService} from "../_services";

@Component({
    templateUrl: 'top-navigator.component.html',
    selector: 'top-navigator',
    encapsulation: ViewEncapsulation.None
})
export class TopNavigatorComponent {

    modifyReservation: boolean = false;

    constructor(
                private reservationService: ReservationService,
                private router: Router,
                private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.modifyReservation = (this.reservationService.getModifyReservation())? true: false;
    }

    cancelModification(){
        this.modifyReservation = false;
        this.reservationService.setModifyReservation(null);
        this.router.navigate(['']);
    }
}
