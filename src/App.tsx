import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './game/Scenery.tsx';
import State from './engine/State.ts';
import PickRule from './game/PickRule.tsx';
import Rule from './engine/Rule.ts';

export default function App() {
	const [state, setState] = React.useState<State>(new State());
	const validRules = state.getValidRules();

	function handleSelect(rule: Rule) {
		const newState = rule.transpose(state);
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
			<Text>Escolha uma regra:</Text>
			<PickRule validRules={validRules} handleSelect={handleSelect} />
		</Box>
	);
}
