import GraphEdge from './GraphEdge.ts';
import Rule from './Rule.ts';
import State from './State.js';

export default class GraphNode {
	/// Attributes
	private id: number;
	private state: State;
	// private sourceEdges: Array<GraphEdge>;
	private targetEdges: Array<GraphEdge>;

	/// Constructor
	constructor(id: number, state: State) {
		this.id = id;
		this.state = state;
		// this.sourceEdges = [];
		this.targetEdges = [];
	}

	/// Getters
	public getId(): number {
		return this.id;
	}

	public getState(): State {
		return this.state;
	}

	public getTargetEdges(): Array<GraphEdge> {
		return this.targetEdges;
	}

	/// Setters
	public setState(state: State): void {
		this.state = state;
	}

	/// Methods
	// private addSourceEdge(source: GraphNode, rule: Rule): void {
	// 	const edge = new GraphEdge(source, rule);
	// 	this.sourceEdges.push(edge);
	// }

	private addTargetEdge(target: GraphNode, rule: Rule): void {
		const edge = new GraphEdge(this, target, rule);
		this.targetEdges.push(edge);
	}

	public addEdge(target: GraphNode, rule: Rule): void {
		// target.addSourceEdge(this, rule);
		this.addTargetEdge(target, rule);
	}
}
