import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Scenery from './Scenery.js';
import State from '../engine/State.js';
import Tree from '../engine/Tree/Tree.js';
import TreeNode from '../engine/Tree/TreeNode.js';
import TreeEdge from '../engine/Tree/TreeEdge.js';
import PickEdge from './PickEdge.js';
import ListsSearch from '../engine/Search/ListsSearch.ts';

interface ListsSearchProcedureProps {
	searchAlgorithm: ListsSearch;
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
		const dotTreeString = props.searchAlgorithm
			.getTree()
			.exportToDot({solutionPathNodes});
		const dotOpenNodesString = Tree.exportNodesListToDot(
			props.searchAlgorithm.getOpenNodes(),
		);
		const dotClosedNodesString = Tree.exportNodesListToDot(
			props.searchAlgorithm.getClosedNodes(),
		);

		const directory = `images/${props.searchAlgorithm.getSafeAlgorithmName()}`;
		fs.mkdirSync(directory, {recursive: true});
		Tree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');
		Tree.exportToFile(dotOpenNodesString, `${directory}/openNodes`, 'svg');
		Tree.exportToFile(dotClosedNodesString, `${directory}/closedNodes`, 'svg');
	}, []);

	return (
		<Box flexDirection="column">
			<Text>Executando...</Text>
		</Box>
	);
}
