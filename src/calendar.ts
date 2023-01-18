import {NextFunction, Request, Response} from "express";
import {ICalCalendar} from "ical-generator";
import {CalendarType, getCurrentAcademicYear, getNextPeriod} from "./period";
import hash from 'hash.js';
import dayjs from "dayjs";

const calendar = new ICalCalendar();

calendar.name("University of York's Week Numbers");

export async function getCalendar(req: Request, res: Response, next: NextFunction) {
    let academicYear = getCurrentAcademicYear(dayjs().toDate());

    let type = req.query.type ?? 'undergraduate';
    let calendarType: CalendarType = CalendarType.UNDERGRADUATE;

    if (type == 'undergraduate' || type == 'ug') calendarType = CalendarType.UNDERGRADUATE;
    if (type == 'postgraduate' || type == 'pg') calendarType = CalendarType.POSTGRADUATE;
    if (type == 'staff') calendarType = CalendarType.STAFF;

    for (let currentPeriod of academicYear.periods) {
        let nextPeriod = getNextPeriod(currentPeriod, academicYear);

        let startDate = dayjs(currentPeriod.startDate).add(3, 'hours'); // Really hacky fix for preventing events from appearing on the previous day due to BST
        let endDate = dayjs(nextPeriod.startDate).subtract(1, 'day');

        let weeks = endDate.diff(startDate, 'weeks');

        for (let i = 0; i <= weeks; i++) {
            let currentDate = dayjs(startDate).add(i, 'weeks').toDate();

            calendar.createEvent({
                start: currentDate,
                end: currentDate,
                id: hash.sha256().update(`${currentPeriod.getFormattedString(currentDate, calendarType)}${currentDate}`).digest('hex'),
                allDay: true,
                summary: currentPeriod.getFormattedString(currentDate, calendarType)
            });
        }

    }

    calendar.serve(res);
}
