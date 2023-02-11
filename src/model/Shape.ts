export class Shape {
  x: number;
  y: number;
  blocks: number[][];
  
  constructor(x: number, y: number, blocks: number[][]) {
    this.x = x;
    this.y = y;
    this.blocks = blocks;
  }
}