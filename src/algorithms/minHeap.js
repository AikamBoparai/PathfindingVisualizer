function isHigherPriority(a, b){
    return a.heuristic < b.heuristic;
}

function swap(nodes, index1, index2){
    var tempNode = nodes[index2];
    nodes[index2] = nodes[index1];
    nodes[index1] = tempNode;

}

function getParent(index){
    return Math.floor((index - 1)/2);
}

function heapify_down(nodes,index,size){
    var higher = index;
    var leftChild = (index * 2) + 1;
    var rightChild = (index * 2) + 2;


    if(leftChild < size && isHigherPriority(nodes[leftChild], nodes[higher])){
        higher = leftChild;
    }

    if(rightChild < size && isHigherPriority(nodes[rightChild], nodes[higher])){
        higher = rightChild;
    }

    if(higher !== index){
        swap(nodes, higher, index);
        heapify_down(nodes, higher, size);
    }
}

function heapify_up(nodes, index){
    while(index > 0 && isHigherPriority(nodes[index], nodes[getParent(index)])){
        swap(nodes, index, getParent(index));
        index = getParent(index);
    }
}

export function heap_pop(nodes){
    
    const nodeResult = nodes[0];
    if(nodes.length !== 1){
        nodes[0] = nodes[nodes.length - 1];
        nodes.pop();
        heapify_down(nodes, 0, nodes.length - 1);
    }
    else{
        nodes.shift();
    }
    return nodeResult;
}

export function heap_push(nodes, nodesToPush){
    for(let i = 0; i < nodesToPush.length; i++){
        nodes.push(nodesToPush[i]);
        heapify_up(nodes, nodes.length - 1);
    }
}

function printList(nodes){
    for(let i = 0; i < nodes.length; i++){
        console.log("Row " + nodes[i].row + " Col " + nodes[i].col);
    }
}