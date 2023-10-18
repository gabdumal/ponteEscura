import Graph from '../engine/Graph.ts';
import State from '../engine/State.ts';

const searchSpace = new Graph();
let node = searchSpace.addNode(new State());

let i = 0;
while (i < 10) {
	const validRules = node.getState().getValidRules();
	for (const rule of validRules) {
		const newState = rule.transpose(node.getState());
		const newNode = searchSpace.addNode(newState);
		node.addEdge(newNode, rule);
	}
	node = node.getTargetEdges()[0].getTarget();
	i++;
}

console.log(searchSpace);
console.log(searchSpace.exportToDot());
