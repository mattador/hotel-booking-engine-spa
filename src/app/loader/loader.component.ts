import {Component, ViewEncapsulation, EventEmitter, Input} from '@angular/core';

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoaderComponent {

    forceClose: EventEmitter<any> = new EventEmitter();

    @Input()
    loadingText: string = '';

    cancel() {
        this.forceClose.emit(true);
    }

}