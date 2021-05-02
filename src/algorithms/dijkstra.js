export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];

    //Dijkstra's algorithm starts with the source node starting at zero
    startNode.distance = 0;
    //get all nodes and they'll have a distance of infinity
    const unvisitedNodes = getAllNodes(grid);
    
    //So keep looping until we visit all nodes, once we visit all nodes we stop
    var counter = 0;
    while (unvisitedNodes.length) {
      //visit one node at time
      sortNodesByDistance(unvisitedNodes);
      //one Node will get popped off the array
      const closestNode = unvisitedNodes.shift();
      //if the node is a wall we dont care and should just continue
      if (closestNode.isWall) continue;
      //if no other node is reachbale the algorithm has failed and there is no shortest path to the node
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;

      //push the visitedNode onto the list
      visitedNodesInOrder.push(closestNode);

      //if the closest node is the finishNode, we've made it and can end the algorithm
      if (closestNode === finishNode) return visitedNodesInOrder;

      //Update the nodes based on distance, in dijkstra's terms, perform relaxation
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    //find the node we are the smallest distance from and then we will select that one
    // first step in dijkstra's algorithm
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    //the neighbor to first visit will be the shortest path (relaxtion)
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      //make sure to keep track of the previous node so we determine the shortest path
      neighbor.previousNode = node;
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    //If not in the top row, get the node right above us
    if (row > 0) neighbors.push(grid[row - 1][col]);

    //if not in the bottom row get the node right below us
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

    //if we are not in the first col the node to the left
    if (col > 0) neighbors.push(grid[row][col - 1]);

    //if we are not in the lat col get the node to the right
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    //Then only give the neighbors which have not been visited, so we wont be visiting nodes twice
    return neighbors.filter(neighbor => !neighbor.isVisited);
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
  
  // Backtracks from the finishNode to find the shortest path.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      //adds to the array
      nodesInShortestPathOrder.unshift(currentNode);

      //get the previous node
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }