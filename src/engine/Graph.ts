import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
} from 'ts-graphviz';
import GraphNode from './GraphNode.ts';
import State from './State.ts';

export default class Graph {
	/// Attributes
	private nodes: Array<GraphNode>;
	private nextNodeId = 0;

	/// Constructor
	constructor() {
		this.nodes = [];
	}

	/// Getters
	public getNodes(): Array<GraphNode> {
		return this.nodes;
	}

	/// Setters

	/// Methods
	public addNode(state: State): GraphNode {
		const node = new GraphNode(this.nextNodeId, state);
		this.nodes.push(node);
		this.nextNodeId++;
		return node;
	}

	public createValidTransitions(node: GraphNode): void {
		const validRules = node.getState().getValidRules();
		for (const rule of validRules) {
			const newState = rule.transpose(node.getState());
			const outcome = newState.getOutcome();
			if (!outcome.isTerminal) {
				if (!node.checkIfThereIsLoop(newState)) {
					const newNode = this.addNode(newState);
					node.addEdge(newNode, rule);
					this.createValidTransitions(newNode);
				}
			}
		}
	}

	public exportToDot(): string {
		const dotGraph = new GraphvizDigraph('G');

		for (const node of this.nodes) {
			const dotNode = new GraphvizNode(node.getId().toString(), {
				label: node.getState().getPlainTextScenery(),
			});
			dotGraph.addNode(dotNode);
		}

		const dot = toDot(dotGraph);
		return dot;
	}
}
