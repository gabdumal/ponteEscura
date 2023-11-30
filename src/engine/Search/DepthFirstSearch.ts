import UninformedSearch from './UninformedSearch.ts';
import TreeEdge from '../Structure/Tree/TreeEdge.js';
import TreeNode from '../Structure/Tree/TreeNode.js';

export default class DepthFirstSearch extends UninformedSearch {
	/// Constructor
	constructor(sortingFunction: (a: TreeEdge, b: TreeEdge) => number) {
		super(sortingFunction);
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Depth First Search';
	}

	/// Methods
	public getCurrentNode(remove: boolean): TreeNode | null {
		if (!remove) return this.currentNode;
		const currentNode = this.getOpenNodes().pop();
		if (currentNode === undefined) return null;
		this.currentNode = currentNode;
		return currentNode;
	}
}
