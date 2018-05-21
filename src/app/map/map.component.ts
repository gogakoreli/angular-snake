import { MAP_HEIGHT, MAP_WIDTH } from '../game/constants';
import { Food } from '../game/game.models';
import { Player } from '../game/player';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  tileGrid: Tile[][];
  valueGrid: number[][];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.initTileGrid();
    this.initValueGrid();
  }

  initTileGrid() {
    this.tileGrid = [];
    for (let i = 0; i < MAP_WIDTH; i++) {
      this.tileGrid[i] = [];
      for (let j = 0; j < MAP_HEIGHT; j++) {
        this.tileGrid[i][j] = { isFood: false, isPlayer: false };
      }
    }
  }

  initValueGrid() {
    this.valueGrid = [];
    for (let i = 0; i < MAP_WIDTH; i++) {
      this.valueGrid[i] = [];
      for (let j = 0; j < MAP_HEIGHT; j++) {
        this.valueGrid[i][j] = 0;
      }
    }
  }

  isFreeSpot(i: number, j: number) {
    return this.valueGrid[i][j] === 0;
  }

  isPlayerSpot(i: number, j: number) {
    return this.valueGrid[i][j] === 1;
  }

  clearMap() {
    this.initTileGrid();
    this.initValueGrid();
  }

  drawPlayer(player: Player) {
    player.parts.forEach(part => {
      this.tileGrid[part.i][part.j] = { isFood: false, isPlayer: true };
      this.valueGrid[part.i][part.j] = 1;
    });
  }

  drawFood(food: Food) {
    this.tileGrid[food.i][food.j] = { isFood: true, isPlayer: false };
    this.valueGrid[food.i][food.j] = -1;
  }

  renderView(player: Player, food: Food) {
    this.clearMap();
    this.drawPlayer(player);
    this.drawFood(food);
    this.cd.detectChanges();
  }
}

export interface Tile {
  isFood: boolean;
  isPlayer: boolean;
}
