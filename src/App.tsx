import React from 'react';
import {Box, Text} from 'ink';
import CommonGame from './interface/CommonGame.tsx';
import SelectInput from 'ink-select-input';
import DynamicTreeGame from './interface/DynamicTreeGame.tsx';

enum Option {
	CommonGame,
	DynamicTreeGame,
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
			label: 'Árvore dinâmica',
			value: Option.DynamicTreeGame,
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
			interfaceComponent = <CommonGame />;
			break;
		case Option.DynamicTreeGame:
			interfaceComponent = <DynamicTreeGame />;
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
