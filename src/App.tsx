import React from 'react';
import {Box, Text} from 'ink';
import CommonGame from './interface/CommonGame.jsx';
import SelectInput from 'ink-select-input';
import DynamicTreeGame from './interface/DynamicTreeGame.jsx';
import UninformedSearchProcedure from './interface/UninformedSearchProcedure.jsx';
import WeightedUninformedSearchProcedure from './interface/InformedSearchProcedure.tsx';
import BacktrackingSearchProcedure from './interface/BacktrackingSearchProcedure.jsx';

export enum Option {
	CommonGame,
	DynamicTreeGame,
	Backtracking,
	BreadthFirstSearch,
	DepthFirstSearch,
	OrderedSearch,
}

export default function App() {
	const [selectedOption, setSelectedOption] = React.useState<Option>();
	const options = [
		{
			label: 'Jogo Comum',
			value: Option.CommonGame,
		},
		{
			label: 'Árvore Dinâmica',
			value: Option.DynamicTreeGame,
		},
		{
			label: 'Backtracking',
			value: Option.Backtracking,
		},
		{
			label: 'Busca em Largura',
			value: Option.BreadthFirstSearch,
		},
		{
			label: 'Busca em Profundidade',
			value: Option.DepthFirstSearch,
		},
		{
			label: 'Busca Ordenada',
			value: Option.OrderedSearch,
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
		case Option.Backtracking:
			interfaceComponent = <BacktrackingSearchProcedure />;
			break;
		case Option.BreadthFirstSearch:
			interfaceComponent = (
				<UninformedSearchProcedure
					searchAlgorithm={Option.BreadthFirstSearch}
				/>
			);
			break;
		case Option.DepthFirstSearch:
			interfaceComponent = (
				<UninformedSearchProcedure searchAlgorithm={Option.DepthFirstSearch} />
			);
			break;
		case Option.OrderedSearch:
			interfaceComponent = (
				<WeightedUninformedSearchProcedure
					searchAlgorithm={Option.OrderedSearch}
				/>
			);
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
