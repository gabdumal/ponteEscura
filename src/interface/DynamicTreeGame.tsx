import fs from 'fs';
import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Scenery from './Scenery.js';
import PickEdge from './PickEdge.jsx';
import State from '../engine/Domain/State.js';
import Tree from '../engine/Structure/Tree/Tree.js';
import TreeNode from '../engine/Structure/Tree/TreeNode.js';
import TreeEdge from '../engine/Structure/Tree/TreeEdge.js';

export default function DynamicTreeGame() {
	const [tree, setTree] = React.useState<Tree>();
	const [currentNode, setCurrentNode] = React.useState<TreeNode>();
	const [isTerminal, setIsTerminal] = React.useState<boolean>(false);
	const [victory, setVictory] = React.useState<boolean>(false);

	const sortingFunction = (a: TreeEdge, b: TreeEdge) => {
		return a.getRule().getElapsedTime() - b.getRule().getElapsedTime();
	};

	useEffect(() => {
		const state = new State();
		const tree = new Tree(state);
		const root = tree.getRoot();
		const outcome = root.getState().getOutcome();
		tree.createValidTransitions(root, sortingFunction);
		setIsTerminal(outcome.isTerminal);
		setVictory(outcome.win);
		setTree(tree);
		setCurrentNode(root);
	}, []);

	function handleSelect(edge: TreeEdge) {
		if (tree === undefined) throw new Error('Tree is undefined');
		const targetNode = edge.getTargetNode() as TreeNode;
		const outcome = targetNode.getState().getOutcome();
		setCurrentNode(targetNode);
		if (outcome.isTerminal !== true)
			tree.createValidTransitions(targetNode, sortingFunction);
		if (
			outcome.isTerminal === true ||
			targetNode.getTargetEdges().length === 0
		) {
			setIsTerminal(true);
			setVictory(outcome.win);
			const solutionPath = Tree.getAscendingPath(targetNode);
			let solutionPathNodes: Array<TreeNode> = [];
			if (solutionPath !== null) {
				solutionPathNodes.push(solutionPath[0].getSourceNode() as TreeNode);
				solutionPath.forEach(edge =>
					solutionPathNodes.push(edge.getTargetNode() as TreeNode),
				);
			}

			const directory = `images/Dynamic_Tree_Game`;
			fs.mkdirSync(directory, {recursive: true});

			const dot = tree.toDot({solutionPathNodes: solutionPathNodes});
			Tree.exportToFile(dot, `${directory}/Dynamic_Tree_Game`, 'svg');
		}
	}

	if (currentNode === undefined) return <Text>Carregando...</Text>;
	else
		return (
			<Box flexDirection="column">
				<Scenery state={currentNode.getState()} />
				{isTerminal ? (
					<Box>
						<Text bold color={victory ? 'greenBright' : 'redBright'}>
							{victory ? 'Vitória!' : 'Derrota!'}
						</Text>
					</Box>
				) : (
					<Box flexDirection="column">
						<Text>Escolha uma regra:</Text>
						<PickEdge
							targetEdges={currentNode.getTargetEdges()}
							handleSelect={handleSelect}
						/>
					</Box>
				)}
			</Box>
		);
}
