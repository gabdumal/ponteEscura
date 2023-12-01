import {attribute as _, Node as GraphvizNode} from 'ts-graphviz';
import {RiverBank} from '../../Domain/State.js';
import WeightedTreeNode from '../WeightedTree/WeightedTreeNode.js';

export default class AStarTreeNode extends WeightedTreeNode {
	/// Getters
	private getHeuristic(): number {
		const state = this.getState();
		const initialRiverBankItems = state.getRiverBankItems(RiverBank.Initial);
		const initialRiverBankValue = initialRiverBankItems.reduce(
			(accumulator, item) => accumulator + item,
			0,
		);
		const finalRiverBankItems = state.getRiverBankItems(RiverBank.Final);
		const finalRiverBankValue = finalRiverBankItems.reduce(
			(accumulator, item) => accumulator + item,
			0,
		);
		const conditionalValue =
			state.getLampPosition() === RiverBank.Final
				? Math.min(...finalRiverBankItems)
				: 0;
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
