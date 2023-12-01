import State from '../../Domain/State.js';
import AStarTreeNode from './AStarTreeNode.js';
import WeightedTree from '../WeightedTree/WeightedTree.js';

export default class AStarTree extends WeightedTree {
	/// Methods
	protected instantiateNode(id: number, state: State): AStarTreeNode {
		return new AStarTreeNode(id, state);
	}
}
