import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Node as GraphvizNode,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import State from '../State.js';
import OrderedTreeNode from './OrderedTreeNode.js';
import WeightedTree from '../WeightedTree/WeightedTree.js';
import WeightedTreeEdge from '../WeightedTree/WeightedTreeEdge.ts';

export default class OrderedTree extends WeightedTree {
	/// Methods
	protected instantiateNode(id: number, state: State): OrderedTreeNode {
		return new OrderedTreeNode(id, state);
	}

	public exportToDot({
		attributes,
		solutionPathNodes,
	}: {
		attributes?: GraphAttributesObject;
		solutionPathNodes?: Array<OrderedTreeNode>;
	}): string {
		attributes = {
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);

		const edges: Array<WeightedTreeEdge> = [];
		if (this.root !== null) {
			const dotRootNode = OrderedTree.getDotNode(
				this.getRoot() as OrderedTreeNode,
				solutionPathNodes !== undefined &&
					solutionPathNodes.includes(this.getRoot() as OrderedTreeNode),
			);
			dotGraph.addNode(dotRootNode);
			edges.push(...(this.root.getTargetEdges() as Array<WeightedTreeEdge>));

			while (edges.length > 0) {
				const edge = edges.shift();
				if (edge === undefined) continue;
				const sourceNode = edge.getSourceNode() as OrderedTreeNode;
				const dotSourceNode = dotGraph.getNode(sourceNode.getId().toString());
				if (dotSourceNode === undefined) continue;

				const targetNode = edge.getTargetNode() as OrderedTreeNode;
				edges.push(...(targetNode.getTargetEdges() as Array<WeightedTreeEdge>));
				const targetNodeIsInSolutionPath =
					solutionPathNodes !== undefined &&
					solutionPathNodes.includes(targetNode);
				const dotTargetNode = OrderedTree.getDotNode(
					targetNode,
					solutionPathNodes !== undefined &&
						solutionPathNodes.includes(targetNode),
				);
				dotGraph.addNode(dotTargetNode);

				const dotEdge = new GraphvizEdge([dotSourceNode, dotTargetNode], {
					[_.label]: `${edge.getRule().getId()}. ${edge
						.getRule()
						.getPlainText()}`,
					[_.color]: targetNodeIsInSolutionPath ? 'orange' : 'black',
				});
				dotGraph.addEdge(dotEdge);
			}
		}

		const dot = toDot(dotGraph);
		return dot;
	}

	public static getDotNode(
		node: OrderedTreeNode,
		isInSolutionPath: boolean = false,
	): GraphvizNode {
		const dotNode = new GraphvizNode(node.getId().toString(), {
			[_.label]: `${node.getId().toString()}. {${node.getWeight()}} ${node
				.getState()
				.getPlainTextScenery()}`,
			[_.color]: isInSolutionPath
				? 'orange'
				: OrderedTree.getDotNodeColor(node),
		});
		return dotNode;
	}

	public static exportNodesListToDot(
		nodesList: Array<OrderedTreeNode>,
		attributes?: GraphAttributesObject,
	): string {
		attributes = {
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};
		const dotGraph = new GraphvizDigraph('G', attributes);
		for (const node of nodesList) {
			const dotNode = OrderedTree.getDotNode(node, false);
			dotGraph.addNode(dotNode);
		}
		return toDot(dotGraph);
	}
}
