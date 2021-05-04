import{getUnvisitedNeighbors} from './dijkstra';
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
   for(let i = 0; i < neighbors.length; i++){
       if(visitedNodesInOrder[visitedNodesInOrder.length - 1] !== finishNode){
           neighbors[i].previousNode = node;
       }
       dfsHelper(visitedNodesInOrder, neighbors[i], grid, finishNode);
   }
}