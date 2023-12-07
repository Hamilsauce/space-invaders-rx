const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { combineLatest, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

// const ENEMY_FREQUENCY = 1500;
// const ENEMY_FIRE_RATE = 750;
let canvas;


export default (cnvs, ENEMY_FREQUENCY = 1500, ENEMY_FIRE_RATE = 750) => {
  canvas = cnvs;

  const isVisible = (obj, canv) =>
    obj.x > -40 &&
    obj.x < canv.width &&
    obj.y > -40 &&
    obj.y < canv.height

  return interval(ENEMY_FREQUENCY)
    .pipe(
      scan(enemyArray => {
        const enemy = {
          x: parseInt(Math.random() * canvas.width, 10),
          y: -30,
          shots: [],
        };

        interval(ENEMY_FIRE_RATE).subscribe(() => {
          const { x, y, shots } = enemy;
          if (!enemy.isDead) enemy.shots.push({ x: enemy.x, y: enemy.y })
          enemy.shots = enemy.shots.filter(_ => isVisible(_, canvas))
        });

        enemyArray.push(enemy)
        return enemyArray
          .filter(_ => isVisible(_, canvas))
          .filter(enemy => !(enemy.isDead && enemy.shots.length === 0))
      }, []),
    );
}
