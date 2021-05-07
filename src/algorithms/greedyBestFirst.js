import{getUnvisitedNeighbors, getAllNodes} from './dijkstra';
export function greedyBestFirst(grid, startNode, finishNode){
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

export function manhattanDistance(finishNode, currentNode){
    return Math.abs(finishNode.col - currentNode.col) + Math.abs(finishNode.row - currentNode.row);
}

function updateUnvisitedNeighbors(node, grid, finishNode){
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.heuristic = manhattanDistance(finishNode, neighbor);
      //make sure to keep track of the previous node so we determine the shortest path
      neighbor.previousNode = node;
    }
}

function sortNodesByHeuristic(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);
}
