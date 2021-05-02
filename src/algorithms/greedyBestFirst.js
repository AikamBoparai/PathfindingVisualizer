import {heap_pop, heap_push} from './minHeap';

export function  greedyBestFirst(grid, startNode, finishNode, numRows, numCols){
    startNode.heuristic = 0;
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);

    while(unvisitedNodes.length){
        sortNodesByHeuristic(unvisitedNodes);

        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall)continue;
        if(closestNode.heuristic === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if(closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid, finishNode);
    }
}
export function greedyBestFirstMinHeap(grid, startNode, finishNode, numRows, numCols){
    const visitedNodesInOrder = [];

    //When we don't have any more nodes to visit we are done, treat this structure as a min heap
    var nodesToVisit = [];
    var duplicateHeuristicNodes = [];
    //First we need to calculate the heuristic of every node
    for(let i = 0; i < numRows; i++){
        for(let j = 0; j < numCols; j++){
            //Walls wont have heuristics, both finish and start will have heurisitcs of 0
            if(grid[i][j].isWall){
                grid[i][j].heuristic = -1;
            }
            else if(grid[i][j].isFinish){
                grid[i][j].heuristic = 0;
            }
            else{
                grid[i][j].heuristic = calculateHeuristic(finishNode, grid[i][j]);
            }
        }
    }

    //Always visit 
    nodesToVisit.push(startNode);
    var counter = 0;
    //If we have two nodes we need to back track
    while(nodesToVisit.length > 0 || duplicateHeuristicNodes.length > 0){
        //Pop from the heap
        var headNode;
        if(duplicateHeuristicNodes.length > 0 && duplicateHeuristicNodes[0].heuristic < nodesToVisit[0].heuristic){
            headNode = heap_pop(duplicateHeuristicNodes);
        }
        else{
            headNode = heap_pop(nodesToVisit);
        }

        if(headNode.isWall)continue;
        if(headNode.isFinish)break;
        //get the unvisited neighbors
        const unvisitedNeighbors = getUnvisitedNeighbors(headNode, grid);
        //push the headnode into our visited list and change its state accordingly
        visitedNodesInOrder.push(headNode);
        grid[headNode.row][headNode.col].isVisited = true;
        if(unvisitedNeighbors.length > 1 && unvisitedNeighbors[0].heuristic == unvisitedNeighbors[1].heuristic && nodesToVisit[0].heuristic >= unvisitedNeighbors[0].heuristic){
            heap_push(duplicateHeuristicNodes,unvisitedNeighbors.shift());
        }
        heap_push(nodesToVisit,unvisitedNeighbors);
        
        counter++;
        
    }

    visitedNodesInOrder.push(finishNode);
    return visitedNodesInOrder;
}

function calculateHeuristic(finishNode, currentNode){
    return Math.abs(finishNode.col - currentNode.col) + Math.abs(finishNode.row - currentNode.row);
}

function updateUnvisitedNeighbors(node, grid, finishNode){
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.heuristic = calculateHeuristic(finishNode, neighbor);
      //make sure to keep track of the previous node so we determine the shortest path
      neighbor.previousNode = node;
    }
}

function sortNodesByHeuristic(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);

}

function printList(nodes){
    console.log("Printing one list");
    for(let i = 0; i < nodes.length; i++){
        console.log("Row " + nodes[i].row + " Col " + nodes[i].col + " Heuristic " + nodes[i].heuristic);
    }
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    //If not in the top row, get the node right above us
    if (row > 0) neighbors.push(grid[row - 1][col]);

    //if not in the bottom row get the node right below us
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

    //if we are not in the first col the node to the left
    if (col > 0) neighbors.push(grid[row][col - 1]);

    //if we are not in the lat col get the node to the right

    //Then only give the neighbors which have not been visited, so we wont be visiting nodes twice
    return neighbors.filter(neighbor => (!neighbor.isVisited));
}

