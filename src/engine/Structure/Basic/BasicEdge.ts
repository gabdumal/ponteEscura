import BasicNode from './BasicNode.js';
import Rule from '../../Domain/Rule.js';

export default class BasicEdge {
	/// Attributes
	private sourceNode: BasicNode;
	private targetNode: BasicNode;
	private rule: Rule;

	/// Constructor
	constructor(sourceNode: BasicNode, targetNode: BasicNode, rule: Rule) {
		this.sourceNode = sourceNode;
		this.targetNode = targetNode;
		this.rule = rule;
	}

	/// Getters
	public getSourceNode(): BasicNode {
		return this.sourceNode;
	}

	public getTargetNode(): BasicNode {
		return this.targetNode;
	}

	public getRule(): Rule {
		return this.rule;
	}
}
