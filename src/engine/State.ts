import {Outcome} from '../types.ts';
import Problem, {Item} from './Problem.ts';
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
		].sort((a, b) => a - b);
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
			return this.initialRiverBank.map(item => Problem.getItemSymbol(item));
		else return this.finalRiverBank.map(item => Problem.getItemSymbol(item));
	}

	public getRemainingTime(): number {
		return this.remainingTime;
	}

	public getValidRules() {
		const lampPosition = this.getLampPosition();
		const currentRiverBank = this.getRiverBankItems(lampPosition);

		const validRules: Array<Rule> = [];
		let currentRule;
		for (let i = currentRiverBank.length - 1; i >= 0; i--) {
			const item1 = currentRiverBank[i];
			if (item1 === Item.Lamp) continue;
			currentRule = Problem.getRule(item1);
			if (this.remainingTime - currentRule.getElapsedTime() < 0) continue;
			validRules.push(currentRule);
			for (let j = i - 1; j >= 0; j--) {
				const item2 = currentRiverBank[j];
				if (item2 === Item.Lamp) continue;
				currentRule = Problem.getRule(item1, item2);
				if (this.remainingTime - currentRule.getElapsedTime() < 0) continue;
				validRules.push(currentRule);
			}
		}

		return validRules;
	}

	public getLampPosition() {
		return this.initialRiverBank.indexOf(Item.Lamp) !== -1
			? RiverBank.Initial
			: RiverBank.Final;
	}

	public getOutcome(): Outcome {
		if (this.initialRiverBank.length === 0) {
			if (this.remainingTime >= 0) return {isTerminal: true, win: true};
			else return {isTerminal: true, win: false};
		} else {
			if (this.remainingTime <= 0) return {isTerminal: true, win: false};
			else return {isTerminal: false, win: false};
		}
	}

	public getPlainTextScenery() {
		const initialRiverBank = this.getRiverBankSymbols(RiverBank.Initial);
		const finalRiverBank = this.getRiverBankSymbols(RiverBank.Final);

		const initialRiverBankString = initialRiverBank.join(' ');
		const finalRiverBankString = finalRiverBank.join(' ');

		return `[${initialRiverBankString}] [${finalRiverBankString}] (${this.remainingTime})`;
	}

	/// Setters
	public setRiverBankItems(riverBank: RiverBank, items: Array<Item>): void {
		const sortedItems = items.slice().sort((a, b) => a - b);
		if (riverBank === RiverBank.Initial) this.initialRiverBank = sortedItems;
		else this.finalRiverBank = sortedItems;
	}

	public setRemainingTime(remainingTime: number): void {
		this.remainingTime = remainingTime;
	}

	/// Methods
	public equalsByItems(state: State): boolean {
		const thisInitialRiverBank = this.getRiverBankItems(RiverBank.Initial);
		const thisFinalRiverBank = this.getRiverBankItems(RiverBank.Final);

		const otherInitialRiverBank = state.getRiverBankItems(RiverBank.Initial);
		const otherFinalRiverBank = state.getRiverBankItems(RiverBank.Final);

		if (thisInitialRiverBank.length !== otherInitialRiverBank.length)
			return false;
		if (thisFinalRiverBank.length !== otherFinalRiverBank.length) return false;

		for (let i = 0; i < thisInitialRiverBank.length; i++) {
			if (thisInitialRiverBank[i] !== otherInitialRiverBank[i]) return false;
		}

		for (let i = 0; i < thisFinalRiverBank.length; i++) {
			if (thisFinalRiverBank[i] !== otherFinalRiverBank[i]) return false;
		}

		return true;
	}

	/// Static methods
	static getOppositeRiverBank(lampPosition: RiverBank) {
		return lampPosition === RiverBank.Initial
			? RiverBank.Final
			: RiverBank.Initial;
	}
}
