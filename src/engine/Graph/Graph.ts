import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import BasicStructure from '../Basic/BasicStructure.ts';
import GraphNode from './GraphNode.ts';
import State from '../State.js';

export default class Graph extends BasicStructure {
	/// Attributes
	private nodes: Array<GraphNode>;

	/// Constructor
	constructor() {
		super();
		this.nodes = [];
	}

	/// Methods
	public addNode(state: State): GraphNode {
		const node = new GraphNode(super.getNextNodeId(), state);
		this.nodes.push(node);
		super.incrementNextNodeId();
		return node;
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
}
