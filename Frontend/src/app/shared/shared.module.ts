import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CanvasComponent } from './canvas/canvas.component';
import { BASE_PATH } from './variables';


@NgModule({
  declarations: [
    CanvasComponent,
  ],
  exports:[
    CanvasComponent
  ],
  providers: [
    {
      provide: BASE_PATH, useValue: environment.serverUri
    }
  ],
})
export class SharedModule { }
