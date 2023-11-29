import ListsSearch from './ListsSearch.js';
import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';

export default class DepthFirstSearch extends ListsSearch {
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
