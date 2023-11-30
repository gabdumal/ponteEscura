import State from '../../Domain/State.js';
import OrderedTreeNode from './OrderedTreeNode.ts';
import WeightedTree from '../WeightedTree/WeightedTree.js';

export default class OrderedTree extends WeightedTree {
	/// Methods
	protected instantiateNode(id: number, state: State): OrderedTreeNode {
		return new OrderedTreeNode(id, state);
	}
}
