import ListsSearch from './ListsSearch.js';
import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import Problem from '../Problem.ts';
import Tree from '../Tree/Tree.ts';

export default class BacktrackingSearch extends ListsSearch {
	/// Attributes
	protected algorithmName = 'Backtracking Search';

	/// Constructor
	constructor() {
		const sortingFunction = (a: TreeEdge, b: TreeEdge) => {
			// Customize your sorting function if needed
			return 0;
		};
		super(sortingFunction);
	}

	/// Methods
	public getCurrentNode(remove: boolean): TreeNode | null {
		if (!remove) return this.currentNode;
		const currentNode = this.getOpenNodes().pop();
		if (currentNode === undefined) return null;
		this.currentNode = currentNode;
		return currentNode;
	}

	public search(maxIterations: number = Infinity): Array<TreeEdge> {
		let solutionPath = null;
		let aux = 0;
		while (aux < maxIterations && solutionPath === null) {
			solutionPath = this.doBacktracking();
			aux++;
		}
		return solutionPath ?? [];
	}

	private doBacktracking(): Array<TreeEdge> | null {
		const currentNode = this.getCurrentNode(true);
		if (currentNode === null) return null;

		if (Problem.isSolution(currentNode.getState())) {
			const solutionPath = Tree.getAscendingPath(currentNode);
			return solutionPath;
		} else {
			this.closedNodes.push(currentNode);
			const validTransitions = this.tree.createValidTransitions(currentNode);
			for (const transition of validTransitions) {
				const targetNode = transition.getTargetNode() as TreeNode;
				this.openNodes.push(targetNode);
			}
			return null;
		}
	}
}
