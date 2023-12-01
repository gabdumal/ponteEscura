import React from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import CommonGame from './interface/CommonGame.jsx';
import DynamicTreeGame from './interface/DynamicTreeGame.jsx';
import UninformedSearchProcedure from './interface/UninformedSearchProcedure.jsx';
import WeightedUninformedSearchProcedure from './interface/InformedSearchProcedure.jsx';
import BacktrackingSearchProcedure from './interface/BacktrackingSearchProcedure.jsx';
import DomainRepresentationProcedure from './interface/DomainRepresentationProcedure.jsx';

export enum Option {
	CommonGame,
	DynamicTreeGame,
	Backtracking,
	BreadthFirstSearch,
	DepthFirstSearch,
	OrderedSearch,
	GreedySearch,
	AStarSearch,
	Rules,
	States,
	SearchSpace,
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
		{
			label: 'Busca Gulosa',
			value: Option.GreedySearch,
		},
		{
			label: 'Busca A*',
			value: Option.AStarSearch,
		},
		{
			label: 'Regras',
			value: Option.Rules,
		},
		{
			label: 'Estados',
			value: Option.States,
		},
		{
			label: 'Espaço de Busca',
			value: Option.SearchSpace,
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
		case Option.GreedySearch:
			interfaceComponent = (
				<WeightedUninformedSearchProcedure
					searchAlgorithm={Option.GreedySearch}
				/>
			);
			break;
		case Option.AStarSearch:
			interfaceComponent = (
				<WeightedUninformedSearchProcedure
					searchAlgorithm={Option.AStarSearch}
				/>
			);
			break;
		case Option.Rules:
			interfaceComponent = (
				<DomainRepresentationProcedure representation={Option.Rules} />
			);
			break;
		case Option.States:
			interfaceComponent = (
				<DomainRepresentationProcedure representation={Option.States} />
			);
			break;
		case Option.SearchSpace:
			interfaceComponent = (
				<DomainRepresentationProcedure representation={Option.SearchSpace} />
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
