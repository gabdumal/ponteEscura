import Graph from '../engine/Graph/Graph.ts';
import State from '../engine/State.ts';

const searchSpace = new Graph();
let node = searchSpace.addNode(new State());
searchSpace.createAllValidTransitions(node);

const dotString = searchSpace.exportToDot({});
await Graph.exportToFile(dotString, 'images/searchSpace', 'svg');
