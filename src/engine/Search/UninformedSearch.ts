import {attribute as _} from 'ts-graphviz';
import Problem from '../Domain/Problem.js';
import Tree from '../Structure/Tree/Tree.js';
import TreeEdge from '../Structure/Tree/TreeEdge.js';
import TreeNode from '../Structure/Tree/TreeNode.js';
import Search from './Search.js';
import State from '../Domain/State.js';

export default abstract class UninformedSearch extends Search {
	/// Attributes
	protected currentNode: TreeNode | null;
	private openNodes: Array<TreeNode>;
	private closedNodes: Array<TreeNode>;
	private sortingFunction: (a: TreeEdge, b: TreeEdge) => number;

	/// Constructor
	constructor(sortingFunction: (a: TreeEdge, b: TreeEdge) => number) {
		const state = new State();
		const tree = new Tree(state);
		super(tree);
		this.currentNode = null;
		this.openNodes = [this.tree.getRoot()];
		this.closedNodes = [];
		this.sortingFunction = sortingFunction;
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Uninformed Search';
	}

	public getOpenNodes(): Array<TreeNode> {
		return this.openNodes;
	}

	public getClosedNodes(): Array<TreeNode> {
		return this.closedNodes;
	}

	public abstract getCurrentNode(remove: boolean): TreeNode | null;

	/// Methods
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

	private doIteration(): Array<TreeEdge> | null {
		const currentNode = this.getCurrentNode(true);
		if (currentNode === null) return null;

		if (Problem.isSolution(currentNode.getState())) {
			const solutionPath = Tree.getAscendingPath(currentNode);
			return solutionPath;
		} else {
			this.closedNodes.push(currentNode);
			const validTransitions = this.tree.createValidTransitions(
				currentNode,
				this.sortingFunction,
			);
			for (const transition of validTransitions) {
				const targetNode = transition.getTargetNode() as TreeNode;
				this.openNodes.push(targetNode);
			}
			return null;
		}
	}
}
