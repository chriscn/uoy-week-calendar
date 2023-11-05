# uoy-week-calendar

This typescript application generates an iCalendar containing the week numbers for the University of York terms. It is then served using GitHub pages.   

It is partly inspired by [kothar/uoy-week-calendar](https://github.com/kothar/uoy-week-calendar), however he has made it [clear](https://github.com/kothar/uoy-week-calendar/blob/3648bc85d0478d19cb6d6bef9ca5ba7dd907f9ff/index.php#L28) that he won't be updating the calendar; the calendar itself is currently offline.

All commit messages should follow the [Convential Commit](https://cheatography.com/albelop/cheat-sheets/conventional-commits/) specification.

## Specification

Should produce an iCalendar valid file which complies to the following:
- Every monday there should be an all day event
- The event summary should be on the following (replace # with week number, & with week type)
  - <Autumn/Spring/Summer> Term Week #
  - <Christmas/Easter/Summer> Vacation Week #
  - Semester <One/Two> Week # (&)

### Week Type

Moving to semesters each week will be one of the following:

- **f/rf**: Freshers/Refreshers Week - no teaching
- **1-n**: Teaching and Learning Week
- **c**: Consolidation
- **v**: Vacation
- **rv**: Revision and essay writing weeks - free from contact time and scheduled assessments
- **ra**: Revision and assessment weeks. Departments will set examinations and end-of-semester assessment deadlines
- **m**: Marking - free from teaching
- **o**: Research, admin duties, PGR/PGT supervision, Summer resits, teaching prep, student recruitment activities, vacation. Will be described as Open

The types are dependent on which calendar you subscribe to: undergraduate, postgraduate or staff.

## Notes

The `offset` value, is the  Week Number that begins after Easter. For 2023/24 this is 8. It will be one more than the teaching week due to either the 3rd Marking Week or Refreshers Week.

The site has moved from [https://calendar.chrisnethercott.co.uk](https://calendar.chrisnethercott.co.uk) to [https://chriscn.github.io/uoy-week-calendar](https://chriscn.github.io/uoy-week-calendar).

## License

MIT Licensed
