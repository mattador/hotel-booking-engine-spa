import {Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild} from "@angular/core";
import {CalendarService} from "../../_services/index";
import {SearchModel} from "../../_models/index";

@Component({
    templateUrl: './search-calendar.component.html',
    selector: 'search-calendar',
    encapsulation: ViewEncapsulation.None
})
export class SearchCalendarComponent implements OnInit {

    DateJs: IDateJSStatic = <any>Date;

    public calendar: {}[];

    public calendarOpen: Boolean = false;

    public calendarInitialized: Boolean = false;

    public nights = 0;

    public MAX_DAYS: number = 30;

    public showWarning: Boolean = false;
    public disableOk: Boolean = false;

    public months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    @Input()
    public criteria: SearchModel;

    public isCheckInTurn: boolean = false;

    public checkIn: Date;

    public checkOut: Date;

    @Output()
    dateChanged: EventEmitter<any> = new EventEmitter();

    constructor(private calendarService: CalendarService, private el: ElementRef) {
    }

    ngOnInit() {
        this.calendar = this.calendarService.getCalendar();
        this.checkIn = this.criteria.check_in;
        this.checkOut = this.criteria.check_out;
    }


    ngAfterViewChecked() {
        //call once on view initialization
        if (this.calendarOpen && !this.calendarInitialized) {
            this.highlightDates();
        }
    }


    closeCalendar() {
        if (this.calendarOpen) {
            this.calendarOpen = false;
        }
        this.dateChanged.emit(true);
    }

    interactCalendar(movement: String) {
        if (!this.calendarOpen) {
            this.calendarOpen = true;
            this.highlightDates();
        }
        //Adds semantic sense to clicking on calendar arrival and departure place holders....
        if (movement == 'check_in') {
            this.isCheckInTurn = true;
        } else {
            this.isCheckInTurn = false;
        }
    }

    /**
     * @param dateAsString
     */
    dateClicked(li: any) {
        this.nights = 0;
        if (li.getAttribute('class') == null || li.getAttribute('class').indexOf('day-number') < 0 || li.getAttribute('class').indexOf('day-number-inactive') >= 0) {
            //console.log('click on inactive day detected');
            return;
        }

        this.showWarning = false;
        //After adding inactive days from previous months, I needed to differentiate the data attribute some how
        var selectedDate: Date = this.DateJs.parseExact(li.getAttribute('data-date').replace('|false', ''), 'yyyy-M-d');

        if (this.isCheckInTurn) {
            this.checkIn = selectedDate;
            this.isCheckInTurn = false;
            this.checkOut = null;
            this.disableOk = true;
        } else {
            if (selectedDate.compareTo(this.checkIn) == 0) {
                //console.log('dates are equal');
                //Check in is == to check out date, so purge check out date
                this.checkOut = null;
                this.isCheckInTurn = false;
                this.disableOk = true;
            } else if (this.countDays() > this.MAX_DAYS) {
                //console.log('selected range is > 30 days');
                //If selected range is higher than max threshold, show showWarning message
                this.checkOut = null;
                this.isCheckInTurn = false;
                this.disableOk = true;
                this.showWarning = true;
            } else if (selectedDate.compareTo(this.checkIn) < 0) {
                //console.log('check out date is < check in date');
                //Check in is > than check out date
                this.checkOut = null;
                this.checkIn = selectedDate;
                this.disableOk = true;
                this.isCheckInTurn = false;
            } else {
                this.checkOut = selectedDate;
                this.isCheckInTurn = true;
                this.disableOk = false;
            }
        }
        this.criteria.check_in = this.checkIn;
        this.criteria.check_out = this.checkOut;
        this.highlightDates();
    }

    protected countDays() {
        if (this.checkOut == null) {
            return 1;
        }
        var days = Math.round(
            Math.abs(this.checkIn.getTime() - this.checkOut.getTime())
            / (1000 * 60 * 60 * 24)
        );
        return days + 1;
    }

    protected highlightDates(): boolean {
        if (this.criteria.check_out != null) {
            this.nights = this.countDays() - 1;
        }

        //First clean up
        var elements: any[] = this.el.nativeElement.querySelectorAll('.day-number-selected');
        for (var i: number = 0; i < elements.length; i++) {
            elements[i].setAttribute('class', 'day-number');
        }
        //Map out new dates
        var selectedDates: String[] = [];
        selectedDates.push(this.checkIn.toString('yyyy-M-d'));
        var days: number = this.countDays();
        for (var d = 1; d < days; d++) {
            selectedDates.push(this.checkIn.clone().addDays(d).toString('yyyy-M-d'));
        }
        //Now highlight selected dates
        for (var i: number = 0; i < selectedDates.length; i++) {
            var li: any = this.el.nativeElement.querySelector("li[data-date='" + selectedDates[i] + "|false']");
            if (li != null) {
                this.calendarInitialized = true;
                if (selectedDates[0] == selectedDates[i]) {
                    li.setAttribute('class', 'day-number day-number-selected first');
                    //focus on month of check in date
                    //this.el.nativeElement.querySelector('#month__' + selectedDates[i].substr(5, 2).replace('-', '')).focus()
                } else if (selectedDates[selectedDates.length - 1] == selectedDates[i]) {
                    li.setAttribute('class', 'day-number day-number-selected last');
                } else {
                    li.setAttribute('class', 'day-number day-number-selected');
                }
            } else {
                this.calendarInitialized = false;
            }
        }
        return true;
    }
}