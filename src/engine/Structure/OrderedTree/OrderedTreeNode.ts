import WeightedTreeNode from '../WeightedTree/WeightedTreeNode.js';

export default class OrderedTreeNode extends WeightedTreeNode {
	/// Getters
	public getValue(): number {
		return this.getWeight();
	}
}
