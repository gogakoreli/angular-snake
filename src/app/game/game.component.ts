import { Component, OnInit, ViewChild } from '@angular/core';
import { distinctUntilChanged, retry } from 'rxjs/operators';
import { MAP_HEIGHT, MAP_WIDTH } from '../game/constants';
import { MapComponent } from '../map/map.component';
import { InputKey, InputService } from '../services/input.service';
import { Direction, Food, PlayerPart } from './game.models';
import { Player } from './player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  player: Player;
  food: Food;
  gameSpeed = 50;
  tickDelay = 300;
  interval: NodeJS.Timer;
  gameStarted = false;
  playerDead = false;

  @ViewChild(MapComponent) map: MapComponent;

  updateTickDelay() {
    this.tickDelay = 300 - 250 * this.gameSpeed / 100;
    this.refreshGame();
  }

  constructor(private input: InputService) {}

  ngOnInit() {
    this.subscribeToInput();
    setTimeout(() => {
      this.setupPlayer(this.map);
      this.startGame();
    });
  }

  subscribeToInput() {
    this.input.inputKey$.pipe().subscribe(inputKey => {
      const newDirection = this.getNewDirection(inputKey);
      this.player.updateNextDirection(newDirection);
    });
  }

  getNewDirection(inputKey: InputKey) {
    let result = Direction.None;
    switch (inputKey) {
      case InputKey.Up:
        result = Direction.North;
        break;
      case InputKey.Right:
        result = Direction.East;
        break;
      case InputKey.Down:
        result = Direction.South;
        break;
      case InputKey.Left:
        result = Direction.West;
        break;
    }
    return result;
  }

  setupPlayer(map: MapComponent) {
    this.playerDead = false;
    this.player = new Player(map);
    this.map.drawPlayer(this.player);
  }

  startGame() {
    if (!this.gameStarted) {
      this.interval = setInterval(() => {
        this.perTick();
      }, this.tickDelay);
      this.gameStarted = true;
    }
  }

  stopGame() {
    if (this.gameStarted) {
      clearInterval(this.interval);
      this.gameStarted = false;
    }
  }

  restartGame() {
    this.stopGame();
    this.setupPlayer(this.map);
    this.food = null;
    this.startGame();
  }

  refreshGame() {
    this.stopGame();
    this.startGame();
  }

  perTick() {
    this.generateFood();
    this.player.updateDirection();
    const newHead = this.player.getNewHead();
    if (this.isGameOver(newHead)) {
      this.gameOver();
      return null;
    } else {
      if (this.player.foodEaten(newHead, this.food)) {
        this.food.isEaten = true;
        this.player.eatFood(this.food);
        this.generateFood();
      } else {
        this.player.moveForward(newHead);
      }
    }
    this.map.renderView(this.player, this.food);
  }

  isGameOver(newHead: PlayerPart) {
    let result = false;
    result =
      !this.player.insideMapBorders(newHead) ||
      this.map.isPlayerSpot(newHead.i, newHead.j);
    return result;
  }

  gameOver() {
    this.playerDead = true;
    this.stopGame();
  }

  generateFood() {
    if (!this.food || this.food.isEaten) {
      while (true) {
        const i = Math.round(Math.random() * MAP_WIDTH) % MAP_WIDTH;
        const j = Math.round(Math.random() * MAP_HEIGHT) % MAP_HEIGHT;
        if (this.map.isFreeSpot(i, j)) {
          this.food = { i, j, isEaten: false };
          break;
        }
      }
    }
  }
}
