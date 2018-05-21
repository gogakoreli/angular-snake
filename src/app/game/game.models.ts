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
