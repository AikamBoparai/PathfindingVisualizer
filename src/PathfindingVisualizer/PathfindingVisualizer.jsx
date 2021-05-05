import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {greedyBestFirst} from '../algorithms/greedyBestFirst';
import {aStar} from '../algorithms/astar';
import {depthfirstsearch} from '../algorithms/depthfirstsearch';
import {breadthfirstsearch} from '../algorithms/breadthfirstsearch';
import './PathfindingVisualizer.css';


var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      inAnimation: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    //Detects when we press the mouse inside a node
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    //go through the visited nodes in order
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //once we reach the end of visiting nodes, then we can start the shortest path
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          this.setState({inAnimation: false});
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, time) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 35 * i);
    }
  }

  visualizeDijkstra() {
    if(this.state.inAnimation)return;
    this.setState({inAnimation: true});
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeGBFS(){
    if(this.state.inAnimation)return;
    this.setState({inAnimation: true});
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = greedyBestFirst(grid, startNode, finishNode, 20, 50);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar(){
    if(this.state.inAnimation)return;
    this.setState({inAnimation: true});
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode, 20, 50);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS(){
      if(this.state.inAnimation)return;
      this.setState({inAnimation: true});
      const {grid} = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = depthfirstsearch(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS(){
    if(this.state.inAnimation)return;
    this.setState({inAnimation: true});
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = breadthfirstsearch(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetPath(){
    if(this.state.inAnimation)return;
    const newGrid = getInitialGrid();
    //keep walls
    for(let row = 0; row < 20; row++){
      for(let col = 0; col < 50; col ++){
        if(this.state.grid[row][col].isWall){
          newGrid[row][col].isWall = true;
        }
      }
    }
    this.removePathElements();
    this.setStartFinishNodes();
    this.setState({grid: newGrid, mouseIsPressed: false});    
  }

  resetGrid(){

    this.removeWalls();
    this.resetPath();
    this.setStartFinishNodes();

    var initial = getInitialGrid();
    this.setState({grid: initial, mouseIsPressed: false});
  }

  removeWalls(){
      const newGrid = getInitialGrid();
      for(let row = 0; row < 20; row++){
        for(let col = 0; col < 50; col ++){
          if(this.state.grid[row][col].isVisited){
            newGrid[row][col].isVisited = true;
          }
          
        }
      }
      this.removeWallElements();
      this.setStartFinishNodes();

      this.setState({grid: newGrid, mouseIsPressed:false});
  }

  removePathElements(){
    var visitedNodes = document.getElementsByClassName('node node-visited');
    while(visitedNodes.length > 0){
      for(let i = 0; i < visitedNodes.length; i++){
        visitedNodes[i].className = "node ";
      }
      visitedNodes = document.getElementsByClassName('node node-visited');
    }

    var shortestNodes = document.getElementsByClassName('node node-shortest-path');
    while(shortestNodes.length > 0){
      for(let i = 0; i < shortestNodes.length; i++){
        shortestNodes[i].className = "node ";
      }
      shortestNodes = document.getElementsByClassName('node node-shortest-path');
    }

  }

  removeWallElements(){
    var wallNodes = document.getElementsByClassName('node node-wall');
    while(wallNodes.length > 0){
      for(let i = 0; i < wallNodes.length; i++){
        wallNodes[i].className = "node ";
      }
      wallNodes = document.getElementsByClassName('node node-wall');
    }
  }

  setStartFinishNodes(){
    const startNode = document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`);
    const finishNode = document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`);

    startNode.className = 'node node-start';
    finishNode.className = 'node node-finish';
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.resetGrid()}>Reset Grid</button>
        <button onClick={() => this.resetPath()}>Clear Path</button>
        <button onClick={() => this.removeWalls()}>Clear Walls</button>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeGBFS()}>
          Visualize Greedy Best First Search
        </button>
        <button onClick={() => this.visualizeAStar()}>
          Visualize A*
        </button>
        <button onClick={() => this.visualizeDFS()}>
          Visualize DFS
        </button>
        <button onClick={() => this.visualizeBFS()}>
          Visualize BFS
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, false));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getGridWithoutPath = (grid) => {
  const newGrid = grid;
  for(let i = 0; i < 20; i++){
    for(let j = 0; j < 50; j++){
      if(newGrid[i][j].isVisited){
        newGrid[i][j].isVisited = false;
      }
    }
  }

  return newGrid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    heuristic: Infinity,
    isVisited: false,
    isWall: false,
    distance: Infinity,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid;
  newGrid[row][col].isWall = !newGrid[row][col].isWall;
  
  return newGrid;
};