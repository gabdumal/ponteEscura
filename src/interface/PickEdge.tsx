import React from 'react';
import SelectInput from 'ink-select-input';
import BasicEdge from '../engine/Structure/Basic/BasicEdge.js';

interface PickEdgeProps {
	targetEdges: Array<BasicEdge>;
	handleSelect: (edge: BasicEdge) => void;
}
export default function PickEdge(props: PickEdgeProps) {
	const options = [];
	let aux = 0;
	for (const targetEdge of props.targetEdges) {
		const rule = targetEdge.getRule();
		const travellingPeople = rule.getTravellingPeopleNames();
		let travellingPeopleContent = '[' + travellingPeople[0];
		if (travellingPeople.length > 1)
			travellingPeopleContent += ', ' + travellingPeople[1];
		travellingPeopleContent += ']';
		const value = `${travellingPeopleContent} (${rule.getElapsedTime()})`;
		options.push({label: value, value: targetEdge, key: aux.toString()});
		aux++;
	}

	options.sort((a, b) => {
		const aTime = a.value.getRule().getElapsedTime();
		const bTime = b.value.getRule().getElapsedTime();
		return aTime - bTime;
	});

	return (
		<SelectInput
			items={options}
			onSelect={item => props.handleSelect(item.value)}
		/>
	);
}
