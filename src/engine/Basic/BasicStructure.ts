import {attribute as _, GraphAttributesObject} from 'ts-graphviz';
import {Format, toFile} from 'ts-graphviz/adapter';
import BasicNode from './BasicNode.js';
import BasicEdge from './BasicEdge.ts';
import State from '../State.js';

export default abstract class BasicStructure {
	/// Attributes
	private nextNodeId = 0;

	/// Constructor
	constructor() {}

	/// Getters
	public getNextNodeId(): number {
		return this.nextNodeId;
	}

	/// Methods
	public incrementNextNodeId(): void {
		this.nextNodeId++;
	}

	public abstract addNode(state: State): BasicNode;

	public createValidTransitions(node: BasicNode): Array<BasicEdge> {
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

	public createAllValidTransitions(node: BasicNode): void {
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

	public abstract exportToDot(attributes?: GraphAttributesObject): string;

	/// Static Methods
	public static async exportToFile(
		dotString: string,
		imageName: string,
		format: Format,
	): Promise<void> {
		await toFile(dotString, `./${imageName}.${format}`, {format: format});
	}
}
