import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import Problem from '../Problem.js';
import Tree from '../Tree/Tree.js';
import Rule from '../Rule.js';
import State from '../State.js';
import Search from './Search.js';

export default class BacktrackingSearch extends Search {
	/// Attributes
	private sortingFunction: (a: Rule, b: Rule) => number;

	/// Constructor
	constructor(sortingFunction: (a: Rule, b: Rule) => number) {
		const state = new State();
		const tree = new Tree(state);
		super(tree);
		this.sortingFunction = sortingFunction;
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Backtracking Search';
	}

	/// Methods
	public search(maxIterations: number = Infinity): Array<TreeEdge> {
		let solutionPath = null;
		let aux = 0;
		let currentNode = this.tree.getRoot();
		while (aux < maxIterations && solutionPath === null) {
			const {foundNode, isSolution} = this.doBacktracking(currentNode);
			if (isSolution) {
				solutionPath = Tree.getAscendingPath(foundNode);
			} else {
				const sourceEdge = foundNode.getSourceEdge();
				if (sourceEdge === null) {
					return [];
				} else {
					// Return to the source node
					currentNode = sourceEdge.getSourceNode() as TreeNode;
				}
			}
			aux++;
		}
		return solutionPath ?? [];
	}

	private doBacktracking(startNode: TreeNode): {
		foundNode: TreeNode;
		isSolution: boolean;
	} {
		let nextValidTransition = null;
		let currentNode = startNode;
		do {
			nextValidTransition = this.tree.createNextValidTransition(
				currentNode,
				this.sortingFunction,
			);
			if (nextValidTransition !== null) {
				// Move to the next node
				currentNode = nextValidTransition.getTargetNode() as TreeNode;
			}
		} while (nextValidTransition !== null);

		// Check solution or go back
		if (Problem.isSolution(currentNode.getState())) {
			return {
				foundNode: currentNode,
				isSolution: true,
			};
		} else {
			return {
				foundNode: currentNode,
				isSolution: false,
			};
		}
	}
}
