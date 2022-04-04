import { Game } from './components/Game.js';
const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

console.log('1641816702829', 1641816702829)
const app = document.querySelector('.app');
const appBody = app.querySelector('.app-body')
const game = new Game(appBody).init();
