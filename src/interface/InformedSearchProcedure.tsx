import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Option} from '../App.js';
import OrderedTreeNode from '../engine/Structure/OrderedTree/OrderedTreeNode.js';
import OrderedTree from '../engine/Structure/OrderedTree/OrderedTree.js';
import InformedSearch from '../engine/Search/InformedSearch.js';
import OrderedSearch from '../engine/Search/OrderedSearch.js';

interface InformedSearchProcedureProps {
	searchAlgorithm: Option.OrderedSearch;
}
export default function InformedSearchProcedure(
	props: InformedSearchProcedureProps,
) {
	useEffect(() => {
		let searchAlgorithm: InformedSearch;
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

		// const dotOpenNodesString = OrderedTree.exportNodesListToDot(
		// 	searchAlgorithm.getOpenNodes() as Array<OrderedTreeNode>,
		// );
		// OrderedTree.exportToFile(
		// 	dotOpenNodesString,
		// 	`${directory}/openNodes`,
		// 	'svg',
		// );

		const dotClosedNodesString = OrderedTree.exportNodesListToDot(
			searchAlgorithm.getClosedNodes() as Array<OrderedTreeNode>,
		);
		OrderedTree.exportToFile(
			dotClosedNodesString,
			`${directory}/closedNodes`,
			'svg',
		);

		const currentNode = searchAlgorithm.getCurrentNode();
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
