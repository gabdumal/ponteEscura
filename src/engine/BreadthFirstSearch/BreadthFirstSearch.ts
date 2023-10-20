import Problem from '../Problem.ts';
import State from '../State.ts';
import Tree from '../Tree/Tree.ts';
import TreeEdge from '../Tree/TreeEdge.ts';
import TreeNode from '../Tree/TreeNode.ts';

export default class BreadthFirstSearch {
	/// Attributes
	private tree: Tree;
	private openNodes: Array<TreeNode>;
	private closedNodes: Array<TreeNode>;
	private sortingFunction: (a: TreeEdge, b: TreeEdge) => number;

	/// Constructor
	constructor() {
		const state = new State();
		this.tree = new Tree(state);
		this.openNodes = [this.tree.getRoot()];
		this.closedNodes = [];
		this.sortingFunction = (a: TreeEdge, b: TreeEdge) => {
			return (
				b.getTargetNode().getState().getRemainingTime() -
				a.getTargetNode().getState().getRemainingTime()
			);
		};
	}

	/// Getters
	public getTree(): Tree {
		return this.tree;
	}

	public getOpenNodes(): Array<TreeNode> {
		return this.openNodes;
	}

	public getClosedNodes(): Array<TreeNode> {
		return this.closedNodes;
	}

	/// Methods
	private doIteration(): Array<TreeEdge> | null {
		const currentNode = this.openNodes.shift();
		if (currentNode === undefined) return null;
		this.closedNodes.push(currentNode);

		if (Problem.isSolution(currentNode)) {
			const solutionPath = Tree.getAscendingPath(currentNode);
			return solutionPath;
		} else {
			const validTransitions = this.tree.createValidTransitions(currentNode);
			validTransitions.sort(this.sortingFunction);
			for (const transition of validTransitions) {
				const targetNode = transition.getTargetNode() as TreeNode;
				this.openNodes.push(targetNode);
			}
			return null;
		}
	}

	public search(maxIterations: number = Infinity): Array<TreeEdge> {
		let solutionPath = null;
		let aux = 0;
		while (
			aux < maxIterations &&
			this.openNodes.length > 0 &&
			solutionPath === null
		) {
			solutionPath = this.doIteration();
			aux++;
		}
		return solutionPath ?? [];
	}
}
