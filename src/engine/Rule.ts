import { Item } from "../types.ts";
import State, { RiverBank } from "./State.ts";

export default class Rule{
	/// Attributes
	private travellingPeople : Array<Item>;

	/// Constructor
	constructor(firstPerson: Item, secondPerson?:Item) {
		this.travellingPeople = secondPerson? [firstPerson, secondPerson] : [firstPerson];
	}

	/// Getters
	getTravellingPeople():Array<Item>{
		return this.travellingPeople;
	}

	getElapsedTime():number{
		return Math.max(...this.travellingPeople);
	}

	/// Setters

	/// Methods
	public transpose(state: State): State{
		const lampPosition = state.getRiverBankItems(RiverBank.Initial).indexOf(Item.Lamp) !== -1 ? RiverBank.Initial : RiverBank.Final;
		const transposedState = new State();
		const currentRiverBank : Array<Item> = [];
		const oppositeRiverBank : Array<Item> = [];

		// Clone current river bank, except for the lamp and the people who are travelling
		state.getRiverBankItems(lampPosition).forEach(item => {
			if(this.travellingPeople.indexOf(item) === -1 && item !== Item.Lamp)
				currentRiverBank.push(item);
		});

		// Clone opposite river bank, and include the lamp and the people who are travelling
		state.getRiverBankItems(lampPosition === RiverBank.Initial? RiverBank.Final : RiverBank.Initial).forEach(item => {
				oppositeRiverBank.push(item);
			});
		oppositeRiverBank.push(Item.Lamp);
		oppositeRiverBank.push(...this.travellingPeople);


		// Update state
		transposedState.setRiverBankItems(
			lampPosition,
			currentRiverBank
		);
		transposedState.setRiverBankItems(
			lampPosition === RiverBank.Initial ? RiverBank.Final : RiverBank.Initial,
			oppositeRiverBank
		);
		transposedState.setRemainingTime(state.getRemainingTime() - this.getElapsedTime());

		return transposedState;
	}

}
