import {attribute as _, Node as GraphvizNode} from 'ts-graphviz';
import BasicNode from '../Basic/BasicNode.js';
import TreeEdge from './TreeEdge.js';
import Rule from '../../Domain/Rule.js';
import State from '../../Domain/State.js';

export default class TreeNode extends BasicNode {
	/// Attributes
	protected sourceEdge: TreeEdge | null;

	/// Constructor
	constructor(id: number, state: State, sourceEdge?: TreeEdge) {
		super(id, state);
		this.sourceEdge = sourceEdge ?? null;
	}

	/// Getters
	public getSourceEdge(): TreeEdge | null {
		return this.sourceEdge;
	}

	/// Methods
	protected addSourceEdge(sourceNode: TreeNode, rule: Rule): TreeEdge | null {
		if (this.sourceEdge !== null) return null;
		else {
			const edge = new TreeEdge(sourceNode, this, rule);
			this.sourceEdge = edge;
			return edge;
		}
	}

	public checkIfThereIsLoop(state: State): boolean {
		if (this.sourceEdge === null) return false;
		else {
			const sourceNode = this.sourceEdge.getSourceNode() as TreeNode;
			if (sourceNode.getState().equalsByItems(state)) {
				return true;
			} else {
				return sourceNode.checkIfThereIsLoop(state);
			}
		}
	}

	public toDot(isInSolutionPath: boolean = false): GraphvizNode {
		const dotNode = new GraphvizNode(this.getId().toString(), {
			[_.label]: `${this.getId().toString()}. ${this.getState().getPlainTextScenery()}`,
			[_.color]: isInSolutionPath ? 'orange' : this.getDotColor(),
		});
		return dotNode;
	}
}
