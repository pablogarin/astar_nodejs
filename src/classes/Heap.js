class Node {
  constructor(priority, value) {
    this.priority = priority;
    this.value = value;
  }
}

class Heap {
  constructor(config={}) {
    this.heap = [];
    this.size = 0;
    const { isMinHeap = true, customComparator = null } = config;
    this.isMinHeap = isMinHeap;
    this.customComparator = customComparator;
  }

  swap(indexA, indexB) {
    const tmp = this.heap[indexB];
    this.heap[indexB] = this.heap[indexA];
    this.heap[indexA] = tmp;
  }

  getParentIndex(index) {
    if (index === 0) {
      return 0;
    }
    return Math.floor((index-1)/2)
  }

  getChildIndexes(index) {
    if (index === this.size) return [null, null];
    const leftChild = index*2+1;
    const rightChild = index*2+2;
    if (leftChild === this.size) return [null, null];
    if (rightChild === this.size) return [leftChild, null];
    return [leftChild, rightChild];
  }

  bubbleUp(index) {
    const parentIndex = this.getParentIndex(index);
    if (parentIndex === index) return
    const parentElement = this.heap[parentIndex];
    const currElement = this.heap[index];
    if (this.compare(parentElement, currElement)) {
      this.swap(parentIndex, index)
      this.bubbleUp(parentIndex);
    }
  }

  bubbleDown(index) {
    const [leftIndex, rightIndex] = this.getChildIndexes(index);
    let smallestIndex = null;
    if (leftIndex && rightIndex) {
      const leftNode = this.heap[leftIndex];
      const rightNode = this.heap[rightIndex];
      if (rightNode && leftNode && this.compare(rightNode, leftNode)) {
        smallestIndex = leftIndex;
      } else {
        smallestIndex = rightIndex;
      }
    } else if (leftIndex) {
      smallestIndex = leftIndex;
    }
    if (!smallestIndex) return;
    const currElement = this.heap[index];
    const newElement = this.heap[smallestIndex]
    if (currElement && newElement && this.compare(currElement, newElement)) {
      this.swap(index, smallestIndex);
      this.bubbleDown(smallestIndex);
    }
  }

  put(priority, value) {
    const node = new Node(priority, value)
    this.heap.push(node);
    this.bubbleUp(this.size);
    this.size += 1;
  }

  get() {
    if (this.size === 0) {
      return null;
    }
    this.swap(0, this.size-1);
    const currElement = this.heap.pop();
    this.size -= 1;
    this.bubbleDown(0);
    return currElement.value;
  }

  empty() {
    return this.size === 0;
  }

  compare(valueA, valueB) {
    let compareA = valueA.priority;
    let compareB = valueB.priority;
    if (valueA.priority instanceof Array && valueB.priority instanceof Array) {
      if (valueA.priority.length !== valueB.priority.length) {
        throw new Error('Invalid lengths')
      }
      for (let i = 0; i < valueA.priority.length; i++) {
        if (valueA.priority[i] !== valueB.priority[i]) {
          compareA = valueA.priority[i];
          compareB = valueB.priority[i];
          break;
        }
      }
    }
    if (this.customComparator) {
      return this.customComparator(compareA, compareB);
    }
    if (this.isMinHeap) {
      return compareA > compareB;
    } else {
      return compareA <= compareB;
    }
  }
}

export default Heap;
