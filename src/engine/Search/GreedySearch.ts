import State, {RiverBank} from '../Domain/State.js';
import GreedyTree from '../Structure/GreedyTree/GreedyTree.js';
import GreedyTreeNode from '../Structure/GreedyTree/GreedyTreeNode.js';
import TreeEdge from '../Structure/Tree/TreeEdge.js';
import WeightedTreeEdge from '../Structure/WeightedTree/WeightedTreeEdge.js';
import InformedSearch from './InformedSearch.js';

export default class GreedySearch extends InformedSearch {
	/// Constructor
	constructor() {
		const sortingFunction = (
			a: WeightedTreeEdge,
			b: WeightedTreeEdge,
		): number => {
			const aTargetNode = a.getTargetNode() as GreedyTreeNode;
			const bTargetNode = b.getTargetNode() as GreedyTreeNode;
			const delta = aTargetNode.getValue() - bTargetNode.getValue();
			if (delta === 0) {
				// If the values are equal, then the node with the most items on the final river bank is chosen
				return (
					bTargetNode.getState().getRiverBankItems(RiverBank.Final).length -
					aTargetNode.getState().getRiverBankItems(RiverBank.Final).length
				);
			} else return delta;
		};
		const state = new State();
		const tree = new GreedyTree(state);
		super(sortingFunction as (a: TreeEdge, b: TreeEdge) => number, tree);
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Greedy Search';
	}
}
