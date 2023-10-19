import BasicEdge from './BasicEdge.js';
import Rule from '../Rule.js';
import State from '../State.js';

export default abstract class BasicNode {
	/// Attributes
	private id: number;
	private state: State;
	private targetEdges: Array<BasicEdge>;

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

	private addTargetEdge(targetNode: BasicNode, rule: Rule): BasicEdge {
		const edge = new BasicEdge(this, targetNode, rule);
		this.targetEdges.push(edge);
		return edge;
	}

	public addEdge(target: BasicNode, rule: Rule): BasicEdge {
		const sourceEdge = target.addSourceEdge(this, rule);
		if (sourceEdge === null) throw new Error('Cannot add edge');
		else {
			const targetEdge = this.addTargetEdge(target, rule);
			return targetEdge;
		}
	}

	public abstract checkIfThereIsLoop(state: State): boolean;
}
