import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './game/Scenery.tsx';
import State from './engine/State.ts';
import PickRule from './game/PickRule.tsx';
import Rule from './engine/Rule.ts';

export default function App() {
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
			<Box marginBottom={1}>
				<Text bold inverse color={'yellowBright'}>
					Ponte Escura
				</Text>
			</Box>
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
