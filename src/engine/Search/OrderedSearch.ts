import State, {RiverBank} from '../Domain/State.js';
import OrderedTree from '../Structure/OrderedTree/OrderedTree.js';
import OrderedTreeNode from '../Structure/OrderedTree/OrderedTreeNode.js';
import TreeEdge from '../Structure/Tree/TreeEdge.js';
import WeightedTreeEdge from '../Structure/WeightedTree/WeightedTreeEdge.js';
import InformedSearch from './InformedSearch.js';

export default class OrderedSearch extends InformedSearch {
	/// Constructor
	constructor() {
		const sortingFunction = (
			a: WeightedTreeEdge,
			b: WeightedTreeEdge,
		): number => {
			const aTargetNode = a.getTargetNode() as OrderedTreeNode;
			const bTargetNode = b.getTargetNode() as OrderedTreeNode;
			const delta = aTargetNode.getValue() - bTargetNode.getValue();
			if (delta === 0) {
				// If the values are equal, then the node with the most items on the
				// final river bank is chosen
				return (
					bTargetNode.getState().getRiverBankItems(RiverBank.Final).length -
					aTargetNode.getState().getRiverBankItems(RiverBank.Final).length
				);
			} else return delta;
		};
		const state = new State();
		const tree = new OrderedTree(state);
		super(sortingFunction as (a: TreeEdge, b: TreeEdge) => number, tree);
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Ordered Search';
	}
}
