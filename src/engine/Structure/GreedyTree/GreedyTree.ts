import State from '../../Domain/State.js';
import GreedyTreeNode from './GreedyTreeNode.js';
import WeightedTree from '../WeightedTree/WeightedTree.js';

export default class GreedyTree extends WeightedTree {
	/// Methods
	protected instantiateNode(id: number, state: State): GreedyTreeNode {
		return new GreedyTreeNode(id, state);
	}
}
