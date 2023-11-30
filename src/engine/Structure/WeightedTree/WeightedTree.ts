import {
	attribute as _,
	Digraph as GraphvizDigraph,
	Edge as GraphvizEdge,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import Tree from '../Tree/Tree.js';
import WeightedTreeNode from './WeightedTreeNode.ts';
import WeightedTreeEdge from './WeightedTreeEdge.ts';

export default abstract class WeightedTree extends Tree {
	/// Methods
	public toDot({
		attributes,
		solutionPathNodes,
	}: {
		attributes?: GraphAttributesObject;
		solutionPathNodes?: Array<WeightedTreeNode>;
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
			const dotRootNode = this.getRoot().toDot(
				solutionPathNodes !== undefined &&
					solutionPathNodes.includes(this.getRoot() as WeightedTreeNode),
			);
			dotGraph.addNode(dotRootNode);
			edges.push(...(this.root.getTargetEdges() as Array<WeightedTreeEdge>));
			while (edges.length > 0) {
				const edge = edges.shift();
				if (edge === undefined) continue;
				const sourceNode = edge.getSourceNode() as WeightedTreeNode;
				const dotSourceNode = dotGraph.getNode(sourceNode.getId().toString());
				if (dotSourceNode === undefined) continue;
				const targetNode = edge.getTargetNode() as WeightedTreeNode;
				edges.push(...(targetNode.getTargetEdges() as Array<WeightedTreeEdge>));
				const targetNodeIsInSolutionPath =
					solutionPathNodes !== undefined &&
					solutionPathNodes.includes(targetNode);
				const dotTargetNode = targetNode.toDot(
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
}
