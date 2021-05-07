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
var FINISH_NODE_COL = 45;

const NUM_ROWS = 22;
const NUM_COLS = 55;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      inAnimation: false,
      movingStart: false,
      movingEnd: false,
      finishedAnimation: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    //Detects when we press the mouse inside a node
    //const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    var clickStart = false;
    var clickFinish = false;
    if(row === START_NODE_ROW && col === START_NODE_COL){
        clickStart = true;
    }
    else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
      clickFinish = true;
    }
    else{
      const node = document.getElementById("node-" + row + "-" + col);
      node.className = node.className === "node " ? "node node-wall" : 
      node.className === "node node-start" || node.className === "node node-finish" ? node.className : "node ";
    }
    this.setState({mouseIsPressed: true, movingStart: clickStart, movingEnd: clickFinish});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if(this.state.movingStart && !(row === FINISH_NODE_ROW && col === FINISH_NODE_COL)){
        const currentStart = document.getElementById("node-"+START_NODE_ROW +"-"+ START_NODE_COL);
        currentStart.className = "node ";
        START_NODE_ROW = row;
        START_NODE_COL = col;
        const newStart = document.getElementById("node-"+START_NODE_ROW +"-"+ START_NODE_COL);
        newStart.className = "node node-start";
    }
    else if(this.state.movingEnd && !(row === START_NODE_ROW && col === START_NODE_COL)){
        const currentStart = document.getElementById("node-"+FINISH_NODE_ROW +"-"+ FINISH_NODE_COL);
        currentStart.className = "node ";
        FINISH_NODE_ROW = row;
        FINISH_NODE_COL = col;
        const newStart = document.getElementById("node-"+FINISH_NODE_ROW +"-"+ FINISH_NODE_COL);
        newStart.className = "node node-finish";
    }
    else{
      const node = document.getElementById("node-" + row + "-" + col);
      node.className = node.className === "node " ? "node node-wall" : 
      node.className === "node node-start" || node.className === "node node-finish" ? node.className : "node ";
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, movingStart: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, select) {
    //go through the visited nodes in order
    var timeout;
    switch(select){
      case "Dijkstra":
        timeout = 5;
        break;
      case "GBFS":
        timeout = 15;
        break;
      case "A*":
        timeout = 10;
        break;
      case "DFS":
        timeout = 5;
        break;
      case "BFS":
        timeout = 5;
        break;
      default:
        timeout = 10;
    }
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //once we reach the end of visiting nodes, then we can start the shortest path
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, timeout * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, timeout * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, time) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        if(i === nodesInShortestPathOrder.length - 1){
          this.setState({inAnimation: false});
        }
      }, 40 * i);
    }
  }

  getUpdatedGrid(){
      const updatedGrid = [];

      for(let row = 0; row < NUM_ROWS; row++){
        const currentRow = [];
        for(let col = 0; col < NUM_COLS ; col++){
          const node = createNode(col, row);
          const className = document.getElementById("node-" + row + "-" + col).className;

          if(className === "node node-visited"){
            node.isVisited = true;
          }

          else if(className === "node node-wall"){
            node.isWall = true;
          }

          currentRow.push(node);
        }

        updatedGrid.push(currentRow);
      }

      return updatedGrid;
  }

  visualize(select) {
    if(this.state.inAnimation)return;
    if(this.state.finishedAnimation)this.resetPath();
    const currentGrid = this.getUpdatedGrid();
    this.setState({grid:currentGrid,inAnimation: true});
    const startNode = currentGrid[START_NODE_ROW][START_NODE_COL];
    const finishNode = currentGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = select === "Dijkstra" ? dijkstra(currentGrid, startNode, finishNode) 
    :select === "GBFS" ? greedyBestFirst(currentGrid, startNode, finishNode)
    :select === "A*" ? aStar(currentGrid, startNode, finishNode)
    :select === "DFS" ?  depthfirstsearch(currentGrid, startNode, finishNode)
    :breadthfirstsearch(currentGrid, startNode, finishNode);
    ;
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, select);
    this.setState({finishedAnimation: true});
  }

  resetPath(){
    if(this.state.inAnimation)return;
    const newGrid = getInitialGrid();
    //keep walls
    for(let row = 0; row < NUM_ROWS; row++){
      for(let col = 0; col < NUM_COLS; col ++){
        if(this.state.grid[row][col].isWall){
          newGrid[row][col].isWall = true;
        }
      }
    }
    this.removePathElements();
    this.setStartFinishNodes();
    this.setState({grid: newGrid, mouseIsPressed: false, finishedAnimation: false});    
  }

  resetGrid(){
    if(this.state.inAnimation)return;
    this.removeWalls();
    this.resetPath();
    this.setStartFinishNodes();

    var initial = getInitialGrid();
    this.setState({grid: initial, mouseIsPressed: false, finishedAnimation:false});
  }

  removeWalls(){
    if(this.state.inAnimation)return;
      const newGrid = getInitialGrid();
      for(let row = 0; row < NUM_ROWS; row++){
        for(let col = 0; col < NUM_COLS; col ++){
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
    if(this.state.inAnimation)return;
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
        <header className="bd-header bg-dark py-3 d-flex align-items-stretch border-bottom border-dark">
          <div className="container-fluid d-flex align-items-center">
            <h1 className="d-flex align-items-center fs-4 text-white mb-0">
              Pathfinding Visualizer
            </h1>
          </div>
      </header>
        <div id="container-guide">
          <ul>
            <li>Start Node  <div className="dStart display"></div></li>
            <li>Finish Node <div className="dFinish display"></div></li>
            <li>Empty Node <div className="dEmpty display"></div></li>
            <li>Wall Node  <div className="dWall display"></div></li>
            <li>Visited Node  <div className="dVisit display"></div></li>
            <li>Shortest Path Node  <div className="dShort display"></div></li>
          </ul>
        </div>
        <div className="grid">
        <p>Click to add walls!</p>
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
        <button className="reset ghost" onClick={() => this.resetGrid()}>Reset Grid</button>
        <button className="path ghost" onClick={() => this.resetPath()}>Clear Path</button>
        <button className="walls ghost" onClick={() => this.removeWalls()}>Clear Walls</button>
        <button className="dijkstra animated" onClick={() => this.visualize("Dijkstra")}>
          Visualize Dijkstra's Algorithm
        </button>
        <button className="greedy animated" onClick={() => this.visualize("GBFS")}>
          Visualize Greedy Best First Search
        </button>
        <button className="aStar animated" onClick={() => this.visualize("A*")}>
          Visualize A*
        </button>
        <button className="dfs animated" onClick={() => this.visualize("DFS")}>
          Visualize DFS
        </button>
        <button className="bfs animated" onClick={() => this.visualize("BFS")}>
          Visualize BFS
        </button>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
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