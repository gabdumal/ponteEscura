import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './game/Scenery.tsx';
import State from './engine/State.ts';
import {Item} from './types.ts';
import Rule from './engine/Rule.ts';

export default function App() {
	const [state, setState] = React.useState<State>(new State());
	const rule = new Rule(Item.Athlete, Item.Lady);
	const transposedState = rule.transpose(state);

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold inverse color={'yellowBright'}>
					Ponte Escura
				</Text>
			</Box>
			<Scenery state={state} />
			<Text>Escolha uma regra:</Text>
			<Scenery state={transposedState} />
		</Box>
	);
}
