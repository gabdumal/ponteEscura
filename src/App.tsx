import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './game/Scenery.tsx';
import State from './engine/State.ts';
import PickRule from './game/PickRule.tsx';

export default function App() {
	const [state, setState] = React.useState<State>(new State());
	const validRules = state.getValidRules();

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold inverse color={'yellowBright'}>
					Ponte Escura
				</Text>
			</Box>
			<Scenery state={state} />
			<Text>Escolha uma regra:</Text>
			<PickRule validRules={validRules} />
		</Box>
	);
}
