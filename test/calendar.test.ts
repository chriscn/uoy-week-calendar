import {
	Term,
	Holiday,
	Semester1A,
	Semester1B,
	Semester2A,
	Semester2B,
	SemesterSummerVacation,
	CalendarType,
	getWeeksBetween,
	getAcademicYear,
	getNextPeriod,
	academicYears
} from '../src/calendar';

function addWeeks(d: Date, weeks: number): Date {
	return new Date(d.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
}

describe('University of York Calendar', () => {
    test('academicYears contains at least one academic year', () => {
        expect(academicYears.length).toBeGreaterThan(0);
    });

	test('Term.getWeekName returns Term Week with correct week number', () => {
		const start = new Date(Date.UTC(2020, 0, 1));
		const t = new Term(start, 'Autumn');
		expect(t.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe('Autumn Term Week 1');

		const twoWeeksLater = addWeeks(start, 2);
		expect(t.getWeekName(twoWeeksLater, CalendarType.UNDERGRADUATE)).toBe('Autumn Term Week 3');
	});

	test('Holiday.getWeekName returns Vacation Week with correct week number', () => {
		const start = new Date(Date.UTC(2020, 11, 20));
		const h = new Holiday(start, 'Christmas');
		expect(h.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe('Christmas Vacation Week 1');

		const oneWeekLater = addWeeks(start, 1);
		expect(h.getWeekName(oneWeekLater, CalendarType.UNDERGRADUATE)).toBe('Christmas Vacation Week 2');
	});

	describe('Semester1A behaviors', () => {
		const start = new Date(Date.UTC(2023, 8, 18));
		const s1a = new Semester1A(start);

		test('UNDERGRADUATE: freshers week and teaching weeks', () => {
			expect(s1a.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe("S1/0 (Freshers' Week)");

			const week3 = addWeeks(start, 2); // week = 3
			expect(s1a.getWeekName(week3, CalendarType.UNDERGRADUATE)).toBe('S1/2 (Teaching Week 2)');
		});

		test('STAFF: week 7 is Open Week', () => {
			const week7 = addWeeks(start, 6); // week = 7
			expect(s1a.getWeekName(week7, CalendarType.STAFF)).toBe('S1/C (Open Week)');
		});

		test('STAFF: freshers week and early teaching weeks', () => {
			// staff freshers (week 1)
			expect(s1a.getWeekName(start, CalendarType.STAFF)).toBe("S1/0 (Freshers' Week)");

			// staff teaching week (week 3 -> teaching week 2)
			const staffWeek3 = addWeeks(start, 2);
			expect(s1a.getWeekName(staffWeek3, CalendarType.STAFF)).toBe('S1/2 (Teaching Week 2)');
		});

		test('UNDERGRADUATE: consolidation and later teaching weeks', () => {
			const cons = addWeeks(start, 6); // week 7 -> Consolidation
			expect(s1a.getWeekName(cons, CalendarType.UNDERGRADUATE)).toBe('S1/C (Consolidation)');

			const later = addWeeks(start, 9); // week 10 -> S1/8
			expect(s1a.getWeekName(later, CalendarType.UNDERGRADUATE)).toBe('S1/8 (Teaching Week 8)');
		});

		test('STAFF: later teaching weeks for staff', () => {
			const laterStaff = addWeeks(start, 9); // week 10
			expect(s1a.getWeekName(laterStaff, CalendarType.STAFF)).toBe('S1/8 (Teaching Week 8)');
		});
	});

	describe('Semester1B behaviors', () => {
		const start = new Date(Date.UTC(2024, 0, 8));
		const s1b = new Semester1B(start);

		test('UNDERGRADUATE: revision and assessment weeks', () => {
			// week 1 -> revision
			expect(s1b.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe('S1/12 (Revision Week)');

			// week 3 -> Assessment Week 2
			const week3 = addWeeks(start, 2);
			expect(s1b.getWeekName(week3, CalendarType.UNDERGRADUATE)).toBe('S1/14 (Assessment Week 2)');
		});

		test('STAFF: marking weeks after open weeks', () => {
			// week 3 for staff -> Marking Week 1
			const week3 = addWeeks(start, 2);
			expect(s1b.getWeekName(week3, CalendarType.STAFF)).toBe('S1/14 (Marking Week 1)');
		});

		test('STAFF: open weeks for week 1 and 2', () => {
			const wk1 = addWeeks(start, 0);
			expect(s1b.getWeekName(wk1, CalendarType.STAFF)).toBe('S1/12 (Open Week 1)');

			const wk2 = addWeeks(start, 1);
			expect(s1b.getWeekName(wk2, CalendarType.STAFF)).toBe('S1/13 (Open Week 2)');
		});
	});

	describe('Semester2A behaviors', () => {
		const start = new Date(Date.UTC(2025, 1, 3));
		const s2a = new Semester2A(start);

		test('UNDERGRADUATE: refreshers then teaching', () => {
			expect(s2a.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe("S2/0 (Refreshers' Week)");
			const week2 = addWeeks(start, 1);
			expect(s2a.getWeekName(week2, CalendarType.UNDERGRADUATE)).toBe('S2/1 (Teaching Week 1)');
		});

		test('STAFF: week 1 marking behavior', () => {
			expect(s2a.getWeekName(start, CalendarType.STAFF)).toBe('S2/0 (Marking Week 3)');
		});

		test('STAFF: teaching weeks after week 1', () => {
			const wk2 = addWeeks(start, 1);
			expect(s2a.getWeekName(wk2, CalendarType.STAFF)).toBe('S2/1 (Teaching Week 1)');
		});
	});

	describe('Semester2B behaviors', () => {
		const start = new Date(Date.UTC(2024, 3, 8));
		const offset = 8;
		const s2b = new Semester2B(start, offset);

		test('UNDERGRADUATE: teaching and revision/assessment boundaries', () => {
			// same week -> week = offset
			expect(s2b.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe('S2/7 (Teaching Week 7)');

			// 5 weeks later -> week = 13 -> revision week
			const wk5 = addWeeks(start, 5); // getWeeksBetween = 5
			expect(s2b.getWeekName(wk5, CalendarType.UNDERGRADUATE)).toBe('S2/12 (Revision Week)');
		});

		test('STAFF: open weeks and marking weeks', () => {
			// 5 weeks later -> week = 13 -> Open Week 1
			const wk5 = addWeeks(start, 5);
			expect(s2b.getWeekName(wk5, CalendarType.STAFF)).toBe('Open Week 1');

			// beyond week 14 -> marking week should appear
			const wk8 = addWeeks(start, 8); // week = 16 -> Marking Week 2 (16 - 14)
			expect(s2b.getWeekName(wk8, CalendarType.STAFF)).toBe('Marking Week 2');
		});

		test('STAFF: teaching weeks when week <= 12', () => {
			// with offset 8, start -> week = 8 -> Teaching Week 7
			expect(s2b.getWeekName(start, CalendarType.STAFF)).toBe('Teaching Week 7');
		});

		test('STAFF: open week when week == 14', () => {
			// with offset 8, getWeeksBetween = 6 -> week = 14
			const wk6 = addWeeks(start, 6);
			expect(s2b.getWeekName(wk6, CalendarType.STAFF)).toBe('Open Week 2');
		});

		test('UNDERGRADUATE: assessment weeks beyond week 13', () => {
			// need week > 13; with offset 8, pick getWeeksBetween = 6 -> week = 14
			const wk6 = addWeeks(start, 6);
			expect(s2b.getWeekName(wk6, CalendarType.UNDERGRADUATE)).toBe('S2/13 (Assessment Week 1)');
		});
	});

	describe('SemesterSummerVacation behaviors', () => {
		const start = new Date(Date.UTC(2024, 5, 10));
		const vac = new SemesterSummerVacation(start);

		test('getWeekName returns generic Vacation Week string', () => {
			expect(vac.getWeekName(start, CalendarType.UNDERGRADUATE)).toBe('Summer Vacation Week 1');
		});

		test('getWeekname (differing logic) for UNDERGRADUATE, POSTGRADUATE and STAFF', () => {
			// UNDERGRADUATE: week 10 should produce Resit Period
			const week10 = addWeeks(start, 9);
			expect(vac.getWeekname(week10, CalendarType.UNDERGRADUATE)).toBe('Resit Period');

			// POSTGRADUATE: teaching weeks and resit note for weeks 10/11
			const week2 = addWeeks(start, 1);
			expect(vac.getWeekname(week2, CalendarType.POSTGRADUATE)).toBe('Teaching Week 2');

			const week11 = addWeeks(start, 10);
			expect(vac.getWeekname(week11, CalendarType.POSTGRADUATE)).toContain('Resist Period');

			// STAFF: week 1 marking then open weeks and board of exam on week 4
			expect(vac.getWeekname(start, CalendarType.STAFF)).toBe('Marking Week 3');
			const week4 = addWeeks(start, 3); // week = 4 -> Open Week 3 + Board
			expect(vac.getWeekname(week4, CalendarType.STAFF)).toContain('Board of Examiners');

			// UNDERGRADUATE: weeks outside resit window should return empty string
			const ugWeek2 = addWeeks(start, 1);
			expect(vac.getWeekname(ugWeek2, CalendarType.UNDERGRADUATE)).toBe('');
		});
	});

	describe('Utility functions', () => {
		test('getWeeksBetween returns 0 for same date and positive for later dates', () => {
			const a = new Date(Date.UTC(2021, 0, 1));
			const b = new Date(Date.UTC(2021, 0, 1));
			expect(getWeeksBetween(a, b)).toBe(0);
			const c = addWeeks(a, 3);
			expect(getWeeksBetween(a, c)).toBe(3);
		});

		test('getAcademicYear returns start/end year pair', () => {
			const label = getAcademicYear(academicYears[0]);
			expect(label).toBe('2018/2019');
		});

		test('getNextPeriod returns the following period within the academicYears structure', () => {
			const currentAcademic = academicYears[0];
			const currentPeriod = currentAcademic.periods[0];
			const next = getNextPeriod(currentPeriod, currentAcademic);
			expect(next).toBe(currentAcademic.periods[1]);
		});

		test('getNextPeriod returns next academic year first period when current is last in year', () => {
			const currentAcademic = academicYears[0];
			const lastPeriod = currentAcademic.periods[currentAcademic.periods.length - 1];
			const next = getNextPeriod(lastPeriod, currentAcademic);
			expect(next).toBe(academicYears[1].periods[0]);
		});
	});
});
