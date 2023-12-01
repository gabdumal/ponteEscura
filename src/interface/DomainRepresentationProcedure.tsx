import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Option} from '../App.js';
import BasicStructure from '../engine/Structure/Basic/BasicStructure.js';
import Problem from '../engine/Domain/Problem.js';

interface DomainRepresentationProcedureProps {
	representation: Option.Rules | Option.States | Option.SearchSpace;
}
export default function DomainRepresentationProcedure(
	props: DomainRepresentationProcedureProps,
) {
	useEffect(() => {
		let representationSafeName: string;
		let dotString = '';

		if (props.representation === Option.Rules) {
			representationSafeName = 'Rules';
			dotString = Problem.exportRulesToDot({});
		} else if (props.representation === Option.States) {
			representationSafeName = 'States';
			dotString = Problem.exportViableStatesToDot();
		} else {
			representationSafeName = 'SearchSpace';
			dotString = Problem.exportSearchSpaceToDot();
		}

		const directory = `images/`;
		fs.mkdirSync(directory, {recursive: true});
		BasicStructure.exportToFile(
			dotString,
			`${directory}/${representationSafeName}`,
			'svg',
		);
	}, []);

	return (
		<Box flexDirection="column">
			<Text>Executando...</Text>
		</Box>
	);
}
