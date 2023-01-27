import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RectangleComponent } from './rectangle.component';
import { RectangleService } from './services/rectangle.service';


@NgModule({
  declarations: [
    RectangleComponent,
  ],
  exports: [RectangleComponent],
  imports: [SharedModule, CommonModule],
  providers: [RectangleService]
})
export class RectangleModule { }
