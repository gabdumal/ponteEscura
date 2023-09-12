import {Item} from '../types.ts';

export enum RiverBank {
	Initial,
	Final,
}

export default class State {
	/// Attributes
	private initialRiverBank: Array<Item>;
	private finalRiverBank: Array<Item>;
	private remainingTime: number;

	constructor() {
		this.initialRiverBank = [
			Item.Lamp,
			Item.Athlete,
			Item.Boy,
			Item.Lord,
			Item.Woman,
			Item.Lady,
		];
		this.finalRiverBank = [];
		this.remainingTime = 30;
	}

	/// Getters
	public getRiverBankValues(riverBank: RiverBank): Array<Item> {
		if (riverBank === RiverBank.Initial) return this.initialRiverBank;
		else return this.finalRiverBank;
	}

	public getRiverBankSymbols(riverBank: RiverBank): Array<string> {
		if (riverBank === RiverBank.Initial)
			return this.initialRiverBank.map(item => this.getItemSymbol(item));
		else return this.finalRiverBank.map(item => this.getItemSymbol(item));
	}

	public getRemainingTime(): number {
		return this.remainingTime;
	}

	/// Setters

	/// Methods
	private getItemSymbol(item: Item) {
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
}
