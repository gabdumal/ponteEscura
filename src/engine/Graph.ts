import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
} from 'ts-graphviz';
import GraphNode from './GraphNode.ts';
import State from './State.ts';

export default class Graph {
	/// Attributes
	private nodes: Array<GraphNode>;
	private nextNodeId = 0;

	/// Constructor
	constructor() {
		this.nodes = [];
	}

	/// Getters

	/// Setters

	/// Methods
	public addNode(state: State): GraphNode {
		const node = new GraphNode(this.nextNodeId, state);
		this.nodes.push(node);
		this.nextNodeId++;
		return node;
	}

	public exportToDot(): string {
		const dotGraph = new GraphvizDigraph('G');

		for (const node of this.nodes) {
			const dotNode = new GraphvizNode(node.getId().toString(), {
				label: node.getId().toString(),
			});
			dotGraph.addNode(dotNode);
		}

		const dot = toDot(dotGraph);
		return dot;
	}
}