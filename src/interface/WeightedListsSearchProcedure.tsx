import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Option} from '../App.js';
import OrderedSearch from '../engine/Search/OrderedSearch.js';
import ListsSearch from '../engine/Search/ListsSearch.js';
import OrderedTree from '../engine/OrderedTree/OrderedTree.js';
import OrderedTreeNode from '../engine/OrderedTree/OrderedTreeNode.js';

interface ListsSearchProcedureProps {
	searchAlgorithm: Option.OrderedSearch;
}
export default function ListsSearchProcedure(props: ListsSearchProcedureProps) {
	useEffect(() => {
		let searchAlgorithm: ListsSearch;
		let searchAlgorithmSafeName: string;
		searchAlgorithm = new OrderedSearch();
		searchAlgorithmSafeName = OrderedSearch.getSafeAlgorithmName();

		const solutionPath = searchAlgorithm.search();
		let solutionPathNodes: Array<OrderedTreeNode> = [];
		if (solutionPath !== null) {
			solutionPathNodes.push(
				searchAlgorithm.getTree().getRoot() as OrderedTreeNode,
			);
			solutionPath.forEach(edge =>
				solutionPathNodes.push(edge.getTargetNode() as OrderedTreeNode),
			);
		}

		const directory = `images/${searchAlgorithmSafeName}`;
		fs.mkdirSync(directory, {recursive: true});

		const dotTreeString = searchAlgorithm
			.getTree()
			.exportToDot({solutionPathNodes});
		OrderedTree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');

		const dotOpenNodesString = OrderedTree.exportNodesListToDot(
			searchAlgorithm.getOpenNodes() as Array<OrderedTreeNode>,
		);
		OrderedTree.exportToFile(
			dotOpenNodesString,
			`${directory}/openNodes`,
			'svg',
		);

		const dotClosedNodesString = OrderedTree.exportNodesListToDot(
			searchAlgorithm.getClosedNodes() as Array<OrderedTreeNode>,
		);
		OrderedTree.exportToFile(
			dotClosedNodesString,
			`${directory}/closedNodes`,
			'svg',
		);

		const currentNode = searchAlgorithm.getCurrentNode(false);
		if (currentNode !== null) {
			const dotCurrentNodeString = OrderedTree.exportNodesListToDot([
				currentNode as OrderedTreeNode,
			]);
			OrderedTree.exportToFile(
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
