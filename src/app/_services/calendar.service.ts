import {Injectable} from "@angular/core";

@Injectable()
export class CalendarService {

    DateJs: IDateJSStatic = <any>Date;

    protected calendar: {}[];

    /**
     * Needs performance improvements
     * @returns {{}[]}
     */
    getCalendar() {
        if (this.calendar != null) {
            return this.calendar;
        }
        var calendar: {}[] = [];

        //set start date
        var currentMonth: Date = this.DateJs.today();
        var currentDayOfMonth = currentMonth.getDate();
        var year: number;
        var month: number;
        for (var m = 1; m <= 13; m++) {
            if (m == 1) {
                year = currentMonth.getFullYear();
                month = currentMonth.getMonth();
            }
            var calendarMonth: {
                y: number;
                m: number;
                d: any[][]
            };
            calendarMonth = {
                'y': year,
                'm': month,
                'd': []
            };
            //offset start of month according to match starting day of week where Sunday = 0 and Saturday = 6
            var day = new Date(this.DateJs.parse(year + '-' + (month + 1) + '-1')).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            var daysInLastMonth = new Date(year, month, 0).getDate();
            for (var f = day; f > 0; f--) {
                calendarMonth.d.push([daysInLastMonth - (f - 1), true]);
            }
            for (var d = 1; d <= daysInMonth; d++) {
                if (m == 1 && d < currentDayOfMonth) {
                    calendarMonth.d.push([d, true]);
                }
                else if (m == 13 && d >= currentDayOfMonth) {
                    calendarMonth.d.push([d, true]);
                }
                else {
                    calendarMonth.d.push([d, false]);
                }
            }
            calendar.push(calendarMonth);
            if (month == 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
        }
        this.calendar = calendar;
        return this.calendar;
    }

}
