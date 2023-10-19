import BasicNode from '../Basic/BasicNode.ts';
import GraphEdge from './GraphEdge.ts';
import Rule from '../Rule.ts';
import State from '../State.js';

export default class GraphNode extends BasicNode {
	/// Attributes
	private sourceEdges: Array<GraphEdge>;

	/// Constructor
	constructor(id: number, state: State) {
		super(id, state);
		this.sourceEdges = [];
	}

	/// Getters
	public getSourceEdges(): Array<GraphEdge> {
		return this.sourceEdges;
	}

	/// Methods
	protected addSourceEdge(sourceNode: GraphNode, rule: Rule): GraphEdge {
		const edge = new GraphEdge(sourceNode, this, rule);
		this.sourceEdges.push(edge);
		return edge;
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
