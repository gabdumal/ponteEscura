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
}
