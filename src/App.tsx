import React from 'react';
import {Box, Text} from 'ink';
import Scenery from './game/Scenery.tsx';

export default function App() {
	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold inverse color={'yellowBright'}>
					Ponte Escura
				</Text>
			</Box>
			<Scenery />
			<Text>Escolha uma regra:</Text>
		</Box>
	);
}
