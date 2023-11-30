import {attribute as _} from 'ts-graphviz';
import Problem from '../Domain/Problem.js';
import State from '../Domain/State.js';
import WeightedTree from '../Structure/WeightedTree/WeightedTree.js';
import WeightedTreeEdge from '../Structure/WeightedTree/WeightedTreeEdge.js';
import WeightedTreeNode from '../Structure/WeightedTree/WeightedTreeNode.js';
import Search from './Search.js';
import TreeEdge from '../Structure/Tree/TreeEdge.js';

export default abstract class InformedSearch extends Search {
	/// Attributes
	protected currentNode: WeightedTreeNode;
	protected openEdges: Array<WeightedTreeEdge>;
	protected closedNodes: Array<WeightedTreeNode>;
	protected sortingFunction: (
		a: WeightedTreeEdge,
		b: WeightedTreeEdge,
	) => number;

	/// Constructor
	constructor(
		sortingFunction: (a: WeightedTreeEdge, b: WeightedTreeEdge) => number,
		tree?: WeightedTree,
	) {
		if (!tree) {
			const state = new State();
			tree = new WeightedTree(state);
		}
		super(tree);
		this.currentNode = tree.getRoot() as WeightedTreeNode;
		this.openEdges = [];
		this.closedNodes = [];
		this.sortingFunction = sortingFunction;
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Informed Lists Search';
	}

	public getOpenEdges(): Array<WeightedTreeEdge> {
		return this.openEdges;
	}

	public getClosedNodes(): Array<WeightedTreeNode> {
		return this.closedNodes;
	}

	public getCurrentNode(): WeightedTreeNode {
		return this.currentNode;
	}

	protected updateCurrentNode(): void {
		this.openEdges.sort(this.sortingFunction);
		const firstTransition = this.openEdges.shift();
		if (firstTransition === undefined) return;
		this.currentNode = firstTransition.getTargetNode() as WeightedTreeNode;
	}

	/// Methods
	public search(maxIterations: number = Infinity): Array<WeightedTreeEdge> {
		if (maxIterations <= 0) return [];
		let solutionPath: WeightedTreeEdge[] | null = null;
		let aux = 0;
		do {
			solutionPath = this.doIteration(this.getCurrentNode());
			aux++;
		} while (
			aux < maxIterations &&
			this.openEdges.length > 0 &&
			solutionPath === null
		);
		return solutionPath ?? [];
	}

	private doIteration(
		currentNode: WeightedTreeNode,
	): Array<WeightedTreeEdge> | null {
		if (currentNode === null) return null;
		if (Problem.isSolution(currentNode.getState())) {
			const solutionPath = WeightedTree.getAscendingPath(
				currentNode,
			) as Array<WeightedTreeEdge>;
			return solutionPath;
		} else {
			this.closedNodes.push(currentNode);
			const validTransitions = this.tree.createValidTransitions(
				currentNode,
				this.sortingFunction as (a: TreeEdge, b: TreeEdge) => number,
			) as Array<WeightedTreeEdge>;
			for (const transition of validTransitions) {
				this.openEdges.push(transition);
			}
			this.updateCurrentNode();
			return null;
		}
	}
}
