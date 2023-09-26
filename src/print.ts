// Utility file to print information for confirmation

import dayjs from "dayjs";
import { CalendarType, academicYears, getNextPeriod } from "./calendar";


for (let academicYear of academicYears) {
    console.log(academicYear)
    for (let currentPeriod of academicYear.periods) {
        let calendarType = CalendarType.UNDERGRADUATE;
        let nextPeriod = getNextPeriod(currentPeriod, academicYear);

        let startDate = dayjs(currentPeriod.startDate).add(3, 'hour');
        let endDate = dayjs(nextPeriod.startDate).subtract(1, 'day');
        let weeks = endDate.diff(startDate, 'weeks');

        for (let i = 0; i <= weeks; i++) {
            let currentDate = dayjs(startDate).add(i, 'week').toDate();

            console.log(`${currentDate.toISOString()}: ${currentPeriod.getWeekName(currentDate, calendarType)}`)
        }
    }
}