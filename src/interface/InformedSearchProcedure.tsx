import {cpuUsage} from 'node:process';
import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Option} from '../App.js';
import OrderedTreeNode from '../engine/Structure/OrderedTree/OrderedTreeNode.js';
import OrderedTree from '../engine/Structure/OrderedTree/OrderedTree.js';
import InformedSearch from '../engine/Search/InformedSearch.js';
import OrderedSearch from '../engine/Search/OrderedSearch.js';
import GreedySearch from '../engine/Search/GreedySearch.js';
import AStarSearch from '../engine/Search/AStarSearch.js';

interface InformedSearchProcedureProps {
	searchAlgorithm:
		| Option.OrderedSearch
		| Option.GreedySearch
		| Option.AStarSearch;
}
export default function InformedSearchProcedure(
	props: InformedSearchProcedureProps,
) {
	useEffect(() => {
		let searchAlgorithm: InformedSearch;
		let searchAlgorithmSafeName: string;

		if (props.searchAlgorithm === Option.OrderedSearch) {
			searchAlgorithm = new OrderedSearch();
			searchAlgorithmSafeName = OrderedSearch.getSafeAlgorithmName();
		} else if (props.searchAlgorithm === Option.GreedySearch) {
			searchAlgorithm = new GreedySearch();
			searchAlgorithmSafeName = GreedySearch.getSafeAlgorithmName();
		} else {
			searchAlgorithm = new AStarSearch();
			searchAlgorithmSafeName = AStarSearch.getSafeAlgorithmName();
		}

		let cpuTime = cpuUsage();
		const solutionPath = searchAlgorithm.search();
		cpuTime = cpuUsage(cpuTime);

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

		const dotTreeString = searchAlgorithm.getTree().toDot({
			attributes: {
				label: `Tempo: ${(cpuTime.user + cpuTime.system) / 1000}ms`,
			},
			solutionPathNodes,
		});
		OrderedTree.exportToFile(dotTreeString, `${directory}/tree`, 'svg');

		let openNodes: Array<OrderedTreeNode> = searchAlgorithm
			.getOpenEdges()
			.map(edge => edge.getTargetNode() as OrderedTreeNode);
		const dotOpenNodesString = OrderedTree.exportNodesListToDot(openNodes);
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
