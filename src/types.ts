export enum Item {
    Lamp = 0,
	Athlete = 1,
	Boy = 3,
	Lord = 6,
	Woman = 8,
	Lady = 12,
}

export type Outcome = {
	isTerminal: boolean,
	win: boolean,
}