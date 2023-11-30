import Graph from '../engine/Structure/Graph/Graph.js';
import State from '../engine/State.js';

const searchSpace = new Graph();
let node = searchSpace.addNode(new State());
searchSpace.createAllValidTransitions(node);

const dotString = searchSpace.toDot({});
await Graph.exportToFile(dotString, 'images/searchSpace', 'svg');
