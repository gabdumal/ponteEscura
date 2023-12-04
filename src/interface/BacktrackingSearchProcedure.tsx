import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Rule from '../engine/Domain/Rule.js';
import Tree from '../engine/Structure/Tree/Tree.js';
import TreeNode from '../engine/Structure/Tree/TreeNode.js';
import BacktrackingSearch from '../engine/Search/BacktrackingSearch.js';

export default function BacktrackingSearchProcedure() {
	useEffect(() => {
		function sortingAlgorithm(a: Rule, b: Rule): number {
			// Backtracking works similarly as a FIFO algorithm,
			// so we sort in ascending order
			let delta = a.getElapsedTime() - b.getElapsedTime();
			if (delta === 0) {
				// If the elapsed time is the same, it is better to choose the node with
				// more people
				delta = b.getTravellingPeople().length - a.getTravellingPeople().length;
				if (delta === 0) {
					// If the number of people is the same, it is better to choose the
					// node that takes the slowest person as companion
					delta =
						b.getTravellingPeople().reduce((a, b) => a + b) -
						a.getTravellingPeople().reduce((a, b) => a + b);
				}
			}
			return delta;
		}
		const backtrackingSearch = new BacktrackingSearch(sortingAlgorithm);
		const solutionPath = backtrackingSearch.search();
		let solutionPathNodes: Array<TreeNode> = [];
		if (solutionPath !== null) {
			solutionPathNodes.push(backtrackingSearch.getTree().getRoot());
			solutionPath.forEach(edge =>
				solutionPathNodes.push(edge.getTargetNode() as TreeNode),
			);
		}

		const directory = `images/${BacktrackingSearch.getSafeAlgorithmName()}`;
		fs.mkdirSync(directory, {recursive: true});

		const dotTreeString = backtrackingSearch
			.getTree()
			.toDot({solutionPathNodes});
		Tree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');
	}, []);

	return (
		<Box flexDirection="column">
			<Text>Executando...</Text>
		</Box>
	);
}
