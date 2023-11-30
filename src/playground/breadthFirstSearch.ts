import BreadthFirstSearch from '../engine/Search/BreadthFirstSearch.js';
import Tree from '../engine/Structure/Tree/Tree.js';
import TreeNode from '../engine/Structure/Tree/TreeNode.js';

const breadthFirstSearch = new BreadthFirstSearch();
const solutionPath = breadthFirstSearch.search();
let solutionPathNodes: Array<TreeNode> = [];
if (solutionPath !== null) {
	solutionPathNodes.push(breadthFirstSearch.getTree().getRoot());
	solutionPath.forEach(edge =>
		solutionPathNodes.push(edge.getTargetNode() as TreeNode),
	);
}

console.log(
	'Open nodes:  ',
	breadthFirstSearch.getOpenNodes().map(node => node.getId()),
);
console.log(
	'Closed nodes:',
	breadthFirstSearch.getClosedNodes().map(node => node.getId()),
);

const dotString = breadthFirstSearch.getTree().exportToDot({solutionPathNodes});
await Tree.exportToFile(dotString, 'images/breadthFirstSearch', 'svg');
