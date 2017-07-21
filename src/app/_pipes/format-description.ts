import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatDescription',
    pure: false
})
export class FormatDescriptionPipe implements PipeTransform {

    transform(text: string, args: any[] = null): any {
        var formatted: string = '';
        formatted = text.replace('<p style="font-weight: bold;">ROOM FEATURES</p>', '<h4 class="room-amenities">Room Features</h4>')
        formatted = formatted.replace('<p style="font-weight: bold;">TECHNOLOGY</p>', '<h4 class="room-amenities">Technology</h4>');
        //return text.replace(/\s\-\s/g, ', ');

    }

}