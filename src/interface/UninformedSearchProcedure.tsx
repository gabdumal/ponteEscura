import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {Option} from '../App.js';
import Tree from '../engine/Structure/Tree/Tree.js';
import TreeNode from '../engine/Structure/Tree/TreeNode.js';
import TreeEdge from '../engine/Structure/Tree/TreeEdge.js';
import BreadthFirstSearch from '../engine/Search/BreadthFirstSearch.js';
import DepthFirstSearch from '../engine/Search/DepthFirstSearch.js';
import UninformedSearch from '../engine/Search/UninformedSearch.js';

interface UninformedSearchProcedureProps {
	searchAlgorithm: Option.BreadthFirstSearch | Option.DepthFirstSearch;
}
export default function UninformedSearchProcedure(
	props: UninformedSearchProcedureProps,
) {
	useEffect(() => {
		let searchAlgorithm: UninformedSearch;
		let searchAlgorithmSafeName: string;
		if (props.searchAlgorithm === Option.BreadthFirstSearch) {
			const sortingFunction = (a: TreeEdge, b: TreeEdge) => {
				// Breadth first search is a FIFO algorithm, so we sort in ascending order
				let delta = a.getRule().getElapsedTime() - b.getRule().getElapsedTime();
				if (delta === 0) {
					// If the elapsed time is the same, it is better to choose the node with more people
					delta =
						b.getRule().getTravellingPeople().length -
						a.getRule().getTravellingPeople().length;
					if (delta === 0) {
						// If the number of people is the same, it is better to choose the node that
						// takes the slowest person as companion
						delta =
							b
								.getRule()
								.getTravellingPeople()
								.reduce((a, b) => a + b) -
							a
								.getRule()
								.getTravellingPeople()
								.reduce((a, b) => a + b);
					}
				}
				return delta;
			};
			searchAlgorithm = new BreadthFirstSearch(sortingFunction);
			searchAlgorithmSafeName = BreadthFirstSearch.getSafeAlgorithmName();
		} else {
			const sortingFunction = (a: TreeEdge, b: TreeEdge) => {
				// Depth first search is a LIFO algorithm, so we sort in descending order
				let delta = b.getRule().getElapsedTime() - a.getRule().getElapsedTime();
				if (delta === 0) {
					// If the elapsed time is the same, it is better to choose the node with more people
					delta =
						a.getRule().getTravellingPeople().length -
						b.getRule().getTravellingPeople().length;
					if (delta === 0) {
						// If the number of people is the same, it is better to choose the node that
						// takes the slowest person as companion
						delta =
							a
								.getRule()
								.getTravellingPeople()
								.reduce((a, b) => a + b) -
							b
								.getRule()
								.getTravellingPeople()
								.reduce((a, b) => a + b);
					}
				}
				return delta;
			};
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

		const dotTreeString = searchAlgorithm.getTree().toDot({solutionPathNodes});
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
