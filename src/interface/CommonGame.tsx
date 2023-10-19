import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './Scenery.js';
import State from '../engine/State.js';
import PickRule from './PickRule.js';
import Rule from '../engine/Rule.js';

export default function CommonGame() {
	const [state, setState] = React.useState<State>(new State());
	const [isTerminal, setIsTerminal] = React.useState<boolean>(false);
	const [victory, setVictory] = React.useState<boolean>(false);
	const validRules = state.getValidRules();

	function handleSelect(rule: Rule) {
		const newState = rule.transpose(state);
		const {isTerminal, win} = newState.getOutcome();
		setIsTerminal(isTerminal);
		setVictory(win);
		setState(newState);
	}

	return (
		<Box flexDirection="column">
			<Scenery state={state} />
			{isTerminal ? (
				<Box>
					<Text bold color={victory ? 'greenBright' : 'redBright'}>
						{victory ? 'Vitória!' : 'Derrota!'}
					</Text>
				</Box>
			) : (
				<Box flexDirection="column">
					<Text>Escolha uma regra:</Text>
					<PickRule validRules={validRules} handleSelect={handleSelect} />
				</Box>
			)}
		</Box>
	);
}
