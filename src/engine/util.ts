import {Item} from '../types.ts';

export function getItemSymbol(item: Item) {
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

export function getItemName(item: Item) {
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
