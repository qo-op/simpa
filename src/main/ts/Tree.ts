/**
 * Tree
 * 
 * Based on the javax.swing.JTree
 * https://docs.oracle.com/javase/tutorial/uiswing/components/tree.htm
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JTree.html
 * 
 * @author Yassuo Toda
 */
class Tree {

	static pad(ul: HTMLElement, paddingInlineStart: number, padding: number): void {
		ul.querySelectorAll(`
				:scope>li
		`).forEach(function (li: Element) {
			if (li.children.length === 0) {
				return;
			}
			const firstChild = li.children[0];
			(<HTMLElement>firstChild).style.paddingInlineStart = paddingInlineStart + "px";
			const _ul: HTMLElement | null = li.querySelector(":scope>ul");
			if (_ul !== null) {
				Tree.pad(_ul, paddingInlineStart + padding, padding);
			}
		});
	}

	static select(li: HTMLElement, ctrlKey: boolean): void {
		if (ctrlKey) {
			if (li.dataset.selected !== undefined) {
				li.removeAttribute("data-selected");
			} else {
				li.dataset.selected = "";
			}
		} else {
			li.dataset.selected = "";
		}
	}

	static clearSelection(ul: HTMLElement): void {
		ul
			.querySelectorAll(":scope li[data-selected]")
			.forEach(function (selected: Element) {
				selected.removeAttribute("data-selected");
			});
	}

	static click(ev: MouseEvent): void {
		const currentTarget: EventTarget = <EventTarget>ev.currentTarget;
		const target: HTMLElement = <HTMLElement>ev.target;
		let tree: HTMLElement;
		let li: HTMLElement | null;
		if (currentTarget === document) {
			let treeNode: HTMLElement;
			if (target.classList.contains("TreeNode")) {
				treeNode = target;
			} else if (target.parentElement !== null && target.parentElement.classList.contains("TreeNode")) {
				treeNode = target.parentElement;
			} else {
				return;
			}
			tree = <HTMLElement>document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' Tree ')]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!tree) {
				return;
			}
			if (!tree.onclick) {
				tree.onclick = Tree.click;
			}
			li = treeNode.parentElement;
		} else {
			tree = <HTMLElement>currentTarget;
			li = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		}
		if (li === null) {
			return;
		}
		try {
			const singleTreeSelection: boolean = tree.dataset.selectionMode === "single-tree-selection";
			if (singleTreeSelection) {
				Tree.clearSelection(tree);
				Tree.select(li, false);
			} else {
				if (!ev.ctrlKey) {
					Tree.clearSelection(tree);
				}
				if (ev.shiftKey) {
					const leadSelection: HTMLElement | null = tree.querySelector(":scope li[data-lead-selection]");
					const lis: NodeListOf<Element> = tree.querySelectorAll(`
							:scope li
					`);
					let start: HTMLElement | null = null;
					for (let i: number = 0; i < lis.length; i++) {
						const selected: HTMLElement = <HTMLElement>lis[i];
						if (start === null) {
							if (selected === li) {
								break;
							} else if (selected === leadSelection) {
								start = selected;
								if (!ev.ctrlKey) {
									Tree.select(selected, ev.ctrlKey);
								}
							}
							continue;
						}
						Tree.select(selected, ev.ctrlKey);
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
										Tree.select(selected, ev.ctrlKey);
									}
								}
								continue;
							}
							Tree.select(selected, ev.ctrlKey);
							if (selected === li) {
								break;
							}
						}
					}
				} else {
					Tree.select(li, ev.ctrlKey);
					tree
						.querySelectorAll(":scope li[data-lead-selection]")
						.forEach(function (selected: Element) {
							selected.removeAttribute("data-lead-selection");
						});
					li.dataset.leadSelection = "";
				}
			}
			if (!ev.ctrlKey) {
				const treeNode: HTMLElement | null = li.querySelector(":scope>.TreeNode");
				if (treeNode !== null) {
					treeNode.dispatchEvent(new Event("tree-selection-listener", { bubbles: true }));
				}
				const ul: HTMLElement | null = li.querySelector(":scope>ul");
				if (ul !== null) {
					if (li.dataset.open !== undefined) {
						li.removeAttribute("data-open");
						li.dataset.closed = "";
					} else {
						li.dataset.open = "";
						li.removeAttribute("data-closed");
					}
				}
			}
		} finally {
			ev.stopPropagation();
		}
	}

	static dblclick(ev: MouseEvent): void {
		if (ev.ctrlKey) {
			const target: HTMLElement = <HTMLElement>ev.target;
			const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (li === null) {
				return;
			}
			const ul: HTMLElement | null = li.querySelector(":scope>ul");
			if (ul !== null) {
				if (li.dataset.open !== undefined) {
					li.removeAttribute("data-open");
					li.dataset.closed = "";
					Tree.clearSelection(ul);
				} else {
					li.dataset.open = "";
					li.removeAttribute("data-closed");
				}
			}
		}
	}
}

document.addEventListener("click", Tree.click);
