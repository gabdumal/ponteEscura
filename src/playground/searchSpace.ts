import Graph from '../engine/Graph.ts';
import State from '../engine/State.ts';

const searchSpace = new Graph();
let node = searchSpace.addNode(new State());
searchSpace.createValidTransitions(node, 30);

console.log(searchSpace.exportToDot());

const dotString = searchSpace.exportToDot();
await Graph.exportToFile(dotString, 'images/searchSpace-30', 'svg');
