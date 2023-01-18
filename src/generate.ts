import dayjs from "dayjs";
import {CalendarType, getAcademicYear, getCurrentAcademicYear, getNextPeriod} from "./period";
import {ICalCalendar} from "ical-generator";
import hash from "hash.js";
import * as fs from "fs";

const today = dayjs().add(3, 'hour');
const currentAcademicYear = getCurrentAcademicYear(today.toDate());

if (!fs.existsSync('./src/public/calendar')) {
    fs.mkdirSync('./src/public/calendar', { recursive: true });
}

for (let calendarType of [CalendarType.UNDERGRADUATE, CalendarType.POSTGRADUATE, CalendarType.STAFF]) {
    const calendar = new ICalCalendar();

    calendar.name(`University of York's Week Numbers (${getAcademicYear(currentAcademicYear)})`);

    for (let currentPeriod of currentAcademicYear.periods) {
        let nextPeriod = getNextPeriod(currentPeriod, currentAcademicYear);

        let startDate = dayjs(currentPeriod.startDate).add(3, 'hours');
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
            })
        }
    }

    calendar.save(`./src/public/calendar/${calendarType as string}.ics`).then().catch(err => console.error(err));
    console.log(`Successfully generated calendar of type ${calendarType as string} for academic year ${getAcademicYear(currentAcademicYear)}`)
}
