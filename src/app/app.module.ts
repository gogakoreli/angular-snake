import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MapComponent } from './map/map.component';
import { PlayerComponent } from './player/player.component';
import { InputService } from './services/input.service';

@NgModule({
  declarations: [AppComponent, MapComponent, GameComponent, PlayerComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    InputService,
    {
      provide: APP_INITIALIZER,
      useFactory: (input: InputService) => () => {
        return input.init();
      },
      deps: [InputService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
