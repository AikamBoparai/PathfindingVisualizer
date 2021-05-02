export function aStar(grid, startNode, finishNode, numRows, numCols){
    startNode.heuristic = 0;
    startNode.distance = 0;
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);

    while(unvisitedNodes.length){
        sortNodesByHeuristicDistance(unvisitedNodes);

        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall)continue;
        if(closestNode.heuristic === Infinity || closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if(closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighborsHeuristicDistance(closestNode, grid, finishNode);
    }
}
function calculateHeuristic(finishNode, currentNode){
    return Math.abs(finishNode.col - currentNode.col) + Math.abs(finishNode.row - currentNode.row);
}

function updateUnvisitedNeighborsHeuristicDistance(node, grid, finishNode){
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.heuristic = calculateHeuristic(finishNode, neighbor);
      neighbor.distance = node.distance + 1;
      //make sure to keep track of the previous node so we determine the shortest path
      neighbor.previousNode = node;
    }
}

function sortNodesByHeuristicDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => (nodeA.heuristic - nodeB.heuristic) + (nodeA.distance - nodeB.distance));
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

