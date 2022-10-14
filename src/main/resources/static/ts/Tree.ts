/**
 * Tree
 * 
 * Based on the javax.swing.JTree
 * https://docs.oracle.com/javase/tutorial/uiswing/components/tree.htm
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JTree.html
 * 
 * Classes:
 * TreeUtils
 * TreeEventListenery
 */

/**
 * TreeUtils
 * 
 * @author Yassuo Toda
 */
class TreeUtils {

	static _instance: TreeUtils = null;

	static get instance(): TreeUtils {
		if (TreeUtils._instance == null) {
			TreeUtils._instance = new TreeUtils();
		}
		return TreeUtils._instance;
	}

	pad(ul: HTMLElement, paddingInlineStart: number, padding: number): void {
		ul.querySelectorAll(`
				:scope>li
		`).forEach(function (li: Element) {
			if (li.children.length === 0) {
				return;
			}
			const firstChild = li.children[0];
			(<HTMLElement>firstChild).style.paddingInlineStart = paddingInlineStart + "px";
			const _ul: HTMLElement = li.querySelector(":scope>ul");
			if (_ul !== null) {
				TreeUtils.instance.pad(_ul, paddingInlineStart + padding, padding);
			}
		});
	}

	select(li: HTMLElement, ctrlKey: boolean): void {
		if (ctrlKey) {
			if (li.classList.contains("selected")) {
				li.classList.remove("selected");
			} else {
				li.classList.add("selected");
			}
		} else {
			li.classList.add("selected");
		}
	}

	clearSelection(ul: HTMLElement): void {
		ul.querySelectorAll(`
				:scope li.selected
		`).forEach(function (selected: Element) {
			selected.classList.remove("selected");
		});
	}
}

/**
 * TreeEventListener
 * 
 * @author Yassuo Toda
 */
class TreeEventListener {

	static _instance: TreeEventListener = null;

	static get instance(): TreeEventListener {
		if (TreeEventListener._instance == null) {
			TreeEventListener._instance = new TreeEventListener();
		}
		return TreeEventListener._instance;
	}

	click(ev: MouseEvent): void {
		const target: HTMLElement = <HTMLElement>ev.target;
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (li === null) {
			return;
		}
		const tree: HTMLElement = <HTMLElement>ev.currentTarget;
		const singleTreeSelection: boolean = tree.classList.contains("single-tree-selection");
		if (singleTreeSelection) {
			TreeUtils.instance.clearSelection(tree);
			TreeUtils.instance.select(li, false);
		} else {
			if (!ev.ctrlKey) {
				TreeUtils.instance.clearSelection(tree);
			}
			if (ev.shiftKey) {
				const leadSelection: HTMLElement = tree.querySelector(":scope li.lead-selection");
				const lis: NodeListOf<Element> = tree.querySelectorAll(`
						:scope li
				`);
				let start: HTMLElement = null;
				for (let i: number = 0; i < lis.length; i++) {
					const selected: HTMLElement = <HTMLElement>lis[i];
					if (start === null) {
						if (selected === li) {
							break;
						} else if (selected === leadSelection) {
							start = selected;
							if (!ev.ctrlKey) {
								TreeUtils.instance.select(selected, ev.ctrlKey);
							}
						}
						continue;
					}
					TreeUtils.instance.select(selected, ev.ctrlKey);
					if (selected === li || selected === leadSelection) {
						break;
					}
				}
				if (start === null) {
					for (let i: number = lis.length - 1; i >= 0; i--) {
						const selected: HTMLElement = <HTMLElement>lis[i];
						if (start === null) {
							if (selected === leadSelection) {
								start = selected;
								if (!ev.ctrlKey) {
									TreeUtils.instance.select(selected, ev.ctrlKey);
								}
							}
							continue;
						}
						TreeUtils.instance.select(selected, ev.ctrlKey);
						if (selected === li) {
							break;
						}
					}
				}
			} else {
				TreeUtils.instance.select(li, ev.ctrlKey);
				tree.querySelectorAll(`
						:scope li.lead-selection
				`).forEach(function (selected: Element) {
					selected.classList.remove("lead-selection");
				});
				li.classList.add("lead-selection");
			}
		}
		if (!ev.ctrlKey) {
			const treeNode: HTMLElement = li.querySelector(":scope>.tree-node");
			if (treeNode !== null) {
				const userObject: string = treeNode.dataset.userObject;
				if (userObject !== undefined && userObject.trim() !== "") {
					document.dispatchEvent(new CustomEvent("tree-selection-action", {
						detail: {
							tree: tree,
							li: li,
							treeNode: treeNode,
							source: treeNode,
							userObject: userObject
						}
					}));
				}
			}
			const ul: HTMLElement = li.querySelector(":scope>ul");
			if (ul !== null) {
				if (li.classList.contains("open")) {
					li.classList.remove("open");
					li.classList.add("closed");
				} else {
					li.classList.add("open");
					li.classList.remove("closed");
				}
			}
		}
	}

	dblclick(ev: MouseEvent): void {
		if (ev.ctrlKey) {
			const target: HTMLElement = <HTMLElement>ev.target;
			const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (li === null) {
				return;
			}
			const ul: HTMLElement = li.querySelector(":scope>ul");
			if (ul !== null) {
				if (li.classList.contains("open")) {
					li.classList.remove("open");
					li.classList.add("closed");
					TreeUtils.instance.clearSelection(ul);
				} else {
					li.classList.add("open");
					li.classList.remove("closed");
				}
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(`
			.tree
	`).forEach(function (element: Element) {
		const tree: HTMLElement = <HTMLElement>element;
		tree.addEventListener("click", TreeEventListener.instance.click);
		tree.addEventListener("dblclick", TreeEventListener.instance.dblclick);
		tree.querySelectorAll(`
				:scope li>ul
		`).forEach(function (ul: Element) {
			const li: HTMLElement = ul.parentElement;
			if (li.classList.contains("open")) {
				li.classList.remove("closed");
			} else {
				li.classList.add("closed");
			}
		});
		tree.querySelectorAll(`
				:scope li.selected
		`).forEach(function (li: Element) {
			li.classList.remove("selected");
		});
		tree.querySelectorAll(`
				:scope li.lead-selection
		`).forEach(function (li: Element) {
			li.classList.remove("lead-selection");
		});
		tree.querySelector(":scope li").classList.add("lead-selection");
		const rem: number = parseInt(getComputedStyle(document.documentElement).fontSize);
		/*
		TreeUtils.instance.pad(tree, 0, +tree.dataset.padding || (rem + 5));
		*/
	});
});
