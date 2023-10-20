import Problem, {Item} from './Problem.ts';
import State, {RiverBank} from './State.ts';

export default class Rule {
	/// Attributes
	private id: number;
	private travellingPeople: Array<Item>;

	/// Constructor
	constructor(id: number, firstPerson: Item, secondPerson?: Item) {
		this.id = id;
		this.travellingPeople = secondPerson
			? [firstPerson, secondPerson].sort((a, b) => a - b)
			: [firstPerson];
	}

	/// Getters
	public getId(): number {
		return this.id;
	}

	public getTravellingPeople(): Array<Item> {
		return this.travellingPeople;
	}

	public getTravellingPeopleNames(): Array<string> {
		return this.travellingPeople.map(item => Problem.getItemName(item));
	}

	public getTravellingPeopleSymbols(): Array<string> {
		return this.travellingPeople.map(item => Problem.getItemSymbol(item));
	}

	public getElapsedTime(): number {
		return Math.max(...this.travellingPeople);
	}

	public getPlainText(): string {
		return `[${this.getTravellingPeopleSymbols().join(
			', ',
		)}] (${this.getElapsedTime()})`;
	}

	/// Setters

	/// Methods
	public transpose(state: State): State {
		const lampPosition =
			state.getRiverBankItems(RiverBank.Initial).indexOf(Item.Lamp) !== -1
				? RiverBank.Initial
				: RiverBank.Final;
		const transposedState = new State();
		const currentRiverBank: Array<Item> = [];
		const oppositeRiverBank: Array<Item> = [];

		// Clone current river bank, except for the lamp and the people who are travelling
		state.getRiverBankItems(lampPosition).forEach(item => {
			if (this.travellingPeople.indexOf(item) === -1 && item !== Item.Lamp)
				currentRiverBank.push(item);
		});

		// Clone opposite river bank, and include the lamp and the people who are travelling
		state
			.getRiverBankItems(State.getOppositeRiverBank(lampPosition))
			.forEach(item => {
				oppositeRiverBank.push(item);
			});
		oppositeRiverBank.push(Item.Lamp);
		oppositeRiverBank.push(...this.travellingPeople);

		// Update state
		transposedState.setRiverBankItems(lampPosition, currentRiverBank);
		transposedState.setRiverBankItems(
			lampPosition === RiverBank.Initial ? RiverBank.Final : RiverBank.Initial,
			oppositeRiverBank,
		);
		transposedState.setRemainingTime(
			state.getRemainingTime() - this.getElapsedTime(),
		);

		return transposedState;
	}
}
