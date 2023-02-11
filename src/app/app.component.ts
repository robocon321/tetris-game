import { Shape } from './../model/Shape';
import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { randomShape } from 'src/utils/blockRandom';

const SIZE_BLOCK = 50;
const COL = 10;
const ROW = 16;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef;
  matrix: number[][] = [];
  currentShape: Shape = randomShape();
  score = 0;
  speed = 500;
  notify: string = 'Level 1';
  level: number = 1;
  isPlay = true;

  constructor() {
    this.matrix = this.initMatrix(ROW, COL);
  }

  ngOnInit(): void {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      const interval = setInterval(() => {
        this.drawMatrix(context);
        this.drawCurrentShape(context);
        if (!this.isAbleMoveDown()) {
          this.fillCurrentShapeToMatrix();
          this.collapse();
          if(this.isGameOver()) {
            this.isPlay = false;
            this.notify = 'Game over';
          }
          this.currentShape = randomShape();
        } else {
          this.moveDown();
        }
        if(!this.isPlay) clearInterval(interval);
        }, this.speed);
    }
  }

  fillCurrentShapeToMatrix() {
    for (var i = this.currentShape.y; i < this.currentShape.y + this.currentShape.blocks.length; i++) {
      for (var j = this.currentShape.x; j < this.currentShape.x + this.currentShape.blocks[0].length; j++) {
        if (this.currentShape.blocks[i - this.currentShape.y][j - this.currentShape.x] == 1) this.matrix[i][j] = 1;
      }
    }
  }

  drawMatrix(context: CanvasRenderingContext2D) {
    for (var i = 0; i < this.matrix.length; i++) {
      for (var j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j]) {
          this.drawBlock(j, i, context);
        } else {
          this.drawEmpty(j, i, context);
        }
      }
    }
  }

  drawCurrentShape(context: CanvasRenderingContext2D) {
    for (var i = 0; i < this.currentShape.blocks.length; i++) {
      for (var j = 0; j < this.currentShape.blocks[0].length; j++) {
        if (this.currentShape.blocks[i][j]) {
          this.drawBlock(this.currentShape.x + j, this.currentShape.y + i, context);
        }
      }
    }
  }

  drawBlock(x: number, y: number, context: CanvasRenderingContext2D) {
    const img = new Image();
    img.src = 'assets/block.png';
    context.drawImage(img, x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
  }

  drawEmpty(x: number, y: number, context: CanvasRenderingContext2D) {
    context.fillStyle = 'black';
    context.fillRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
    context.strokeRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
  }

  rotateCurrentShape() {
    var blocks = this.currentShape.blocks;
    var newWidth = blocks.length;
    var newHeight = blocks[0].length;
    var result = this.initMatrix(newHeight, newWidth);
    
    if(this.currentShape.x + newWidth > COL) return;
    if(this.currentShape.y + newHeight > ROW) return;    

    for(var i = 0; i < blocks.length; i ++) {
      for(var j = 0; j < blocks[0].length; j ++) {
        result[j][blocks.length - i - 1] = blocks[i][j];
      }
    }

    for(var i = 0; i < result.length; i ++) {
      for(var j = 0; j < result[0].length; j ++) {
        if(result[i][j] && this.matrix[this.currentShape.y + i][this.currentShape.x + j]) return;
      }
    }

    this.currentShape.blocks = result;
  }

  moveDown() {
    this.currentShape.y = this.currentShape.y + 1;
  }

  moveLeft() {
    this.currentShape.x = this.currentShape.x - 1;
  }

  moveRight() {
    this.currentShape.x = this.currentShape.x + 1;
  }

  isRightBoundCollision(): boolean {
    return this.currentShape.x + this.currentShape.blocks[0].length == COL;
  }

  isRightBlockCollision(): boolean {
    for (var i = this.currentShape.y; i < this.currentShape.y + this.currentShape.blocks.length; i++) {
      for (var j = this.currentShape.x; j < this.currentShape.x + this.currentShape.blocks[0].length; j++) {
        if (this.currentShape.blocks[i - this.currentShape.y][j - this.currentShape.x] && this.matrix[i][j + 1]) return true;
      }
    }
    return false;
  }

  isAbleMoveRight(): boolean {
    return !this.isRightBoundCollision() && !this.isRightBlockCollision();
  }

  isLeftBoundCollision() {
    return this.currentShape.x == 0;
  }

  isLeftBlockCollision() {
    for (var i = this.currentShape.y; i < this.currentShape.y + this.currentShape.blocks.length; i++) {
      for (var j = this.currentShape.x; j < this.currentShape.x + this.currentShape.blocks[0].length; j++) {
        if (this.currentShape.blocks[i - this.currentShape.y][j - this.currentShape.x] && this.matrix[i][j - 1]) return true;
      }
    }
    return false;
  }

  isAbleMoveLeft() {
    return !this.isLeftBoundCollision() && !this.isLeftBlockCollision()
  }

  isBottomBoundCollision(): boolean {
    return this.currentShape.y + this.currentShape.blocks.length == ROW;
  }

  isBottomBlockCollision(): boolean {
    for (var i = this.currentShape.y; i < this.currentShape.y + this.currentShape.blocks.length; i++) {
      for (var j = this.currentShape.x; j < this.currentShape.x + this.currentShape.blocks[0].length; j++) {
        if (this.currentShape.blocks[i - this.currentShape.y][j - this.currentShape.x] == 1 && this.matrix[i + 1][j]) return true;
      }
    }
    return false;
  }

  isAbleMoveDown(): boolean {
    return !this.isBottomBoundCollision() && !this.isBottomBlockCollision();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.rotateCurrentShape();
      return;
    }
    if (event.key === 'ArrowDown') {
      if (!this.isAbleMoveDown()) {
        this.fillCurrentShapeToMatrix();
        this.collapse();
        if(this.isGameOver()) {
          this.isPlay = false;
          this.notify = 'Game over';
        }
        this.currentShape = randomShape();
      } else {
        this.moveDown();
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      if (this.isAbleMoveLeft()) this.moveLeft();
      return;
    }
    if (event.key === 'ArrowRight') {
      if (this.isAbleMoveRight()) this.moveRight();
      return;
    }
  }

  collapse(): void {
    var newMatrix = this.initMatrix(ROW, COL);
    var index = newMatrix.length - 1;
    for(var i = this.matrix.length - 1; i >= 0 ; i --) {
      if(this.matrix[i].find(item => item == 0) == 0) {
        newMatrix[index] = this.matrix[i];
        index --;
      } else {
        this.score += 100;
        if(this.score % 500 == 0) {
          this.speed -= 50;
          this.level ++;
          this.notify = 'Level ' + this.level;
        }
      }
    }
    this.matrix = newMatrix;
  }

  initMatrix(row: number, col: number): number[][] {
    var matrix: number[][] = [];
    for (let i = 0; i < row; i++) {
      matrix[i] = [];
      for (let j = 0; j < col; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  }

  isGameOver(): boolean {
    return this.matrix[0].find(item => item == 1) == 1;
  }
}
