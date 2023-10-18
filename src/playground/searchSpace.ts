import Graph from '../engine/Graph.ts';
import GraphNode from '../engine/GraphNode.ts';
import State from '../engine/State.ts';

const searchSpace = new Graph();
let node = searchSpace.addNode(new State());
searchSpace.createValidTransitions(node);

console.log(searchSpace);
console.log(searchSpace.exportToDot());
