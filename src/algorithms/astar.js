import{getUnvisitedNeighbors} from './dijkstra';
import{manhattanDistance} from './greedyBestFirst';
import{getAllNodes} from './dijkstra';
export function aStar(grid, startNode, finishNode, numRows, numCols){
    startNode.heuristic = 0;
    startNode.distance = 0;
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);

    while(unvisitedNodes.length){
        sortNodesByHeuristicDistance(unvisitedNodes);

        const closestNode = unvisitedNodes.shift();
        if(closestNode.heuristic === Infinity || closestNode.distance === Infinity) return visitedNodesInOrder;
        if(closestNode.isWall)continue;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if(closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighborsHeuristicDistance(closestNode, grid, finishNode);
    }
}

function updateUnvisitedNeighborsHeuristicDistance(node, grid, finishNode){
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.heuristic = manhattanDistance(finishNode, neighbor);
      neighbor.distance = node.distance + 1;
      //make sure to keep track of the previous node so we determine the shortest path
      neighbor.previousNode = node;
    }
}

function sortNodesByHeuristicDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => (nodeA.heuristic - nodeB.heuristic) + (nodeA.distance - nodeB.distance));
}

