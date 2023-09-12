import React from 'react';
import {Box, Text} from 'ink';

export default function App() {
	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold inverse color={'yellowBright'} >
					Ponte Escura
				</Text>
			</Box>
			<Text>Escolha uma regra:</Text>
		</Box>
	);
}
