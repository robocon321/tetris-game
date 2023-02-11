import { Shape } from './../model/Shape';
const shapes = [
  [
    [1, 1, 1, 1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 1],
    [1, 0],
    [1, 0]
  ],
  [
    [1, 1],
    [0, 1],
    [0, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ]
];

export function randomShape(): Shape {
  const index = Math.floor(Math.random() * shapes.length);
  const shape = shapes[index];
  const width = shape[0].length;
  const center = 5 - Math.ceil(width / 2);  
  return new Shape(center, 0, shape);
}