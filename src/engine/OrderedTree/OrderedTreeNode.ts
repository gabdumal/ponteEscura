import WeightedTreeNode from '../WeightedTree/WeightedTreeNode.js';

export default class OrderedTreeNode extends WeightedTreeNode {
	/// Getters
	protected getHeuristic(): number {
		return 0;
	}
}
