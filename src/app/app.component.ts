import { Component } from '@angular/core';
import { InputKey, InputService } from './services/input.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public input: InputService) {}

  displayInput(inputValue: number) {
    return InputKey[inputValue];
  }
}
