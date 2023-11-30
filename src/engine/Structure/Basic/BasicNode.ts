import BasicEdge from './BasicEdge.js';
import Rule from '../../Domain/Rule.js';
import State from '../../Domain/State.js';

export default abstract class BasicNode {
	/// Attributes
	private id: number;
	private state: State;
	protected targetEdges: Array<BasicEdge>;

	/// Constructor
	constructor(id: number, state: State) {
		this.id = id;
		this.state = state;
		this.targetEdges = [];
	}

	/// Getters
	public getId(): number {
		return this.id;
	}

	public getState(): State {
		return this.state;
	}

	public getTargetEdges(): Array<BasicEdge> {
		return this.targetEdges;
	}

	/// Setters
	public setState(state: State): void {
		this.state = state;
	}

	/// Methods
	protected abstract addSourceEdge(
		sourceNode: BasicNode,
		rule: Rule,
	): BasicEdge | null;

	protected addTargetEdge(
		targetNode: BasicNode,
		rule: Rule,
		connect: boolean,
	): BasicEdge {
		const edge = new BasicEdge(this, targetNode, rule);
		if (connect) this.targetEdges.push(edge);
		return edge;
	}

	public addEdge(
		targetNode: BasicNode,
		rule: Rule,
		connect: boolean = true,
	): BasicEdge {
		const sourceEdge = targetNode.addSourceEdge(this, rule);
		if (sourceEdge === null) throw new Error('Cannot add edge');
		else {
			const targetEdge = this.addTargetEdge(targetNode, rule, connect);
			return targetEdge;
		}
	}

	public connectTargetEdges(targetEdges: Array<BasicEdge>): void {
		this.targetEdges = this.targetEdges.concat(targetEdges);
	}

	public abstract checkIfThereIsLoop(state: State): boolean;

	public getDotColor(): string {
		const outcome = this.getState().getOutcome();
		return outcome.isTerminal ? (outcome.win ? 'green' : 'red') : 'black';
	}
}
