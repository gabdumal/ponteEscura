import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import BasicStructure from '../Basic/BasicStructure.js';
import TreeNode from './TreeNode.js';
import TreeEdge from './TreeEdge.js';
import State from '../../Domain/State.js';
import Rule from '../../Domain/Rule.js';

export default class Tree extends BasicStructure {
	/// Attributes
	protected root: TreeNode;

	/// Constructor
	constructor(state: State) {
		super();
		this.root = this.createNode(state) as TreeNode;
	}

	/// Getters
	public getRoot(): TreeNode {
		return this.root;
	}

	/// Methods
	protected instantiateNode(id: number, state: State): TreeNode {
		return new TreeNode(id, state);
	}

	public createValidTransitions(
		node: TreeNode,
		sortingFunction: (a: TreeEdge, b: TreeEdge) => number,
	): Array<TreeEdge> {
		const outcome = node.getState().getOutcome();
		if (outcome.isTerminal) return [];
		const validRules = node.getState().getValidRules();
		const targetEdges = [];
		for (const rule of validRules) {
			if (node.checkIfTransitionAlreadyExists(rule)) continue;
			const newState = rule.transpose(node.getState());
			if (!node.checkIfThereIsLoop(newState)) {
				const newNode = this.createNode(newState);
				const targetEdge = node.addEdge(newNode, rule, false);
				targetEdges.push(targetEdge);
			}
		}
		targetEdges.sort(sortingFunction);
		node.connectTargetEdges(targetEdges);
		return targetEdges;
	}

	public createNextValidTransition(
		node: TreeNode,
		sortingFunction: (a: Rule, b: Rule) => number,
	): TreeEdge | null {
		const outcome = node.getState().getOutcome();
		if (outcome.isTerminal) return null;
		const validRules = node.getState().getValidRules();
		validRules.sort(sortingFunction);
		for (const rule of validRules) {
			if (node.checkIfTransitionAlreadyExists(rule)) continue;
			const newState = rule.transpose(node.getState());
			if (!node.checkIfThereIsLoop(newState)) {
				const newNode = this.createNode(newState);
				const edge = node.addEdge(newNode, rule);
				return edge;
			}
		}
		return null;
	}

	public toDot({
		attributes,
		solutionPathNodes,
	}: {
		attributes?: GraphAttributesObject;
		solutionPathNodes?: Array<TreeNode>;
	}): string {
		attributes = {
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);

		const edges: Array<TreeEdge> = [];
		if (this.root !== null) {
			const dotRootNode = this.root.toDot(
				solutionPathNodes !== undefined &&
					solutionPathNodes.includes(this.root),
			);
			dotGraph.addNode(dotRootNode);
			edges.push(...this.root.getTargetEdges());

			while (edges.length > 0) {
				const edge = edges.shift();
				if (edge === undefined) continue;
				const sourceNode = edge.getSourceNode() as TreeNode;
				const dotSourceNode = dotGraph.getNode(sourceNode.getId().toString());
				if (dotSourceNode === undefined) continue;

				const targetNode = edge.getTargetNode() as TreeNode;
				edges.push(...targetNode.getTargetEdges());
				const targetNodeIsInSolutionPath =
					solutionPathNodes !== undefined &&
					solutionPathNodes.includes(targetNode);
				const dotTargetNode = targetNode.toDot(
					solutionPathNodes !== undefined &&
						solutionPathNodes.includes(targetNode),
				);
				dotGraph.addNode(dotTargetNode);

				const dotEdge = new GraphvizEdge([dotSourceNode, dotTargetNode], {
					[_.label]: `${edge.getRule().getId()}. ${edge
						.getRule()
						.getPlainText()}`,
					[_.color]: targetNodeIsInSolutionPath ? 'orange' : 'black',
				});
				dotGraph.addEdge(dotEdge);
			}
		}

		const dot = toDot(dotGraph);
		return dot;
	}

	/// Static methods
	public static getAscendingPath(node: TreeNode): Array<TreeEdge> {
		const path = [];
		let currentNode = node;
		while (currentNode !== null) {
			const sourceEdge = currentNode.getSourceEdge();
			if (sourceEdge === null) break;
			path.unshift(sourceEdge);
			currentNode = sourceEdge.getSourceNode() as TreeNode;
		}
		return path;
	}

	public static exportNodesListToDot(
		nodesList: Array<TreeNode>,
		attributes?: GraphAttributesObject,
	): string {
		attributes = {
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);
		for (const node of nodesList) {
			const dotNode = node.toDot(false);
			dotGraph.addNode(dotNode);
		}
		return toDot(dotGraph);
	}
}
