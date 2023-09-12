import React from 'react';
import {Box, Text} from 'ink';
import State, {RiverBank} from '../engine/State.ts';

export default function Scenery() {
	const [state, setState] = React.useState<State>();

	React.useEffect(() => {
		const state = new State();
		setState(state);
	}, []);

	let initialRiverBankContent = '';
	let finalRiverBankContent = '';
	let remainingTime = '';

	if (state) {
		const initialRiverBank = state.getRiverBankSymbols(RiverBank.Initial);
		const finalRiverBank = state.getRiverBankSymbols(RiverBank.Final);
		remainingTime = state.getRemainingTime().toString();

		if (initialRiverBank.length > 0) {
			for (let i = 0; i < initialRiverBank.length - 1; i++)
				initialRiverBankContent += initialRiverBank[i] + ', ';
			initialRiverBankContent += initialRiverBank[initialRiverBank.length - 1];
		}

		if (finalRiverBank.length > 0) {
			for (let i = 0; i < finalRiverBank.length - 1; i++)
				finalRiverBankContent += finalRiverBank[i] + ', ';
			finalRiverBankContent += finalRiverBank[finalRiverBank.length - 1];
		}
	}

	return (
		<Box flexDirection="row" marginBottom={1} columnGap={2}>
			<Text>{'[ ' + initialRiverBankContent + ' ]'}</Text>
			<Text>{'[ ' + finalRiverBankContent + ' ]'}</Text>
			<Text>{'(' + remainingTime + ')'}</Text>
		</Box>
	);
}
