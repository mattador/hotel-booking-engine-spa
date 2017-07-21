import {Component, ViewEncapsulation, Input} from "@angular/core";

@Component({
    templateUrl: './hotel-images.component.html',
    selector: 'hotel-images',
    encapsulation: ViewEncapsulation.None
})
export class HotelImagesComponent {

    CDN:string = process.env.CDN;

    config: any = {
        touchEventsTarget: 'wrapper',
        effect: 'coverflow',
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
        },
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true
    }

    @Input()
    images: string[];

}
