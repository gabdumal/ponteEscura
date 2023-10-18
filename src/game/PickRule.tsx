import React from 'react';
import SelectInput from 'ink-select-input';
import Rule from '../engine/Rule.ts';

interface PickRuleProps {
	validRules: Array<Rule>;
	handleSelect: (rule: Rule) => void;
}
export default function PickRule(props: PickRuleProps) {
	const validRules = props.validRules;
	const options = [];

	let aux = 0;
	for (const rule of validRules) {
		const travellingPeople = rule.getTravellingPeopleSymbols();
		let travellingPeopleContent = '[' + travellingPeople[0];
		if (travellingPeople.length > 1)
			travellingPeopleContent += ', ' + travellingPeople[1];
		travellingPeopleContent += ']';
		const value = `${travellingPeopleContent} (${rule.getElapsedTime()})`;
		options.push({label: value, value: rule, key: aux.toString()});
		aux++;
	}

	options.sort((a, b) => {
		const aTime = parseInt(a.label.split('(')[1].split(')')[0]);
		const bTime = parseInt(b.label.split('(')[1].split(')')[0]);
		return aTime - bTime;
	});

	return (
		<SelectInput
			items={options}
			onSelect={item => props.handleSelect(item.value)}
		/>
	);
}
