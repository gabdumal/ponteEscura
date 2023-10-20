import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import BasicStructure from '../Basic/BasicStructure.ts';
import TreeNode from './TreeNode.ts';
import TreeEdge from './TreeEdge.ts';
import State from '../State.js';

export default class Tree extends BasicStructure {
	/// Attributes
	private root: TreeNode;

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

	public createValidTransitions(node: TreeNode): Array<TreeEdge> {
		const outcome = node.getState().getOutcome();
		if (outcome.isTerminal) return [];
		const validRules = node.getState().getValidRules();
		const edges = [];
		for (const rule of validRules) {
			const newState = rule.transpose(node.getState());
			if (!node.checkIfThereIsLoop(newState)) {
				const newNode = this.createNode(newState);
				const edge = node.addEdge(newNode, rule);
				edges.push(edge);
			}
		}
		return edges;
	}

	public exportToDot({
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
			const dotRootNode = Tree.getDotNode(
				this.root,
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
				const dotTargetNode = Tree.getDotNode(
					targetNode,
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

	private static getDotNode(
		node: TreeNode,
		isInSolutionPath: boolean = false,
	): GraphvizNode {
		const dotNode = new GraphvizNode(node.getId().toString(), {
			[_.label]: `${node.getId().toString()}. ${node
				.getState()
				.getPlainTextScenery()}`,
			[_.color]: isInSolutionPath ? 'orange' : Tree.getDotNodeColor(node),
		});
		return dotNode;
	}
}
