import GraphEdge from './GraphEdge.ts';
import Rule from './Rule.ts';
import State from './State.js';

export default class GraphNode {
	/// Attributes
	private id: number;
	private state: State;
	private sourceEdges: Array<GraphEdge>;
	private targetEdges: Array<GraphEdge>;

	/// Constructor
	constructor(id: number, state: State) {
		this.id = id;
		this.state = state;
		this.sourceEdges = [];
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
	private addSourceEdge(sourceNode: GraphNode, rule: Rule): GraphEdge {
		const edge = new GraphEdge(sourceNode, this, rule);
		this.sourceEdges.push(edge);
		return edge;
	}

	private addTargetEdge(targetNode: GraphNode, rule: Rule): GraphEdge {
		const edge = new GraphEdge(this, targetNode, rule);
		this.targetEdges.push(edge);
		return edge;
	}

	public addEdge(target: GraphNode, rule: Rule): GraphEdge {
		target.addSourceEdge(this, rule);
		const targetEdge = this.addTargetEdge(target, rule);
		return targetEdge;
	}

	public checkIfThereIsLoop(state: State): boolean {
		for (const sourceEdge of this.sourceEdges) {
			const sourceNode = sourceEdge.getSourceNode();
			if (sourceNode.getState().equalsByItems(state)) {
				return true;
			} else {
				return sourceNode.checkIfThereIsLoop(state);
			}
		}
		return false;
	}
}
