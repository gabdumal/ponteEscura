import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import Problem from '../Problem.js';
import Tree from '../Tree/Tree.js';
import Rule from '../Rule.js';
import State from '../State.js';

export default class BacktrackingSearch {
	/// Attributes
	private static algorithmName = 'Backtracking Search';
	private tree: Tree;
	private sortingFunction: (a: Rule, b: Rule) => number;

	/// Constructor
	constructor(sortingFunction: (a: Rule, b: Rule) => number) {
		const state = new State();
		this.tree = new Tree(state);
		this.sortingFunction = sortingFunction;
	}

	/// Methods
	public getTree(): Tree {
		return this.tree;
	}

	public static getAlgorithmName(): string {
		return this.algorithmName;
	}

	public static getSafeAlgorithmName(): string {
		return this.algorithmName.replace(/ /g, '_');
	}

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
