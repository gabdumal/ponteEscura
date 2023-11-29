import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Tree from '../engine/Tree/Tree.js';
import TreeNode from '../engine/Tree/TreeNode.js';
import TreeEdge from '../engine/Tree/TreeEdge.ts';
import {Option} from '../App.tsx';
import BreadthFirstSearch from '../engine/Search/BreadthFirstSearch.ts';
import DepthFirstSearch from '../engine/Search/DepthFirstSearch.ts';
import ListsSearch from '../engine/Search/ListsSearch.ts';

interface ListsSearchProcedureProps {
	searchAlgorithm: Option.BreadthFirstSearch | Option.DepthFirstSearch;
}
export default function ListsSearchProcedure(props: ListsSearchProcedureProps) {
	useEffect(() => {
		const sortingFunction = (a: TreeEdge, b: TreeEdge) => {
			return a.getRule().getElapsedTime() - b.getRule().getElapsedTime();
		};

		let searchAlgorithm: ListsSearch;
		let searchAlgorithmSafeName: string;
		if (props.searchAlgorithm === Option.BreadthFirstSearch) {
			searchAlgorithm = new BreadthFirstSearch(sortingFunction);
			searchAlgorithmSafeName = BreadthFirstSearch.getSafeAlgorithmName();
		} else {
			searchAlgorithm = new DepthFirstSearch(sortingFunction);
			searchAlgorithmSafeName = DepthFirstSearch.getSafeAlgorithmName();
		}

		const solutionPath = searchAlgorithm.search();
		let solutionPathNodes: Array<TreeNode> = [];
		if (solutionPath !== null) {
			solutionPathNodes.push(searchAlgorithm.getTree().getRoot());
			solutionPath.forEach(edge =>
				solutionPathNodes.push(edge.getTargetNode() as TreeNode),
			);
		}

		const directory = `images/${searchAlgorithmSafeName}`;
		fs.mkdirSync(directory, {recursive: true});

		const dotTreeString = searchAlgorithm
			.getTree()
			.exportToDot({solutionPathNodes});
		Tree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');

		const dotOpenNodesString = Tree.exportNodesListToDot(
			searchAlgorithm.getOpenNodes(),
		);
		Tree.exportToFile(dotOpenNodesString, `${directory}/openNodes`, 'svg');

		const dotClosedNodesString = Tree.exportNodesListToDot(
			searchAlgorithm.getClosedNodes(),
		);
		Tree.exportToFile(dotClosedNodesString, `${directory}/closedNodes`, 'svg');

		const currentNode = searchAlgorithm.getCurrentNode(false);
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
