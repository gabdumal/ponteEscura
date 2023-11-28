import BasicNode from '../Basic/BasicNode.js';
import TreeEdge from './TreeEdge.js';
import Rule from '../Rule.js';
import State from '../State.js';

export default class TreeNode extends BasicNode {
	/// Attributes
	private sourceEdge: TreeEdge | null;

	/// Constructor
	constructor(id: number, state: State, sourceEdge?: TreeEdge) {
		super(id, state);
		this.sourceEdge = sourceEdge ?? null;
	}

	/// Getters
	public getSourceEdge(): TreeEdge | null {
		return this.sourceEdge;
	}

	/// Methods
	protected addSourceEdge(sourceNode: TreeNode, rule: Rule): TreeEdge | null {
		if (this.sourceEdge !== null) return null;
		else {
			const edge = new TreeEdge(sourceNode, this, rule);
			this.sourceEdge = edge;
			return edge;
		}
	}

	public checkIfThereIsLoop(state: State): boolean {
		if (this.sourceEdge === null) return false;
		else {
			const sourceNode = this.sourceEdge.getSourceNode();
			if (sourceNode.getState().equalsByItems(state)) {
				return true;
			} else {
				return sourceNode.checkIfThereIsLoop(state);
			}
		}
	}

	public checkIfTransitionAlreadyExists(rule: Rule): boolean {
		const targetEdges = this.getTargetEdges();
		for (const targetEdge of targetEdges) {
			if (targetEdge.getRule() === rule) return true;
		}
		return false;
	}
}
