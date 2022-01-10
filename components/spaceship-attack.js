const { range, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { sampleTime, reduce, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo, flatMap, toArray } = rxjs.operators;

const firing$ = (fireButton) => fromEvent(fireButton, 'click')
  .pipe(
    tap(e => {
      // e.stopPropagation();
      // e.preventDefault();
    }),
    tap(x => console.log('FIRE!', x)),
    // filter(({ touches }) => touches.length === 2),
    // filter(({ touches }) => touches[1].target === fireButton),
  );
export default (coords, fireButton) => firing$(coords, fireButton);