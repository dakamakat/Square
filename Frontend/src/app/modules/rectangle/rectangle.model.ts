import { RectangleCoordinates } from "./models/rectangle-coordinates.model";

export class Rectangle implements RectangleCoordinates {
  public x1: number;
  public x2: number;
  public y1: number;
  public y2: number;


  public get Height() {
    return Math.abs(this.y1 - this.y2);
  }

  public get Width() {
    return Math.abs(this.x1 - this.x2);
  }

  public get Perimetr() {
    return 2 * (this.Height + this.Width);
  }

  public get X() {
    return Math.min(this.x1, this.x2);
  }

  public get Y() {
    return Math.min(this.y1, this.y2);
  }

  public static isRectanglesEqual(rect1: Rectangle, rect2: RectangleCoordinates): boolean {
    return rect1.x1 == rect2.x1 &&
      rect1.x2 == rect2.x2 &&
      rect1.y1 == rect2.y1 &&
      rect1.y2 == rect2.y2
  }
}
