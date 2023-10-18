import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
} from 'ts-graphviz';
import {Format, toFile} from 'ts-graphviz/adapter';
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

	public createValidTransitions(node: GraphNode, depth = 1): void {
		if (depth <= 0) return;
		const validRules = node.getState().getValidRules();
		for (const rule of validRules) {
			const newState = rule.transpose(node.getState());
			const outcome = newState.getOutcome();
			if (!outcome.isTerminal) {
				if (!node.checkIfThereIsLoop(newState)) {
					const newNode = this.addNode(newState);
					node.addEdge(newNode, rule);
					this.createValidTransitions(newNode, depth - 1);
				}
			}
		}
	}

	public exportToDot(): string {
		const dotGraph = new GraphvizDigraph('G', {
			[_.splines]: 'true',
			[_.nodesep]: 0.5,
			[_.ranksep]: 3,
			[_.rankdir]: 'LR',
		});

		for (const node of this.nodes) {
			const dotNode = new GraphvizNode(node.getId().toString(), {
				[_.label]: `${node.getId().toString()}. ${node
					.getState()
					.getPlainTextScenery()}`,
			});

			dotGraph.addNode(dotNode);
		}

		for (const node of this.nodes) {
			const dotSourceNode = dotGraph.getNode(node.getId().toString());
			if (dotSourceNode === undefined) continue;
			for (const edge of node.getTargetEdges()) {
				const dotTargetNode = dotGraph.getNode(
					edge.getTargetNode().getId().toString(),
				);
				if (dotTargetNode === undefined) continue;
				const dotEdge = new GraphvizEdge([dotSourceNode, dotTargetNode], {
					[_.label]: edge.getRule().getPlainText(),
				});
				dotGraph.addEdge(dotEdge);
			}
		}

		const dot = toDot(dotGraph);
		return dot;
	}

	/// Static Methods
	public static async exportToFile(
		dotString: string,
		imageName: string,
		format: Format,
	): Promise<void> {
		await toFile(dotString, `./${imageName}.${format}`, {format: format});
	}
}
