const { range, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo, flatMap, toArray } = rxjs.operators;

export default ({ width = 0, height = 0 }, SPEED = 40, STAR_COUNT = 250) =>
range(1, STAR_COUNT).pipe(
  map(() => ({
    x: parseInt(Math.random() * width, 10),
    y: parseInt(Math.random() * height, 10),
    size: Math.random() * 3 + 1,
  })),
  toArray(),
  flatMap(stars => interval(SPEED)
    .pipe(
      map(() => {
        stars.forEach((star, i) => {
          if (star.y >= height) star.y = 0; //reset star afrer reachjng top
          star.y += star.size; // move star
        });
        return stars;
      })
    )),
);