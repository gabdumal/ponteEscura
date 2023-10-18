import GraphNode from './GraphNode.ts';
import Rule from './Rule.js';

export default class GraphEdge {
	/// Attributes
	private sourceNode: GraphNode;
	private targetNode: GraphNode;
	private rule: Rule;

	/// Constructor
	constructor(sourceNode: GraphNode, targetNode: GraphNode, rule: Rule) {
		this.sourceNode = sourceNode;
		this.targetNode = targetNode;
		this.rule = rule;
	}

	/// Getters
	public getSourceNode(): GraphNode {
		return this.sourceNode;
	}

	public getTargetNode(): GraphNode {
		return this.targetNode;
	}

	public getRule(): Rule {
		return this.rule;
	}
}
