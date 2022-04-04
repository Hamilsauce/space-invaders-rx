const { combineLatest, range, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, timestamp, sampleTime, reduce, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo, flatMap, toArray } = rxjs.operators;

let canvasWidth, canvasHeight, padWidth, padHeight

setTimeout(() => {
  canvasWidth = parseInt(document.querySelector('canvas').width)
  padWidth = parseInt(getComputedStyle(document.querySelector('.trackpad')).width)
}, 0)

/* TODO
  IDEAS: 
  1. Hold down fire to save up shots and rapid fire
  2. Double clock + touchstart to auto fire
  3. Add Y move
  TODO */

const firing = (fireButton, trackpad) =>
  merge(fromEvent(trackpad, 'click'),
    fromEvent(fireButton, 'touchstart'))
  .pipe(
    tap(e => e.stopPropagation()),
    tap(() => {
      fireButton.classList.add('pressed');
      setTimeout(() => {
        fireButton.classList.remove('pressed')
      }, 40)
    }),
    startWith({}),
    sampleTime(300),
    timestamp(),
  );

export const spaceship = (startCoords, trackpad) =>
  // fromEvent(trackpad, 'touchstart')
  // .pipe(
  // mergeMap(({ touches }) => {
  //   let spot;// = document.querySelector('.spot') ? document.querySelector('.spot') : document.createElement('div');
  //   spot.classList.add('spot')
  //   if (!document.querySelector('.spot')) {
  //     spot = document.createElement('div');
  //     trackpad.appendChild(spot)
  //     // spot.classList.add('spot')
  //   } else {
  //     spot = document.querySelector('.spot');
  //   }
  //   spot.style.top `${touches.y}px`
  //   spot.style.top `${touches.x}px`
  //   return
  fromEvent(trackpad, 'touchmove')
  .pipe(
    tap(e => e.stopPropagation()),

    map(({ touches }) => {
      return (((touches[0].pageX / padWidth) * 100) / 100) * canvasWidth
      // y: (((touches[0].pageY / padHeight) * 100) / 100) * canvasHeight,
    }),
    tap(touch => {}),
    scan(({ x, y }, canvasPixels) => {
      if (canvasPixels + 15 <= canvasWidth && canvasPixels - 15 >= 0) {
        return { x: canvasPixels, y: y }
      }
      else return { x, y }
    }, { x: startCoords.x, y: startCoords.y }),
    startWith({ x: startCoords.x, y: startCoords.y }),
  )
// })
// )

export default (coords, trackpad, fireButton, ) => {
  const ship = spaceship(coords, trackpad);
  return {
    ship: ship,
    shots: combineLatest(
      firing(fireButton, trackpad),
      ship,
      (fireEvents, spaceship) =>
      ({ timestamp: fireEvents.timestamp, x: spaceship.x, y: spaceship.y })
    ).pipe(
      distinctUntilChanged((lastShot, newShot) => lastShot.timestamp === newShot.timestamp),
      scan((shots, shot) => [...shots, { x: shot.x, y: shot.y }], []),
    )
  }
}
