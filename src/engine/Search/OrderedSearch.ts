import TreeEdge from '../Tree/TreeEdge.js';
import WeightedTreeEdge from '../WeightedTree/WeightedTreeEdge.js';
import OrderedTreeNode from '../OrderedTree/OrderedTreeNode.js';
import OrderedTree from '../OrderedTree/OrderedTree.js';
import State from '../State.js';
import ListsSearch from './ListsSearch.js';
import TreeNode from '../Tree/TreeNode.js';
import Problem from '../Problem.ts';

export default class OrderedSearch extends ListsSearch {
	/// Attributes

	/// Constructor
	constructor() {
		const sortingFunction = (
			a: WeightedTreeEdge,
			b: WeightedTreeEdge,
		): number => {
			const aTargetNode = a.getTargetNode() as OrderedTreeNode;
			const bTargetNode = b.getTargetNode() as OrderedTreeNode;
			return aTargetNode.getValue() - bTargetNode.getValue();
		};
		const state = new State();
		const tree = new OrderedTree(state);
		super(sortingFunction as (a: TreeEdge, b: TreeEdge) => number, tree);
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Ordered Search';
	}

	/// Methods
	public getCurrentNode(remove: boolean): TreeNode | null {
		if (!remove) return this.currentNode as OrderedTreeNode;
		const currentNode = this.getOpenNodes().shift();
		if (currentNode === undefined) return null;
		this.currentNode = currentNode;
		return currentNode as OrderedTreeNode;
	}

	// private doIteration(): Array<WeightedTreeEdge> | null {
	// 	const currentNode = this.getCurrentNode(true);
	// 	if (currentNode === null) return null;

	// 	if (Problem.isSolution(currentNode.getState())) {
	// 		const solutionPath = OrderedTree.getAscendingPath(currentNode);
	// 		return solutionPath as Array<WeightedTreeEdge>;
	// 	} else {
	// 		this.closedNodes.push(currentNode);
	// 		const validTransitions = this.tree.createValidTransitions(
	// 			currentNode,
	// 			this.sortingFunction,
	// 		);
	// 		for (const transition of validTransitions) {
	// 			const targetNode = transition.getTargetNode() as TreeNode;
	// 			this.openNodes.push(targetNode);
	// 		}
	// 		this.openNodes.sort(this.sortingFunction);
	// 		return null;
	// 	}
	// }
}
