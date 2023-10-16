import {Item} from '../types.ts';
import Rule from './Rule.ts';

export enum RiverBank {
	Initial,
	Final,
}

export default class State {
	/// Attributes
	private initialRiverBank: Array<Item>;
	private finalRiverBank: Array<Item>;
	private remainingTime: number;

	/// Constructor
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
	public getRiverBankItems(riverBank: RiverBank): Array<Item> {
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
	public setRiverBankItems(
		riverBank: RiverBank,
		items: Array<Item>
	): void {
		if (riverBank === RiverBank.Initial) this.initialRiverBank = items;
		else this.finalRiverBank = items;
	}

	public setRemainingTime(remainingTime: number): void {
		this.remainingTime = remainingTime;
	}

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

	getValidRules(){
		const lampPosition = this.getLampPosition();
		const currentRiverBank = this.getRiverBankItems(lampPosition);

		// Note: JavaScript weakly nature ignores Lamp, because it is set to 0, so rules with Lamp are created as a single person travelling
		const validRules : Array<Rule> = [];
		for (let i = currentRiverBank.length - 1; i >= 0; i--) {
			const item1 = currentRiverBank[i];
			for (let j = i - 1; j >= 0; j--) {
				const item2 = currentRiverBank[j];
				validRules.push(new Rule(item1, item2));
			}
		}

		return validRules;
	}

	getLampPosition(){
		return this.initialRiverBank.indexOf(Item.Lamp) !== -1 ? RiverBank.Initial : RiverBank.Final;
	}

	/// Static methods
	static getOppositeRiverBank(lampPosition: RiverBank){
		return lampPosition === RiverBank.Initial ? RiverBank.Final : RiverBank.Initial;
	}

}