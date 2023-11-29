import State from '../State.js';
import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import WeightedTreeEdge from './WeightedTreeEdge.ts';

export default abstract class WeightedTreeNode extends TreeNode {
	constructor(id: number, state: State, sourceEdge?: TreeEdge) {
		super(id, state);
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
}
