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
	private incrementNextNodeId(): void {
		this.nextNodeId++;
	}

	protected abstract instantiateNode(id: number, state: State): BasicNode;

	protected createNode(state: State): BasicNode {
		const node = this.instantiateNode(this.nextNodeId, state);
		this.incrementNextNodeId();
		return node;
	}

	public abstract createValidTransitions(node: BasicNode): Array<BasicEdge>;

	public createAllValidTransitions(node: BasicNode): void {
		let edges = this.createValidTransitions(node);
		while (edges.length > 0) {
			const edge = edges.shift();
			if (edge === undefined) continue;
			node = edge.getTargetNode();
			const createdEdges = this.createValidTransitions(node);
			for (const createdEdge of createdEdges) {
				if (!createdEdge.getTargetNode().getState().getOutcome().isTerminal)
					edges.push(createdEdge);
			}
		}
	}

	public abstract exportToDot({
		attributes,
	}: {
		attributes?: GraphAttributesObject;
	}): string;

	/// Static methods
	public static async exportToFile(
		dotString: string,
		imageName: string,
		format: Format,
	): Promise<void> {
		await toFile(dotString, `./${imageName}.${format}`, {format: format});
	}

	protected static getDotNodeColor(node: BasicNode): string {
		const outcome = node.getState().getOutcome();
		return outcome.isTerminal ? (outcome.win ? 'green' : 'red') : 'black';
	}
}
