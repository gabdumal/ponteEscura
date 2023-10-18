import GraphNode from './GraphNode.ts';
import Rule from './Rule.js';

export default class GraphEdge {
	/// Attributes
	private source: GraphNode;
	private target: GraphNode;
	private rule: Rule;

	/// Constructor
	constructor(source: GraphNode, target: GraphNode, rule: Rule) {
		this.source = source;
		this.target = target;
		this.rule = rule;
	}

	/// Getters
	public getSource(): GraphNode {
		return this.source;
	}

	public getTarget(): GraphNode {
		return this.target;
	}

	public getRule(): Rule {
		return this.rule;
	}
}
