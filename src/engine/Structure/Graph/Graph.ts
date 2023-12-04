import {
	attribute as _,
	Digraph as GraphvizDigraph,
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

	/// Getters
	public getNodes(): Array<GraphNode> {
		return this.nodes;
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

	public searchNode(state: State): GraphNode | null {
		const node = this.nodes.find(node => node.getState().equalsByItems(state));
		return node ? node : null;
	}

	public createValidTransitions(node: GraphNode): Array<GraphEdge> {
		const validRules = node.getState().getValidRules(true);
		const edges = [];
		for (const rule of validRules) {
			const newState = rule.transpose(node.getState());
			let newNode: GraphNode | null = this.searchNode(newState);
			if (newNode === null) {
				newNode = this.addNode(newState);
			}
			const edge = node.addEdge(newNode, rule);
			edges.push(edge);
		}
		return edges;
	}

	public toDot({attributes}: {attributes?: GraphAttributesObject}): string {
		attributes = {
			labelloc: 't',
			fontsize: 30,
			splines: 'true',
			nodesep: 0.5,
			ranksep: 2,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);

		for (const node of this.nodes) {
			const dotNode = node.toDot(false);
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

		const infoNodes = `Nós: ${dotGraph.nodes.length}\n`;
		const infoEdges = `Arestas: ${dotGraph.edges.length}\n`;
		const infoLabel = `${infoNodes}${infoEdges}`;
		const label = attributes?.label
			? `${attributes.label}\n${infoLabel}\n\n`
			: infoLabel;
		dotGraph.set('label', label);
		const dot = toDot(dotGraph);
		return dot;
	}
}
