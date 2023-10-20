import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import Scenery from './Scenery.js';
import State from '../engine/State.js';
import Tree from '../engine/Tree/Tree.ts';
import TreeNode from '../engine/Tree/TreeNode.ts';
import TreeEdge from '../engine/Tree/TreeEdge.ts';
import PickEdge from './PickEdge.tsx';

export default function DynamicTreeGame() {
	const [tree, setTree] = React.useState<Tree>();
	const [currentNode, setCurrentNode] = React.useState<TreeNode>();
	const [isTerminal, setIsTerminal] = React.useState<boolean>(false);
	const [victory, setVictory] = React.useState<boolean>(false);

	useEffect(() => {
		const state = new State();
		const tree = new Tree(state);
		const root = tree.getRoot();
		const outcome = root.getState().getOutcome();
		tree.createValidTransitions(root);
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
		if (outcome.isTerminal !== true) tree.createValidTransitions(targetNode);
		if (
			outcome.isTerminal === true ||
			targetNode.getTargetEdges().length === 0
		) {
			setIsTerminal(true);
			setVictory(outcome.win);
			const dot = tree.exportToDot({solutionNode: targetNode});
			Tree.exportToFile(dot, 'images/dynamicTreeGame', 'svg');
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
