import React from 'react';
import {Box, Newline, Text} from 'ink';
import Game from './game/CommonGame.tsx';
import SelectInput from 'ink-select-input';

enum Option {
	CommonGame,
	IrrevocableSearch,
}

export default function App() {
	const [selectedOption, setSelectedOption] = React.useState<Option>();
	const options = [
		{
			label: 'Jogo Comum',
			value: Option.CommonGame,
		},
		{
			label: 'Busca irrevogável',
			value: Option.IrrevocableSearch,
		},
	];

	function handleSelect(option: Option) {
		setSelectedOption(option);
	}

	let interfaceComponent;

	switch (selectedOption) {
		case undefined:
			interfaceComponent = (
				<SelectInput
					items={options}
					onSelect={item => handleSelect(item.value)}
				/>
			);
			break;
		case Option.CommonGame:
			interfaceComponent = <Game />;
			break;
		default:
			break;
	}

	return (
		<Box flexDirection="column">
			<Text bold inverse color={'yellowBright'}>
				Ponte Escura
			</Text>
			<Box flexDirection="column" marginTop={1}>
				{interfaceComponent}
			</Box>
		</Box>
	);
}
