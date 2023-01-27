import { RectangleCoordinates } from "./models/rectangle-coordinates.model";

export class Rectangle implements RectangleCoordinates {
  public x1: number;
  public x2: number;
  public y1: number;
  public y2: number;

  public getHeigth(): number {
    return Math.abs(this.y1 - this.y2);
  }

  public getWidth(): number {
    return Math.abs(this.x1 - this.x2);
  }

  public getPerimetr() {
    return 2 * (this.getHeigth() + this.getWidth());
  }

  public getX(): number {
    return Math.min(this.x1, this.x2);
  }

  public getY(): number {
    return Math.min(this.y1, this.y2);
  }

  public static isRectanglesEqual(rect1: Rectangle, rect2: RectangleCoordinates): boolean {
    if (
      rect1.x1 == rect2.x1 &&
      rect1.x2 == rect2.x2 &&
      rect1.y1 == rect2.y1 &&
      rect1.y2 == rect2.y2
    )
      return true;

    return false;
  }
}
