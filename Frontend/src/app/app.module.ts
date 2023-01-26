import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';

import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { ApiModule } from './core/services/api.module';
import { BASE_PATH } from './core/services/variables';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    RectangleComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ApiModule,
    ToastrModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    {
      provide: BASE_PATH, useValue: environment.serverUri
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
