import {
	attribute as _,
	Graph as GraphvizGraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import Problem from '../Problem.ts';
import State from '../State.ts';
import Tree from '../Tree/Tree.ts';
import TreeEdge from '../Tree/TreeEdge.ts';
import TreeNode from '../Tree/TreeNode.ts';

export default abstract class ListsSearch {
	/// Attributes
	protected abstract algorithmName: string;
	private tree: Tree;
	protected currentNode: TreeNode | null;
	private openNodes: Array<TreeNode>;
	private closedNodes: Array<TreeNode>;
	private sortingFunction: (a: TreeEdge, b: TreeEdge) => number;

	/// Constructor
	constructor(sortingFunction: (a: TreeEdge, b: TreeEdge) => number) {
		const state = new State();
		this.tree = new Tree(state);
		this.currentNode = null;
		this.openNodes = [this.tree.getRoot()];
		this.closedNodes = [];
		this.sortingFunction = sortingFunction;
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

	public abstract getCurrentNode(remove: boolean): TreeNode | null;

	public getAlgorithmName(): string {
		return this.algorithmName;
	}

	public getSafeAlgorithmName(): string {
		return this.algorithmName.replace(/ /g, '_');
	}

	/// Methods
	private doIteration(): Array<TreeEdge> | null {
		const currentNode = this.getCurrentNode(true);
		if (currentNode === null) return null;

		if (Problem.isSolution(currentNode)) {
			const solutionPath = Tree.getAscendingPath(currentNode);
			return solutionPath;
		} else {
			this.closedNodes.push(currentNode);
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
