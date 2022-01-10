const { range, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo, flatMap, toArray } = rxjs.operators;


const appBody = document.querySelector('.app-body')
const appBodyWidth = parseInt(getComputedStyle(appBody).width)
// const trackpadWidth = parseInt(getComputedStyle(trackpad).width)

const box = document.createElement('div');
box.classList.add('box');
appBody.appendChild(box)
const boxWidth = parseInt(getComputedStyle(box).width)

const percentBoxWidth = boxWidth / appBodyWidth * 100

let counter = 0
const logEl = document.querySelector('.app-header-log');

const fire$ = (fireButton) => fromEvent(fireButton, 'touchstart')
  .pipe(map(e => {
    counter++
    console.log(`Click ${counter}`);
    logEl.textContent = `Click ${counter}`
  }))

const padMove$ = (trackpad) => fromEvent(trackpad, 'touchstart')
  .pipe(
    tap(() => box.classList.remove('idle')),
    switchMap(startEvent => {
      let lastX = startEvent.touches[0].pageX
      return fromEvent(trackpad, 'touchmove')
        .pipe(
          map(({ touches }) => {
            const newX = touches[0].pageX - lastX;
            lastX = touches[0].pageX
            return newX
          }),
          map((changedX) => {
            const boxX = parseInt(getComputedStyle(box).left) // - (boxWidth / 2)
            box.style.left = `${boxX + changedX}px`;
            return box;
          }),
          switchMap(box => {
            return fromEvent(trackpad, 'touchend')
              .pipe(
                map(() => {
                  const originX = `${50 - (percentBoxWidth / 2)}%`;
                  box.classList.add('idle');
                  box.style.left = originX;
                })
              )
          })
        )
    })
  )

export default (trackpad = document.querySelector('.trackpad'), fireButton = document.querySelector('.fire-button')) => merge(padMove$(trackpad), fire$(fireButton)) //.subscribe()



// export default (trackpadSelector = '.trackpad', w = 0, h = 0) =>
// fromEvent(trackpad, 'touchstart').pipe(
//   tap(() => box.classList.remove('idle')),
//   switchMap(startEvent => {
//     let lastX = startEvent.touches[0].pageX
//     return fromEvent(trackpad, 'touchmove')
//       .pipe(
//         map(({ changedTouches }) => {
//           const newX = changedTouches[0].pageX - lastX;
//           lastX = changedTouches[0].pageX
//           return newX
//         }),
//         map((changedX) => {
//           const boxX = parseInt(getComputedStyle(box).left) // - (boxWidth / 2)
//           box.style.left = `${boxX + changedX}px`;
//           return box;
//         }),
//         switchMap(box => fromEvent(trackpad, 'touchend')
//           .pipe(
//             map(() => {
//               const originX = `${50 - (percentBoxWidth / 2)}%`;
//               box.classList.add('idle');
//               box.style.left = originX;
//             })
//           )
//         )
//       )
//   })
// )