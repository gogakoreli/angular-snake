import { MapComponent } from '../map/map.component';
import { MAP_HEIGHT, MAP_WIDTH } from './constants';
import { Direction, Food, PlayerPart } from './game.models';

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
