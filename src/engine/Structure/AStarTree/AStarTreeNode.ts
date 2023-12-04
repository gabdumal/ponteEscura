import {attribute as _, Node as GraphvizNode} from 'ts-graphviz';
import {RiverBank} from '../../Domain/State.js';
import WeightedTreeNode from '../WeightedTree/WeightedTreeNode.js';

export default class AStarTreeNode extends WeightedTreeNode {
	/// Getters
	private getHeuristic(): number {
		const state = this.getState();
		// Sum of the elapsed time of all the items in the initial river bank
		const initialRiverBankItems = state.getRiverBankItems(RiverBank.Initial);
		const initialRiverBankValue = initialRiverBankItems.reduce(
			(accumulator, item) => accumulator + item,
			0,
		);
		// If the lamp is in the final river bank, then get the value of
		// the fastest person there
		let conditionalValue = 0;
		if (state.getLampPosition() === RiverBank.Final) {
			const finalRiverBankItems = state.getRiverBankItems(RiverBank.Final);
			const auxArray = finalRiverBankItems.filter(item => item !== 0);
			conditionalValue = Math.min(...auxArray);
		}
		const heuristic = initialRiverBankValue + conditionalValue;
		return heuristic;
	}

	public getValue(): number {
		return this.getWeight() + this.getHeuristic();
	}

	public toDot(isInSolutionPath: boolean): GraphvizNode {
		const dotNode = new GraphvizNode(this.getId().toString(), {
			[_.label]: `${this.getId().toString()}. {W${this.getWeight()} | H${this.getHeuristic()} | V${this.getValue()}}\n${this.getState().getPlainTextScenery()}`,
			[_.color]: isInSolutionPath ? 'orange' : this.getDotColor(),
		});
		return dotNode;
	}
}
