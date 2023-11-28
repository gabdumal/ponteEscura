import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Tree from '../engine/Tree/Tree.js';
import TreeNode from '../engine/Tree/TreeNode.js';
import ListsSearch from '../engine/Search/ListsSearch.js';

interface ListsSearchProcedureProps {
	searchAlgorithm: ListsSearch;
	searchAlgorithmSafeName: string;
}
export default function ListsSearchProcedure(props: ListsSearchProcedureProps) {
	useEffect(() => {
		const solutionPath = props.searchAlgorithm.search();
		let solutionPathNodes: Array<TreeNode> = [];
		if (solutionPath !== null) {
			solutionPathNodes.push(props.searchAlgorithm.getTree().getRoot());
			solutionPath.forEach(edge =>
				solutionPathNodes.push(edge.getTargetNode() as TreeNode),
			);
		}

		const directory = `images/${props.searchAlgorithmSafeName}`;
		fs.mkdirSync(directory, {recursive: true});

		const dotTreeString = props.searchAlgorithm
			.getTree()
			.exportToDot({solutionPathNodes});
		Tree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');

		const dotOpenNodesString = Tree.exportNodesListToDot(
			props.searchAlgorithm.getOpenNodes(),
		);
		Tree.exportToFile(dotOpenNodesString, `${directory}/openNodes`, 'svg');

		const dotClosedNodesString = Tree.exportNodesListToDot(
			props.searchAlgorithm.getClosedNodes(),
		);
		Tree.exportToFile(dotClosedNodesString, `${directory}/closedNodes`, 'svg');

		const currentNode = props.searchAlgorithm.getCurrentNode(false);
		if (currentNode !== null) {
			const dotCurrentNodeString = Tree.exportNodesListToDot([currentNode]);
			Tree.exportToFile(
				dotCurrentNodeString,
				`${directory}/currentNode`,
				'svg',
			);
		}
	}, []);

	return (
		<Box flexDirection="column">
			<Text>Executando...</Text>
		</Box>
	);
}
