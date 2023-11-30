import {attribute as _, GraphAttributesObject} from 'ts-graphviz';
import {Format, toFile} from 'ts-graphviz/adapter';
import BasicNode from './BasicNode.js';
import BasicEdge from './BasicEdge.js';
import State from '../../Domain/State.js';

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

	public abstract createValidTransitions(
		node: BasicNode,
		sortingFunction: (a: BasicEdge, b: BasicEdge) => number,
	): Array<BasicEdge>;

	public createAllValidTransitions(node: BasicNode): void {
		const sortingFunction = (a: BasicEdge, b: BasicEdge) => {
			return a.getRule().getElapsedTime() - b.getRule().getElapsedTime();
		};
		let edges = this.createValidTransitions(node, sortingFunction);
		while (edges.length > 0) {
			const edge = edges.shift();
			if (edge === undefined) continue;
			node = edge.getTargetNode();
			const createdEdges = this.createValidTransitions(node, sortingFunction);
			for (const createdEdge of createdEdges) {
				if (!createdEdge.getTargetNode().getState().getOutcome().isTerminal)
					edges.push(createdEdge);
			}
		}
	}

	public abstract toDot({
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
}
