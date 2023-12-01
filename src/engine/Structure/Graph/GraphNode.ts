import {attribute as _, Node as GraphvizNode} from 'ts-graphviz';
import State, {RiverBank} from '../../Domain/State.js';
import Rule from '../../Domain/Rule.js';
import BasicNode from '../Basic/BasicNode.js';
import GraphEdge from './GraphEdge.js';

export default class GraphNode extends BasicNode {
	/// Attributes
	private sourceEdges: Array<GraphEdge>;

	/// Constructor
	constructor(id: number, state: State) {
		super(id, state);
		this.sourceEdges = [];
	}

	/// Getters
	public getSourceEdges(): Array<GraphEdge> {
		return this.sourceEdges;
	}

	private getHeuristic(): number {
		const state = this.getState();

		const initialRiverBankItems = state.getRiverBankItems(RiverBank.Initial);
		const initialRiverBankValue = initialRiverBankItems.reduce(
			(accumulator, item) => accumulator + item,
			0,
		);

		let conditionalValue = 0;
		if (state.getLampPosition() === RiverBank.Final) {
			const finalRiverBankItems = state.getRiverBankItems(RiverBank.Final);
			const auxArray = finalRiverBankItems.filter(item => item !== 0);
			conditionalValue = Math.min(...auxArray);
		}
		const heuristic = initialRiverBankValue + conditionalValue;
		return heuristic;
	}

	/// Methods
	protected addSourceEdge(sourceNode: GraphNode, rule: Rule): GraphEdge {
		const edge = new GraphEdge(sourceNode, this, rule);
		this.sourceEdges.push(edge);
		return edge;
	}

	public checkIfThereIsLoop(state: State): boolean {
		for (const sourceEdge of this.sourceEdges) {
			const sourceNode = sourceEdge.getSourceNode();
			if (sourceNode.getState().equalsByItems(state)) {
				return true;
			} else {
				return sourceNode.checkIfThereIsLoop(state);
			}
		}
		return false;
	}

	public toDot(showTime: boolean = true): GraphvizNode {
		const dotNode = new GraphvizNode(this.getId().toString(), {
			[_.label]: `${this.getId().toString()}. {H${this.getHeuristic()}}\n${this.getState().getPlainTextScenery(
				showTime,
			)}`,
		});
		return dotNode;
	}
}
