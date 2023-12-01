import {attribute as _, Node as GraphvizNode} from 'ts-graphviz';
import Rule from '../../Domain/Rule.js';
import State from '../../Domain/State.js';
import TreeEdge from '../Tree/TreeEdge.js';
import TreeNode from '../Tree/TreeNode.js';
import WeightedTreeEdge from './WeightedTreeEdge.js';

export default abstract class WeightedTreeNode extends TreeNode {
	/// Constructor
	constructor(id: number, state: State, sourceEdge?: TreeEdge) {
		super(id, state, sourceEdge);
	}

	/// Getters
	public getWeight(): number {
		const sourceEdge = this.getSourceEdge() as WeightedTreeEdge;
		if (sourceEdge === null) {
			return 0;
		} else {
			return sourceEdge.getWeight();
		}
	}

	public abstract getValue(): number;

	/// Methods
	protected addSourceEdge(
		sourceNode: WeightedTreeNode,
		rule: Rule,
	): TreeEdge | null {
		if (this.sourceEdge !== null) return null;
		else {
			const edge = new WeightedTreeEdge(sourceNode, this, rule);
			this.sourceEdge = edge;
			return edge;
		}
	}

	protected addTargetEdge(
		targetNode: WeightedTreeNode,
		rule: Rule,
		connect: boolean,
	): WeightedTreeEdge {
		const edge = new WeightedTreeEdge(this, targetNode, rule);
		if (connect) this.targetEdges.push(edge);
		return edge;
	}

	public toDot(isInSolutionPath: boolean): GraphvizNode {
		const dotNode = new GraphvizNode(this.getId().toString(), {
			[_.label]: `${this.getId().toString()}. {W${this.getWeight()} | V${this.getValue()}}\n${this.getState().getPlainTextScenery()}`,
			[_.color]: isInSolutionPath ? 'orange' : this.getDotColor(),
		});
		return dotNode;
	}
}
