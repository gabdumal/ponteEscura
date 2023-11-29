import WeightedTreeNode from './WeightedTreeNode.ts';

export default class OrderedTreeNode extends WeightedTreeNode {
	/// Getters
	protected getHeuristic(): number {
		return 0;
	}
}
