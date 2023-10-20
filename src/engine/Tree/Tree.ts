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
		solutionNode,
	}: {
		attributes?: GraphAttributesObject;
		solutionNode?: TreeNode;
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
			const dotRootNode = new GraphvizNode(this.root.getId().toString(), {
				[_.label]: `${this.root.getId().toString()}. ${this.root
					.getState()
					.getPlainTextScenery()}`,
				[_.color]: Tree.getDotNodeColor(this.root),
			});
			dotGraph.addNode(dotRootNode);
			edges.push(...this.root.getTargetEdges());

			while (edges.length > 0) {
				const edge = edges.shift();
				if (edge === undefined) continue;
				const dotSourceNode = dotGraph.getNode(
					edge.getSourceNode().getId().toString(),
				);
				if (dotSourceNode === undefined) continue;

				const targetNode = edge.getTargetNode();
				edges.push(...targetNode.getTargetEdges());
				const dotTargetNode = new GraphvizNode(targetNode.getId().toString(), {
					[_.label]: `${targetNode.getId().toString()}. ${targetNode
						.getState()
						.getPlainTextScenery()}`,
					[_.color]: Tree.getDotNodeColor(targetNode),
				});
				dotGraph.addNode(dotTargetNode);

				const dotEdge = new GraphvizEdge([dotSourceNode, dotTargetNode], {
					[_.label]: edge.getRule().getPlainText(),
				});
				dotGraph.addEdge(dotEdge);
			}
		}

		// Paint solution path
		if (solutionNode !== undefined) {
			let currentNode = solutionNode;
			do {
				const dotCurrentNode = dotGraph.getNode(currentNode.getId().toString());
				if (dotCurrentNode === undefined) break;
				dotCurrentNode.attributes.set('color', 'orange');
				const sourceEdge = currentNode.getSourceEdge();
				if (sourceEdge === null) break;
				currentNode = sourceEdge.getSourceNode() as TreeNode;
			} while (currentNode !== null);
		}

		const dot = toDot(dotGraph);
		return dot;
	}
}
