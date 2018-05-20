import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const UP_ARR_KEY_CODE = 38;
const RIGHT_ARR_KEY_CODE = 39;
const DOWN_ARR_KEY_CODE = 40;
const LEFT_ARR_KEY_CODE = 37;

const W_KEY_CODE = 87;
const A_KEY_CODE = 65;
const S_KEY_CODE = 83;
const D_KEY_CODE = 68;

@Injectable()
export class InputService {
  public inputKey$: Subject<InputKey>;

  constructor() {}

  isUpPressed(keyCode: number) {
    return keyCode === W_KEY_CODE || keyCode === UP_ARR_KEY_CODE;
  }

  isRightPressed(keyCode: number) {
    return keyCode === D_KEY_CODE || keyCode === RIGHT_ARR_KEY_CODE;
  }

  isDownPressed(keyCode: number) {
    return keyCode === S_KEY_CODE || keyCode === DOWN_ARR_KEY_CODE;
  }

  isLeftPressed(keyCode: number) {
    return keyCode === A_KEY_CODE || keyCode === LEFT_ARR_KEY_CODE;
  }

  getInputKey(keyCode: number): InputKey {
    let result = InputKey.None;
    if (this.isUpPressed(keyCode)) {
      result = InputKey.Up;
    } else if (this.isRightPressed(keyCode)) {
      result = InputKey.Right;
    } else if (this.isDownPressed(keyCode)) {
      result = InputKey.Down;
    } else if (this.isLeftPressed(keyCode)) {
      result = InputKey.Left;
    }
    return result;
  }

  onKeyDown(event) {
    const keyCode = event.keyCode;
    const inputKey: InputKey = this.getInputKey(keyCode);
    this.inputKey$.next(inputKey);
  }

  init() {
    this.inputKey$ = new Subject<InputKey>();
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }
}

export enum InputKey {
  None = -1,
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}
