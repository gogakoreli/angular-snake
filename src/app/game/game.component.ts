import { Component, OnInit, ViewChild } from '@angular/core';
import { distinctUntilChanged, retry } from 'rxjs/operators';
import { MAP_HEIGHT, MAP_WIDTH, MapComponent } from '../map/map.component';
import { InputKey, InputService } from '../services/input.service';

// export const TICK_DELAY = 100;

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

  @ViewChild(MapComponent) map: MapComponent;

  updateTickDelay() {
    this.tickDelay = 300 - 250 * this.gameSpeed / 100;
    this.restartGame();
  }

  constructor(private input: InputService) {}

  ngOnInit() {
    this.subscribeToInput();
    setTimeout(() => {
      this.setupPlayer(this.map);
      this.setupGame();
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
    this.player = new Player(map);
    this.map.drawPlayer(this.player);
  }

  setupGame() {
    this.interval = setInterval(() => {
      this.perTick();
    }, this.tickDelay);
  }

  restartGame() {
    clearInterval(this.interval);
    this.setupGame();
  }

  perTick() {
    this.generateFood();
    this.player.updateDirection();
    const newHead = this.player.getNewHead();
    if (this.player.insideMapBorders(newHead)) {
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

export class Player {
  length: number;
  parts: PlayerPart[];
  direction: Direction;
  nextDirection: Direction;
  head: PlayerPart;

  constructor(private map: MapComponent) {
    this.direction = Direction.East;
    this.setupInitialParts();
  }

  private setupInitialParts() {
    this.head = {
      i: 0,
      j: 0,
    };
    this.parts = [this.head];
    this.length = this.parts.length;
  }

  updateDirection() {
    if (this.nextDirection >= 0) {
      this.direction = this.nextDirection;
    }
  }

  updateNextDirection(nextDirection: Direction) {
    if (nextDirection != Direction.None && this.validDirection(nextDirection)) {
      this.nextDirection = nextDirection;
    }
  }

  validDirection(nextDirection: Direction) {
    let result = true;
    switch (this.direction) {
      case Direction.North:
        result = nextDirection !== Direction.South;
        break;
      case Direction.East:
        result = nextDirection !== Direction.West;
        break;
      case Direction.South:
        result = nextDirection !== Direction.North;
        break;
      case Direction.West:
        result = nextDirection !== Direction.East;
        break;
    }
    return result;
  }

  public moveForward(newHead: PlayerPart) {
    const newParts = this.parts.filter((x, i) => i > 0);
    newParts.push(newHead);
    this.parts = newParts;
    this.head = newHead;
  }

  public eatFood(food: Food) {
    const newHead: PlayerPart = { i: food.i, j: food.j };
    this.parts.push(newHead);
    this.length++;
    this.head = newHead;
  }

  public getNewHead() {
    const head = this.parts[this.parts.length - 1];
    let newHead: PlayerPart;
    switch (this.direction) {
      case Direction.North:
        newHead = { i: head.i - 1, j: head.j };
        break;
      case Direction.East:
        newHead = { i: head.i, j: head.j + 1 };
        break;
      case Direction.South:
        newHead = { i: head.i + 1, j: head.j };
        break;
      case Direction.West:
        newHead = { i: head.i, j: head.j - 1 };
        break;
    }
    return newHead;
  }

  public foodEaten(newHead: PlayerPart, food: Food) {
    let result = false;
    if (food.i === newHead.i && food.j === newHead.j) {
      result = true;
    }
    return result;
  }

  public insideMapBorders(head: PlayerPart) {
    let result = false;
    if (
      head &&
      head.i >= 0 &&
      head.i < MAP_WIDTH &&
      head.j >= 0 &&
      head.j < MAP_HEIGHT
    ) {
      result = true;
    }
    return result;
  }
}

export interface PlayerPart {
  i: number;
  j: number;
}

export enum Direction {
  None = -1,
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

export interface Food {
  i: number;
  j: number;
  isEaten: boolean;
}
