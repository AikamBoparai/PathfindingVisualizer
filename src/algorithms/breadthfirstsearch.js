export function breadthfirstsearch(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    const queue = [];

    startNode.isVisited = true;
    queue.push(startNode);

    while(queue.length > 0){
        var node = queue.shift();
        visitedNodesInOrder.push(node);
        if(node.isFinish)break;
        const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

        for(let i = 0; i < unvisitedNeighbors.length; i++){
            unvisitedNeighbors[i].isVisited = true;
            unvisitedNeighbors[i].previousNode = node;
            queue.push(unvisitedNeighbors[i]);
        }
    }

    return visitedNodesInOrder;
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