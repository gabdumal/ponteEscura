import Tree from '../Tree/Tree.js';
import TreeEdge from '../Tree/TreeEdge.js';

export default abstract class Search {
	/// Attributes
	protected tree: Tree;

	constructor(tree: Tree) {
		this.tree = tree;
	}

	/// Getters
	public static getAlgorithmName(): string {
		return 'Search';
	}

	public static getSafeAlgorithmName(): string {
		return this.getAlgorithmName().replace(/ /g, '_');
	}

	public getTree(): Tree {
		return this.tree;
	}

	/// Methods
	public abstract search(maxIterations: number): Array<TreeEdge>;
}
