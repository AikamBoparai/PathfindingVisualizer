export function depthfirstsearch(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    dfsHelper(visitedNodesInOrder, startNode, grid, finishNode)
    return visitedNodesInOrder;
}

function dfsHelper(visitedNodesInOrder, node, grid, finishNode){
    if(visitedNodesInOrder[visitedNodesInOrder.length - 1] === finishNode)return;

    visitedNodesInOrder.push(node);
    node.isVisited = true;

   const neighbors = getUnvisitedNeighbors(node, grid);
   //checkForFinish(neighbors);
   for(let i = 0; i < neighbors.length; i++){
       if(visitedNodesInOrder[visitedNodesInOrder.length - 1] !== finishNode){
           neighbors[i].previousNode = node;
       }
       dfsHelper(visitedNodesInOrder, neighbors[i], grid, finishNode);
   }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    return neighbors.filter(neighbor => (!neighbor.isVisited) && (!neighbor.isWall));
}

function checkForFinish(neighbors){
    for(let i = 0; i < neighbors.length; i++){
        if(neighbors.isFinish){
            const tempNode = neighbors[0];
            neighbors[0] = neighbors[i];
            neighbors[i] = tempNode;
            break;
        }
    }
}