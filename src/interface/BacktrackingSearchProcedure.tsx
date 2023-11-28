import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Tree from '../engine/Tree/Tree.js';
import TreeNode from '../engine/Tree/TreeNode.js';
import BacktrackingSearch from '../engine/Search/BacktrackingSearch.js';
import Rule from '../engine/Rule.js';

export default function BacktrackingSearchProcedure() {
	useEffect(() => {
		function sortingAlgorithm(a: Rule, b: Rule): number {
			if (a.getElapsedTime() < b.getElapsedTime()) {
				return -1;
			}
			if (a.getElapsedTime() > b.getElapsedTime()) {
				return 1;
			}
			return 0;
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
			.exportToDot({solutionPathNodes});
		Tree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');
	}, []);

	return (
		<Box flexDirection="column">
			<Text>Executando...</Text>
		</Box>
	);
}
