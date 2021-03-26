import React, { useRef, useEffect, useState } from 'react';
import Node from './classes/Node';
import Heap from './classes/Heap';
import Button from './styled/Button'
import ButtonContainer from './styled/ButtonContainer'
import Label from './styled/Label'
import Title from './styled/Title'

const colors = {
  WHITE: '#fff',
  BLACK: '#000',
  GRAY: '#999',
  BLUE: '#00F',
  RED: '#F00',
  LIGHT_RED: '#F99',
  GREEN: '#0F0',
  LIGHT_GREEN: '#9F9',
  PURPLE: '#F0F',
  LIGHT_PURPLE: '#F9F',
};

const drawGrid = (canvas, width, size) => {
  const context = canvas.getContext('2d');
  const gap = Math.floor(width/size);
  context.beginPath();
  context.lineWidth = '1';
  context.strokeStyle = colors.GRAY;
  for (let i = 0; i < size; i++) {
    context.moveTo(i*gap, 0);
    context.lineTo(i*gap, width);
    context.moveTo(0, i*gap);
    context.lineTo(width, i*gap);
  }
  context.stroke();
}

const initializeGrid = (canvas, width, size) => {
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = width;
  const nodeSize = Math.floor(width / size);
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const node = new Node(j, i, nodeSize, colors.WHITE, (color, rect) => {
        const [x, y, width, height] = rect;
        context.beginPath();
        context.fillStyle = color;
        context.rect(x, y, width, height);
        context.fill();
      });
      row.push(node);
    }
    matrix.push(row);
  }
  drawGrid(canvas, width, size);
  return matrix;
}

const heuristic = (pointA, pointB) => {
  const {col: colA, row: rowA} = { col: pointA.col, row: pointA.row };
  const {col: colB, row: rowB} = { col: pointB.col, row: pointB.row };
  return Math.abs(colB - colA) + Math.abs(rowB - rowA);
}

const getAdjacentNodes = (node, matrix) => {
  const colMask = [0,1,0,-1];
  const rowMask = [1,0,-1,0];
  const size = matrix.length;
  const adjacentNodes = [];
  for (let i = 0; i < 4; i++) {
    const currCol = node.col - colMask[i];
    const currRow = node.row - rowMask[i];
    if ( currCol >= 0 && currCol < size && currRow >=0 && currRow < size ) {
      const newNode = matrix[currRow][currCol];
      adjacentNodes.push(newNode);
    }
  }
  return adjacentNodes;
}

const delay = (milliseconds) => new Promise((resolve) => {
  setTimeout(() => {resolve()}, milliseconds);
})

const aStartPathFinding = async (start, end, matrix) => {
  let count = 0;
  const pq = new Heap();
  pq.put([0, count], start);
  const table = {};
  const visited = new Set();
  matrix.forEach(row => row.forEach(node => table[node] = {g: Infinity, f: Infinity, prev: null}));
  table[start] = {
    g: 0,
    f: heuristic(start, end),
    prev: null,
  }
  visited.add(start)
  while (!pq.empty()) {
    const currNode = pq.get();
    if (currNode.isEnd) {
      return table;
    }
    visited.delete(currNode);
    for(let node of getAdjacentNodes(currNode, matrix)) {
      if (!node.isBlocked) {
        const score = table[currNode].g + 1;
        const tableEntry = table[node];
        if (score < tableEntry.g) {
          tableEntry.g = score;
          tableEntry.f = heuristic(node, end) + score;
          tableEntry.prev = currNode;
          if (!visited.has(node)) {
            count += 1;
            visited.add(node);
            pq.put([tableEntry.f, count], node);
          }
        }
      }
    }
    if (!currNode.isStart && !currNode.isEnd) {
      currNode.color = colors.LIGHT_GREEN;
      currNode.draw();
    }
    if (count % 5 == 0) {
      await delay(0)
    }
  }
  return null; // no result
}

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [startSelecting, setStartSelecting] = useState(null);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pathLength, setPathLength] = useState(null);
  const width = 400;
  const size = 50;

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setCanvas(canvas);
      const matrix = initializeGrid(canvas, width, size);
      setMatrix(matrix);
    }
  }, [canvasRef]);

  const selectNode = (e, override=false) => {
    if (isRunning) return;
    const { pageX, pageY, target } = e;
    const x = pageX - target.offsetLeft;
    const y = pageY - target.offsetTop;
    if (x < 0 || x >= width || y < 0 || y >= width) {
      setStartSelecting(false);
    }
    if (startSelecting || override) {
      const nodeSize = Math.floor(width/size);
      const col = Math.floor(x/nodeSize);
      const row = Math.floor(y/nodeSize);
      if (!matrix || !matrix[row] || !matrix[row][col]) return;
      const node = matrix[row][col];
      if (node) {
        if (node.isBlocked || node.isStart || node.isEnd) {
          return;
        }
        if (!startNode) {
          setStartNode(node);
          node.color = colors.RED;
          node.isStart = true;
        } else if (!endNode) {
          setEndNode(node);
          node.color = colors.BLUE;
          node.isEnd = true;
        } else {
          node.isBlocked = true;
          node.color = colors.BLACK;
        }
        updateGrid();
      }
    }
  }

  const updateGrid = () => {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, width, width);
    context.fillStyle = colors.WHITE;
    context.fill();
    matrix.forEach(row => row.forEach(node => node.draw()));
    drawGrid(canvas, width, size);
  }

  const pathFinder = async () => {
    if (isRunning) return;
    setIsRunning(true)
    if (startNode && endNode) {
      matrix.forEach(row => row.forEach(node => {
        if (!node.isStart && !node.isEnd && !node.isBlocked) {
          node.color = node.originalColor;
        }
      }))
      updateGrid();
      setPathLength(null);
      const result = await aStartPathFinding(startNode, endNode, matrix);
      if (result) {
        let count = 0;
        let node = result[endNode].prev;
        while (!node.isStart) {
          count += 1;
          node.color = colors.LIGHT_PURPLE;
          node = result[node].prev;
        }
        setPathLength(count);
      }
      updateGrid();
    }
    setIsRunning(false);
  }

  const clearNodes = () => {
    matrix.forEach(row => row.forEach(node => node.reset()));
    setStartNode(null);
    setEndNode(null);
    setPathLength(null);
    updateGrid();
  }

  return (
    <div className="App">
      <Title>A* Algorithm</Title>
      <p style={{display: 'block', textAlign: 'center'}}>A* (A Star) is a path finding algorithm.<br/>
        It's an extension of the famous Dijkstra algorithm,<br/>
        but it uses a heuristic function to make an "informed"<br/>
        decision on which way to go.</p>
        <Label color={colors.RED}>
          Start:
          {' '}
          {startNode
            ? `${startNode.col}, ${startNode.row}`
            : 'Click on the grid to select a start point'}
        </Label>
        <Label color={colors.BLUE}>
          End:
          {' '}
          {endNode
            ? `${endNode.col}, ${endNode.row}`
            : 'Click on the grid to select an end point'}
        </Label>
        <Label color={colors.LIGHT_PURPLE}>
          Shortest path length:
          {' '}
          {pathLength
            ? `${pathLength}`
            : 'N/A'}
        </Label>
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={() => setStartSelecting(true)}
          onMouseUp={() => setStartSelecting(false)}
          onMouseMove={selectNode}
          onClick={(e) => { selectNode(e, true) }}
        />
      </div>
      <ButtonContainer>
        <Button
          onClick={pathFinder}
          disabled={!endNode || isRunning}
          bg={colors.LIGHT_GREEN}
        >
          Start!
        </Button>
        <Button
          onClick={clearNodes}
          disabled={!endNode || isRunning}
          bg={colors.LIGHT_RED}
        >
          Clear
        </Button>
      </ButtonContainer>
    </div>
  );
}

export default App;
