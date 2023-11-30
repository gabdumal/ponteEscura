import Rule from '../../Domain/Rule.js';
import State from '../../Domain/State.js';
import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import WeightedTreeEdge from './WeightedTreeEdge.js';

export default abstract class WeightedTreeNode extends TreeNode {
	/// Constructor
	constructor(id: number, state: State, sourceEdge?: TreeEdge) {
		super(id, state, sourceEdge);
	}

	/// Getters
	public getWeight(): number {
		const sourceEdge = this.getSourceEdge() as WeightedTreeEdge;
		if (sourceEdge === null) {
			return 0;
		} else {
			return sourceEdge.getWeight();
		}
	}

	protected abstract getHeuristic(): number;

	public getValue(): number {
		return this.getWeight() + this.getHeuristic();
	}

	/// Methods
	protected addSourceEdge(
		sourceNode: WeightedTreeNode,
		rule: Rule,
	): TreeEdge | null {
		if (this.sourceEdge !== null) return null;
		else {
			const edge = new WeightedTreeEdge(sourceNode, this, rule);
			this.sourceEdge = edge;
			return edge;
		}
	}

	protected addTargetEdge(
		targetNode: WeightedTreeNode,
		rule: Rule,
		connect: boolean,
	): WeightedTreeEdge {
		const edge = new WeightedTreeEdge(this, targetNode, rule);
		if (connect) this.targetEdges.push(edge);
		return edge;
	}
}
