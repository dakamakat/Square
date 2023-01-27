import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})

export class CanvasComponent {
  @Input()
  public heigth: number = 400;
  @Input()
  public width: number = 400;
}
