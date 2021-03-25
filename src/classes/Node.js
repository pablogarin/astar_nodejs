class Node {
  constructor(col, row, size, color, drawFunction) {
    this.col = col;
    this.row = row;
    this.x = col*size;
    this.y = row*size;
    this.size = size;
    this.originalColor = color;
    this.color = color;
    this.drawFunction = drawFunction;
    this.isStart = false;
    this.isEnd = false;
    this.isBlocked = false;
  }

  reset() {
    this.isBlocked = false;
    this.isStart = false;
    this.isEnd = false;
    this.color = this.originalColor;
    this.draw();
  }

  draw() {
    this.drawFunction(this.color, [this.x, this.y, this.size, this.size])
  }

  toString() {
    return `${this.row}-${this.col}`;
  }
}

export default Node;
