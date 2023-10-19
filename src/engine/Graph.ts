import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import {Format, toFile} from 'ts-graphviz/adapter';
import GraphNode from './GraphNode.ts';
import State from './State.ts';
import GraphEdge from './GraphEdge.ts';

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

	public createValidTransitions(node: GraphNode): Array<GraphEdge> {
		const validRules = node.getState().getValidRules();
		const edges = [];
		for (const rule of validRules) {
			const newState = rule.transpose(node.getState());
			if (!node.checkIfThereIsLoop(newState)) {
				const newNode = this.addNode(newState);
				const edge = node.addEdge(newNode, rule);
				edges.push(edge);
			}
		}
		return edges;
	}

	public createAllValidTransitions(node: GraphNode): void {
		let edges = this.createValidTransitions(node);
		while (edges.length > 0) {
			node = edges[0].getTargetNode();
			edges.shift();
			const createdEdges = this.createValidTransitions(node);
			for (const createdEdge of createdEdges) {
				if (!createdEdge.getTargetNode().getState().getOutcome().isTerminal)
					edges.push(createdEdge);
			}
		}
	}

	public exportToDot(attributes?: GraphAttributesObject): string {
		attributes = {
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);

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
