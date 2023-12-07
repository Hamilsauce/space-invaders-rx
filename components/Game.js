import spaceship from './spaceship.js';
import starfield from './starfield.js';
import spaceshipShots from './spaceship-attack.js';
import enemies from './enemies.js';

const { combineLatest, iif, ReplaySubject, AsyncSubject, BehaviorSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export class Game {
  constructor(parent) {
    this.canvas = document.createElement('canvas');
    this.parent = parent ? parent : document.body;
    this.coordsEl = document.querySelector('#app-header-score');
    this.canvas.width = parseInt(getComputedStyle(this.parent).width) - 10;
    this.canvas.height = parseInt(getComputedStyle(this.parent).height);
    this.coords = { x: this.canvas.width / 2, y: this.canvas.height - 30 };
    this.ctx = this.canvas.getContext('2d');

    this.starfield$ = starfield(this.canvas);
    this.spaceship = spaceship(this.coords, document.querySelector('.trackpad'), document.querySelector('.fire-button'))
    this.spaceship$ = this.spaceship.ship
    this.spaceshipShots$ = this.spaceship.shots
    this.enemies$ = enemies(this.canvas);

    this.ScoreSubject$ = new BehaviorSubject(0)
    this.score$ = this.ScoreSubject$.pipe(scan((prev, curr) => prev + curr, 0))

    this.scene = combineLatest(
      this.starfield$,
      this.spaceship$,
      this.spaceshipShots$,
      this.enemies$,
      this.score$,
      (stars, spaceship, spaceshipShots, enemies, score) => ({ stars, spaceship, spaceshipShots, enemies, score })
    ).pipe(
      sampleTime(40),
      takeWhile(({ spaceship, enemies }) => this.gameOver(spaceship, enemies) === false)
    )
  }

  static create(parent, config = {}) {
    return Object.assign(new Game(parent), config).init()
  }

  init() {
    this.parent.append(this.canvas);
   
    this.scene.subscribe(this.render.bind(this));
    
    return this;
  }

  render({ stars, spaceship, spaceshipShots, enemies, score }) {
    this.paintStars(stars)
    this.paintSpaceship.bind(this)(spaceship)
    this.paintSpaceshipShots(spaceshipShots, enemies)
    this.paintEnemies(enemies)
    this.paintScore(score)
  }

  gameOver(ship, enemies) {
    return enemies.some(enemy => {
      if (this.collision(ship, enemy)) return true;
    
      return enemy.shots.some(shot => this.collision(ship, shot))
    });
  }

  collision(target1, target2) {
    return (
      target1.x > target2.x - 20 &&
      target1.x < target2.x + 20 &&
      (target1.y > target2.y - 20 && target1.y < target2.y + 20)
    )
  }

  paintScore(score) {
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = 'bold 56px san-serif';
    this.ctx.fillText = (`Score: ${score}`, 270, 240);
  }

  paintStars(stars = []) {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#FFFFFF';

    stars.forEach(({ x, y, size }, i) => {
      this.ctx.fillRect(x, y, size, size);
    });
  }

  updateCoords(x, y) {
    this.coordsEl.textContent = `[ ${x}, ${y} ]`;
  }
  
  paintSpaceship({ x, y }) {
    this.updateCoords(
      Math.round(x),
      Math.round(y)
    );
    
    this.drawTriangle(x, y, 20, '#AE1515', 'up');
  }

  paintSpaceshipShots(fireEvents, enemies = []) {
    fireEvents.forEach((shot, i) => {
      for (let l = 0; l < enemies.length; l++) {
        const enemy = enemies[l];

        if (!enemy.isDead && this.collision(shot, enemy)) {
          this.ScoreSubject$.next(10)
          enemy.isDead = true;
          shot.x = shot.y = -100
          break;
        }
      }
      shot.y -= 15
      this.drawTriangle(shot.x, shot.y, 10, '#FFD70A', 'up')
    });
  }

  paintEnemies(enemies = []) {
    enemies.forEach((enemy) => {
      enemy.y += 5;
      enemy.x += this.getRandomInt(-15, 15)

      if (!enemy.isDead) {
        this.drawTriangle(enemy.x, enemy.y, 20, '#00FF00', 'down')
      }

      enemy.shots.forEach((shot, i) => {
        shot.y += 15
        this.drawTriangle(shot.x, shot.y, 10, '#E9B026', 'down')
      });
    });
  }

  drawTriangle(x, y, width, color = '#AE1515', direction) {
    this.ctx.fillStyle = color
    this.ctx.beginPath();
    this.ctx.moveTo(x - width, y);
    this.ctx.lineTo(x, direction === 'up' ? y - width : y + width);
    this.ctx.lineTo(x + width, y)
    this.ctx.lineTo(x - width, y)
    this.ctx.fill()
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}