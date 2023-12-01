import {
	attribute as _,
	Digraph as GraphvizDigraph,
	toDot,
	GraphAttributesObject,
} from 'ts-graphviz';
import Rule from './Rule.js';
import State from './State.js';
import BasicEdge from '../Structure/Basic/BasicEdge.ts';
import Tree from '../Structure/Tree/Tree.ts';
import TreeEdge from '../Structure/Tree/TreeEdge.ts';
import Graph from '../Structure/Graph/Graph.ts';
import GraphNode from '../Structure/Graph/GraphNode.ts';

export enum Item {
	Lamp = 0,
	Athlete = 1,
	Boy = 3,
	Lord = 6,
	Woman = 8,
	Lady = 12,
}

function getRules(): Array<Rule> {
	const items: Array<Item> = [
		Item.Athlete,
		Item.Boy,
		Item.Lord,
		Item.Woman,
		Item.Lady,
	];
	const rules = [];
	let aux = 0;
	for (let i = items.length - 1; i >= 0; i--) {
		const item1 = items[i];
		if (item1 === Item.Lamp) continue;
		rules.push(new Rule(aux, item1));
		aux++;
		for (let j = i - 1; j >= 0; j--) {
			const item2 = items[j];
			if (item2 === Item.Lamp) continue;
			rules.push(new Rule(aux, item1, item2));
			aux++;
		}
	}
	return rules;
}

export default class Problem {
	/// Attributes
	private static rules: Array<Rule> = getRules();
	private static maximumTime: number = 30;

	/// Getters
	public static getMaximumTime(): number {
		return this.maximumTime;
	}

	public static getRule(firstPerson: Item, secondPerson?: Item): Rule {
		for (const rule of this.rules) {
			const travellingPeople = rule.getTravellingPeople();
			if (secondPerson !== undefined) {
				if (travellingPeople.length === 2) {
					if (
						travellingPeople[0] === firstPerson &&
						travellingPeople[1] === secondPerson
					)
						return rule;
					if (
						travellingPeople[0] === secondPerson &&
						travellingPeople[1] === firstPerson
					)
						return rule;
				}
			} else {
				if (travellingPeople.length === 1) {
					if (travellingPeople[0] === firstPerson) return rule;
				}
			}
		}
		throw new Error('Rule not found');
	}

	public static getItemSymbol(item: Item) {
		const itemName = Item[item];
		let itemSymbol = '';
		switch (itemName) {
			case 'Lamp':
				itemSymbol = 'L';
				break;
			case 'Athlete':
				itemSymbol = 'A';
				break;
			case 'Boy':
				itemSymbol = 'G';
				break;
			case 'Lord':
				itemSymbol = 'S';
				break;
			case 'Woman':
				itemSymbol = 'M';
				break;
			case 'Lady':
				itemSymbol = 'V';
				break;
			default:
				break;
		}
		return itemSymbol;
	}

	public static getItemName(item: Item) {
		const itemName = Item[item];
		let itemSymbol = '';
		switch (itemName) {
			case 'Lamp':
				itemSymbol = 'Lâmpada';
				break;
			case 'Athlete':
				itemSymbol = 'Atleta';
				break;
			case 'Boy':
				itemSymbol = 'Garoto';
				break;
			case 'Lord':
				itemSymbol = 'Senhor';
				break;
			case 'Woman':
				itemSymbol = 'Moça';
				break;
			case 'Lady':
				itemSymbol = 'Velha';
				break;
			default:
				break;
		}
		return itemSymbol;
	}

	/// Static methods
	public static isSolution(state: State) {
		const outcome = state.getOutcome();
		return outcome.isTerminal && outcome.win;
	}

	public static exportRulesToDot({
		attributes,
	}: {
		attributes?: GraphAttributesObject;
	}): string {
		attributes = {
			labelloc: 't',
			fontsize: 30,
			splines: 'true',
			nodesep: 0.5,
			ranksep: 3,
			rankdir: 'LR',
			...attributes,
		};

		const dotGraph = new GraphvizDigraph('G', attributes);
		for (const rule of this.rules) {
			const dotNode = rule.toDot();
			dotGraph.addNode(dotNode);
		}

		const infoLabel = `Regras: ${this.rules.length}\n`;
		const label = attributes?.label
			? `${attributes.label}\n${infoLabel}\n\n`
			: infoLabel;
		dotGraph.set('label', label);
		const dot = toDot(dotGraph);
		return dot;
	}

	public static exportViableStatesToDot(): string {
		const graph = new Graph();
		let node = graph.addNode(new State());
		for (let i = 0; i < graph.getNodesAmmount(); i++) {
			node = graph.getNode(i);
			if (node === null) continue;
			const validRules = node.getState().getValidRules(true);
			for (const rule of validRules) {
				const newState = rule.transpose(node.getState());
				let newNode: GraphNode | null = graph.searchNode(newState);
				if (newNode === null) {
					newNode = graph.addNode(newState);
				}
			}
		}
		const dotGraph = graph.toDot({attributes: {label: `Estados viáveis`}});
		return dotGraph;
	}

	public static exportSearchSpaceToDot(): string {
		const graph = new Graph();
		let node = graph.addNode(new State());
		for (let i = 0; i < graph.getNodesAmmount(); i++) {
			node = graph.getNode(i);
			if (node === null) continue;
			graph.createValidTransitions(node);
		}
		const dotGraph = graph.toDot({attributes: {label: `Espaço de busca`}});
		return dotGraph;
	}
}
