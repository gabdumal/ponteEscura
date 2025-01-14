import State from '../engine/State.js';
import Tree from '../engine/Structure/Tree/Tree.js';

const searchSpace = new Tree(new State());
const root = searchSpace.getRoot();
searchSpace.createAllValidTransitions(root);

const dotString = searchSpace.toDot({});
await Tree.exportToFile(dotString, 'images/searchSpace', 'svg');
