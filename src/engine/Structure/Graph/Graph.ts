import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import BasicStructure from '../Basic/BasicStructure.js';
import GraphNode from './GraphNode.js';
import GraphEdge from './GraphEdge.js';
import State from '../../Domain/State.js';

export default class Graph extends BasicStructure {
	/// Attributes
	private nodes: Array<GraphNode>;

	/// Constructor
	constructor() {
		super();
		this.nodes = [];
	}

	/// Methods
	protected instantiateNode(id: number, state: State): GraphNode {
		return new GraphNode(id, state);
	}

	public addNode(state: State): GraphNode {
		const node = this.createNode(state) as GraphNode;
		this.nodes.push(node);
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

	public exportToDot({
		attributes,
	}: {
		attributes?: GraphAttributesObject;
	}): string {
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
				[_.color]: Graph.getDotNodeColor(node),
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
					[_.label]: `${edge.getRule().getId()}. ${edge
						.getRule()
						.getPlainText()}`,
				});
				dotGraph.addEdge(dotEdge);
			}
		}

		const dot = toDot(dotGraph);
		return dot;
	}
}
