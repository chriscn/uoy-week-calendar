import dayjs from "dayjs";

interface Period {
    readonly startDate: Date;
    readonly type: string;

    getFormattedString(inputDate: Date, calendarType?: CalendarType): string;
}

type AcademicYear = {
    periods: Period[];
}

export enum CalendarType {
    UNDERGRADUATE = 'undergraduate',
    POSTGRADUATE = 'postgraduate',
    STAFF = 'staff'
}

export class Term implements Period {
    readonly startDate: Date;
    readonly type: string;

    constructor(startDate: Date, type: string) {
        this.startDate = startDate;
        this.type = type;
    }

    public getFormattedString(inputDate: Date): string {
        return `${this.type} Term Week ${getWeeksBetween(this.startDate, inputDate) + 1}`;
    }
}

export class Holiday implements Period {
    readonly startDate: Date;
    readonly type: string;

    constructor(startDate: Date, type: string) {
        this.startDate = startDate;
        this.type = type;
    }

    public getFormattedString(inputDate: Date): string {
        return `${this.type} Vacation Week ${getWeeksBetween(this.startDate, inputDate) + 1}`;
    }
}

// Whomever had the dimwitted idea to convert to semester's I'll never know but it is a nightmare to try and code for.
// The solution is the following, to split the year into Three Semesters and Three Holidays.
// SemesterOne (Start till Christmas), Christmas, SemesterTwo(Christmas till Easter), Easter, Semester Three(Easter till Summer), Summer Holiday
// The only thing that moves is Easter, and we can logic around that.
// Staff also have different calendars than students now
export class SemesterOne implements Period {
    readonly startDate: Date;
    readonly type: string;

    constructor(startDate: Date) {
        this.startDate = startDate;
        this.type = "Semester 1";
    }

    public getFormattedString(inputDate: Date, calendarType: CalendarType): string {
        let week = getWeeksBetween(this.startDate, inputDate) + 1;
        let weekType = "";

        if (calendarType == CalendarType.UNDERGRADUATE || calendarType == CalendarType.POSTGRADUATE) {
            if (week == 1) {
                weekType = `Freshers`
            } else if (week >= 2 && week <= 6) {
                weekType = `Teaching Week ${week - 1}`
            } else if (week == 7) {
                weekType = 'Consolidation Week'
            } else if (week >= 8 && week <= 13) {
                weekType = `Teaching Week ${week - 2}`
            }
        } else if(calendarType == CalendarType.STAFF) {
            if (week == 1) {
                weekType = `Open Week`
            } else if (week >= 2 && week <= 6) {
                weekType = `Teaching Week ${week - 1}`
            } else if (week == 7) {
                weekType = 'Open Week'
            } else if (week >= 8 && week <= 13) {
                weekType = `Teaching Week ${week - 2}`
            }
        }

        return `${this.type} Week ${week} (${weekType})`
    }
}

// This is for the period after Christmas but before Easter
export class SemesterTwo implements Period {
    readonly startDate: Date;
    readonly type: string;

    constructor(startDate: Date) {
        this.startDate = startDate;
        this.type = "Semester 2";
    }

    public getFormattedString(inputDate: Date, calendarType: CalendarType): string {
        let week = getWeeksBetween(this.startDate, inputDate) + 1;
        let weekType = "";

        if(calendarType == CalendarType.UNDERGRADUATE || calendarType == CalendarType.POSTGRADUATE) {
            if (week == 1) {
                weekType = 'Revision Week'
            } else if (week >= 2 && week <= 4) {
                weekType = `Assessment Week ${week - 1}`
            } else if (week == 5) {
                weekType = 'Refreshers Week'
            } else if (week >= 6) {
                weekType = `Teaching Week ${week - 5}`
            }
        } else if(calendarType == CalendarType.STAFF) {
            if (week == 1 || week == 2) {
                weekType = `Open Week ${week}`
            } else if (week >= 3 && week <= 5) {
                weekType = `Marking Week ${week - 2}`
            } else if (week >= 6) {
                weekType = `Teaching Week ${week - 5}`
            }
        }

        return `${this.type} Week ${week} (${weekType})`
    }
}

// Period after Easter before Summer
export class SemesterThree implements Period {
    readonly startDate: Date;
    readonly type: string;
    private readonly offset: number;

    constructor(startDate: Date, offset: number) {
        this.startDate = startDate;
        this.offset = offset;
        this.type = "Semester 2"; // lies
    }

    public getFormattedString(inputDate: Date, calendarType: CalendarType): string {
        let week = getWeeksBetween(this.startDate, inputDate) + this.offset; // No requirement to add one as we already did in the offset
        let weekType = "";

        if (calendarType == CalendarType.UNDERGRADUATE || calendarType == CalendarType.POSTGRADUATE) {
            if (week >= 12 && week <= 16) {
                weekType = `Teaching Week ${week - 5}`
            } else if (week == 17) {
                weekType = 'Revision Week'
            } else if (week <= 20) {
                weekType = `Assessment Week ${week - 17}`
            }
        } else if(calendarType == CalendarType.STAFF) {
            if (week >= 12 && week <= 16) {
                weekType = `Teaching Week ${week - 5}`
            } else if (week == 17 || week == 18) {
                weekType = `Open Week ${week - 16}`
            } else if (week <= 20) {
                weekType = `Marking Week ${week - 18}`
            }
        }

        return `${this.type} Week ${week} (${weekType})`
    }
}

export class SemesterSummerVacation implements Period {
    readonly startDate: Date;
    readonly type: string;

    constructor(inputDate: Date) {
        this.startDate = inputDate;
        this.type = 'Summer';
    }

    public getFormattedString(inputDate: Date, calendarType: CalendarType): string {
        let week = getWeeksBetween(this.startDate, inputDate) + 1;
        let weekType = "";

        if(calendarType == CalendarType.UNDERGRADUATE) {
            if (week == 10 || week == 11) {
                return `${this.type} Vacation Week ${week} (Resit Period)`;
            } else {
                return `${this.type} Vacation Week ${week}`;
            }
        } else if(calendarType == CalendarType.POSTGRADUATE) {
            weekType = `Teaching Week ${week}`;

            if (week == 10 || week == 11) {
                weekType += ' (Resist Period)'
            }
        } else if(calendarType == CalendarType.STAFF) {
            if (week == 1) {
                weekType = 'Marking Week 3'; // staff term finishes one week into vacation period
            } else {
                weekType = `Open Week ${week - 1}`

                if (week == 4) {
                    weekType += ' / Board of Examiners'
                }
            }
        }

        return `${this.type} Vacation Week ${week} (${weekType})`
    }
}

export const academicYears: AcademicYear[] = [
    {
        periods: [
            new Term(new Date(Date.UTC(2018, 8, 24)), "Autumn"),
            new Holiday(new Date(Date.UTC(2018, 11, 3)), "Christmas"),
            new Term(new Date(Date.UTC(2019, 0, 7)), "Spring"),
            new Holiday(new Date(Date.UTC(2019, 2, 18)), "Easter"),
            new Term(new Date(Date.UTC(2019, 3, 15)), "Summer"),
            new Holiday(new Date(Date.UTC(2019, 5, 24)), "Summer"),
        ]
    },
    {
        periods: [
            new Term(new Date(Date.UTC(2019, 8, 30)), "Autumn"),
            new Holiday(new Date(Date.UTC(2019, 11, 9)), "Christmas"),
            new Term(new Date(Date.UTC(2020, 0, 6)), "Spring"),
            new Holiday(new Date(Date.UTC(2020, 2, 16)), "Easter"),
            new Term(new Date(Date.UTC(2020, 3, 14)), "Summer"),
            new Holiday(new Date(Date.UTC(2020, 5, 22)), "Summer"),
        ]
    },
    {
        periods: [
            new Term(new Date(Date.UTC(2020, 8, 28)), "Autumn"),
            new Holiday(new Date(Date.UTC(2020, 11, 7)), "Christmas"),
            new Term(new Date(Date.UTC(2021, 0, 11)), "Spring"),
            new Holiday(new Date(Date.UTC(2021, 2, 22)), "Easter"),
            new Term(new Date(Date.UTC(2021, 3, 19)), "Summer"),
            new Holiday(new Date(Date.UTC(2021, 5, 28)), "Summer"),
        ]
    },
    {
        periods: [
            new Term(new Date(Date.UTC(2021, 8, 27)), "Autumn"),
            new Holiday(new Date(Date.UTC(2021, 11, 6)), "Christmas"),
            new Term(new Date(Date.UTC(2022, 0, 10)), "Spring"),
            new Holiday(new Date(Date.UTC(2022, 2, 21)), "Easter"),
            new Term(new Date(Date.UTC(2022, 3, 19)), "Summer"),
            new Holiday(new Date(Date.UTC(2022, 5, 27)), "Summer"),
        ]
    },
    {
        periods: [
            new Term(new Date(Date.UTC(2022, 8, 26)), "Autumn"),
            new Holiday(new Date(Date.UTC(2022, 11, 5)), "Christmas"),
            new Term(new Date(Date.UTC(2023, 0, 9)), "Spring"),
            new Holiday(new Date(Date.UTC(2023, 2, 20)), "Easter"),
            new Term(new Date(Date.UTC(2023, 3, 17)), "Summer"),
            new Holiday(new Date(Date.UTC(2023, 5, 26)), "Summer"),
        ]
    },
    {
        periods: [
            // 2023/24
            new SemesterOne(new Date(Date.UTC(2023, 8, 18))),
            new Holiday(new Date(Date.UTC(2023, 11, 18)), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2024, 0, 8))),
            new Holiday(new Date(Date.UTC(2024, 2, 25)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2024, 3, 8)), 12),
            new SemesterSummerVacation(new Date(Date.UTC(2024, 5, 10))),
        ]
    },
    {
        periods: [
            // 2024/25
            new SemesterOne(new Date(Date.UTC(2024, 8, 16))),
            new Holiday(new Date(2024, 11, 9), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2025, 0, 6))),
            new Holiday(new Date(Date.UTC(2025, 3, 7)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2025, 3, 22)), 14),
            new SemesterSummerVacation(new Date(Date.UTC(2025, 5, 9))),
        ]
    },
    {
        periods: [
            // 2025/26
            new SemesterOne(new Date(Date.UTC(2025, 8, 16))),
            new Holiday(new Date(2025, 11, 9), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2026, 0, 8))),
            new Holiday(new Date(Date.UTC(2026, 2, 25)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2026, 3, 8)), 13),
            new SemesterSummerVacation(new Date(Date.UTC(2026, 5, 10))),
        ]
    },
    {
        periods: [
            // 2026/27
            new SemesterOne(new Date(Date.UTC(2026, 8, 14))),
            new Holiday(new Date(2026, 11, 21), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2027, 0, 11))),
            new Holiday(new Date(Date.UTC(2027, 2, 22)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2027, 3, 13)), 11),
            new SemesterSummerVacation(new Date(Date.UTC(2027, 5, 14))),
        ]
    },
    {
        periods: [
            // 2027/28
            new SemesterOne(new Date(Date.UTC(2027, 8, 20))),
            new Holiday(new Date(2027, 11, 20), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2028, 0, 10))),
            new Holiday(new Date(Date.UTC(2028, 3, 10)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2028, 3, 24)), 14),
            new SemesterSummerVacation(new Date(Date.UTC(2028, 5, 12))),
        ]
    },
    {
        periods: [
            // 2028/29
            new SemesterOne(new Date(Date.UTC(2028, 8, 18))),
            new Holiday(new Date(2028, 11, 18), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2029, 0, 8))),
            new Holiday(new Date(Date.UTC(2029, 2, 26)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2029, 3, 9)), 12),
            new SemesterSummerVacation(new Date(Date.UTC(2029, 5, 14))),
        ]
    },
    {
        periods: [
            // 2029/30
            new SemesterOne(new Date(Date.UTC(2029, 8, 17))),
            new Holiday(new Date(2029, 11, 17), "Christmas"),
            new SemesterTwo(new Date(Date.UTC(2030, 0, 7))),
            new Holiday(new Date(Date.UTC(2030, 3, 8)), "Easter"),
            new SemesterThree(new Date(Date.UTC(2030, 3, 22)), 14),
            new SemesterSummerVacation(new Date(Date.UTC(2030, 5, 10))),
        ]
    }
];

export function getWeeksBetween(startDate: Date, endDate: Date): number {
    return Math.abs(dayjs(endDate).diff(dayjs(startDate), 'weeks'));
}

export function getAcademicYear(academicYear: AcademicYear): string {
    return `${academicYear.periods[0].startDate.getFullYear()}/${academicYear.periods.slice(-1)[0].startDate.getFullYear()}`
}

/**
 * Given date, returns which AcademicYear it belongs to.
 * @param date
 */
export function getCurrentAcademicYear(date: Date): AcademicYear {
    return academicYears.filter(academicYear => (
        (academicYear.periods[0].startDate <= date && academicYear.periods.slice(-1)[0].startDate >= date)
    ))[0];
}

export function getNextPeriod(currentPeriod: Period, currentAcademicYear: AcademicYear): Period {
    let academicYearIndex = academicYears.indexOf(currentAcademicYear);
    let periodIndex = academicYears[academicYearIndex].periods.indexOf(currentPeriod);

    if (periodIndex < academicYears[academicYearIndex].periods.length - 1) {
        return academicYears[academicYearIndex].periods[periodIndex + 1];
    } else {
        return academicYears[academicYearIndex + 1].periods[0];
    }
}
