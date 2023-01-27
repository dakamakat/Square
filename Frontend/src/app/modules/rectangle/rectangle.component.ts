import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, fromEvent, of, Subject } from 'rxjs';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { TogglePoint } from './models/enums/toggle-point.enum';
import { RectangleCoordinates } from './models/rectangle-coordinates.model';
import { Rectangle } from './rectangle.model';
import { RectangleService } from './services/rectangle.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.css'],
})
export class RectangleComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly invisibleBorder: number = 10;

  public rectangle: Rectangle = new Rectangle();
  public rectangleCopy: RectangleCoordinates;

  public yResize: number;
  public xResize: number;

  public perimeter: number;

  public canvasHeigth: number = window.innerHeight ?? 600;
  public canvasWidth: number = window.innerWidth ?? 600;

  public isEdited: boolean;
  public isRectangleCreated: boolean = false;

  constructor(
    private rectangleHttpService: RectangleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.rectangleHttpService.getRectangle().pipe(catchError(() => {
      this.toastr.error('Can not load the data.')
      return EMPTY;
    }
    )).subscribe((rectangle: Rectangle) => {
      this.rectangle.x1 = rectangle.x1 ?? 0;
      this.rectangle.x2 = rectangle.x2 ?? 0;
      this.rectangle.y1 = rectangle.y1 ?? 0;
      this.rectangle.y2 = rectangle.y2 ?? 0;

      this.isRectangleCreated = true;
      this.perimeter = this.rectangle.getPerimetr();
      this.toastr.success('Data loaded.');
    });
  }

  ngAfterViewInit(): void {
    this.RegisterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private mouseDownEvent(event: any) {
    this.isEdited = true;
    this.rectangleCopy = { ...this.rectangle }
    this.xResize = event.clientX;
    this.yResize = event.clientY;
  }

  private mouseUpEvent(event: any) {
    this.isEdited = false;

    if (!Rectangle.isRectanglesEqual(this.rectangle, this.rectangleCopy))
      this.SaveRectangle();
    this.perimeter = this.rectangle.getPerimetr();
  }

  private mouseMoveEvent(event: any) {
    if (this.isEdited)
      if (!this.isRectangleCreated) {
        if (
          event.clientX + this.invisibleBorder < this.canvasHeigth &&
          event.clientX - this.invisibleBorder > 0
        )
          this.rectangle.x2 = event.clientX;
        if (
          event.clientY + this.invisibleBorder < this.canvasWidth &&
          event.clientY - this.invisibleBorder > 0
        )
          this.rectangle.y2 = event.clientY;
      } else {
        const speed = 1;
        const xChange = (this.xResize - event.clientX) / speed;
        const yChange = (this.yResize - event.clientY) / speed;

        let touchedResizePoint = TogglePoint.NoPoint;
        let width = this.rectangle.getWidth() / 2;
        let heigth = this.rectangle.getHeigth() / 2;

        if (
          Math.abs(this.rectangle.x1 - event.clientX) < width &&
          Math.abs(this.rectangle.y1 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.TopLeft;
        } else if (
          Math.abs(this.rectangle.x2 - event.clientX) < width &&
          Math.abs(this.rectangle.y1 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.TopRight;
        } else if (
          Math.abs(this.rectangle.x1 - event.clientX) < width &&
          Math.abs(this.rectangle.y2 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.BottomLeft;
        } else if (
          Math.abs(this.rectangle.x2 - event.clientX) < width &&
          Math.abs(this.rectangle.y2 - event.clientY) < heigth
        ) {
          touchedResizePoint = TogglePoint.BottomRight;
        }

        //resize
        console.log(touchedResizePoint);

        switch (touchedResizePoint) {
          case TogglePoint.TopLeft:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x1 = this.rectangle.x1 - xChange;
            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y1 = this.rectangle.y1 - yChange;
            break;
          case TogglePoint.TopRight:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x2 = this.rectangle.x2 - xChange;
            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y1 = this.rectangle.y1 - yChange;
            break;
          case TogglePoint.BottomLeft:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x1 = this.rectangle.x1 - xChange;

            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y2 = this.rectangle.y2 - yChange;
            break;
          case TogglePoint.BottomRight:
            if (this.CheckForChange(xChange, this.canvasHeigth))
              this.rectangle.x2 = this.rectangle.x2 - xChange;

            if (this.CheckForChange(yChange, this.canvasWidth))
              this.rectangle.y2 = this.rectangle.y2 - yChange;
            break;
          default:
            break;
        }

        this.xResize = event.clientX;
        this.yResize = event.clientY;
      }
  }

  private CheckForChange(change: number, canvas: number): boolean {
    let x = this.rectangle.y2 + change + this.invisibleBorder < canvas;
    let y = this.rectangle.y2 - change - this.invisibleBorder > 0
    return x && y;
  }

  private RegisterEvents() {
    fromEvent(document, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseDownEvent(res));
    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseUpEvent(res));
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.mouseMoveEvent(res));
  }

  private SaveRectangle() {
    this.rectangleHttpService.saveRectangle(this.rectangle).pipe(catchError(() => {
      this.toastr.error('Error , can not save data.');
      return EMPTY;
    }),debounceTime(50000)).subscribe(() => {
      this.toastr.success('Data saved.');
    })
  }
}

