import Rule from './Rule.ts';

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

	/// Getters
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
}
