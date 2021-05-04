import{getUnvisitedNeighbors} from './dijkstra';
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