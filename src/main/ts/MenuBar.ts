/**
 * MenuBar
 * 
 * Based on the javax.swing.JMenu
 * https://docs.oracle.com/javase/tutorial/uiswing/components/menu.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JMenuBar.html
 * 
 * @author Yassuo Toda
 */
class MenuBar {

	static open = (menuBar: HTMLElement) => {
		menuBar.dataset.open = "";
	}

	static close = (menuBar: HTMLElement) => {
		menuBar.dataset.closed = "";
		menuBar.removeAttribute("data-open");
		MenuBar.select(menuBar, menuBar, null);
	}

	static select = (menuBar: HTMLElement, ul: HTMLElement, li: HTMLElement | null) => {
		MenuBar.clearTimeout(menuBar);
		/*
		console.log("select");
		console.log(menuBar);
		console.log(ul);
		console.log(li);
		*/
		if (ul === menuBar) {
			if (li !== null && li.dataset.selected !== undefined) {
				return;
			}
			menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected: Element) {
				selected.removeAttribute("data-selected");
			});
			if (li !== null) {
				li.dataset.selected = "";
			}
		} else {
			if (li === null) {
				MenuBar.setTimeout(menuBar, () => {
					for (let i: number = 0; i < ul.children.length; i++) {
						ul.children[i].removeAttribute("data-selected");
					}
				}, 250);
			} else {
				MenuBar.setTimeout(menuBar, () => {
					for (let i: number = 0; i < ul.children.length; i++) {
						const child: HTMLElement = ul.children[i] as HTMLElement;
						if (child === li) {
							child.dataset.selected = "";
						} else {
							child.removeAttribute("data-selected");
						}
					}
				}, 250);
			}
		}
	}

	static clearTimeout = (menuBar: HTMLElement) => {
		if (menuBar.dataset.timeoutId !== undefined) {
			clearTimeout(+menuBar.dataset.timeoutId);
		}
	}

	static setTimeout = (menuBar: HTMLElement, handler: TimerHandler, timeout: number) => {
		menuBar.dataset.timeoutId = "" + setTimeout(handler, timeout);
	}

	static pointerdown = (ev: PointerEvent) => {
		const currentTarget: EventTarget = ev.currentTarget;
		const target: HTMLElement = ev.target as HTMLElement;
		let menuBar: HTMLElement;
		if (currentTarget === document) {
			menuBar = document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' MenuBar ')]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
			if (!menuBar) {
				document
					.querySelectorAll(".MenuBar")
					.forEach(function (menuBar: Element) {
						MenuBar.close(menuBar as HTMLElement);
					});
				return;
			}
			if (!menuBar.onpointerdown) {
				menuBar.onpointerdown = MenuBar.pointerdown;
			}
			if (!menuBar.onpointerup) {
				menuBar.onpointerup = MenuBar.pointerup;
			}
			if (!menuBar.onpointerover) {
				menuBar.onpointerover = MenuBar.pointerover;
			}
			if (!menuBar.onpointerleave) {
				menuBar.onpointerleave = MenuBar.pointerleave;
			}
		} else {
			menuBar = ev.currentTarget as HTMLElement;
		}
		if (ev.pointerType !== "mouse") {
			MenuBar._select(menuBar, target);
		}
		try {
			if (menuBar.dataset.open !== undefined) {
				if (target === menuBar || (target.parentElement === menuBar && target.tagName !== "li")) {
					MenuBar.close(menuBar);
				}
				return;
			}
			menuBar.dataset.closed = "";
			const li: HTMLElement = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
			if (li === null) {
				return;
			}
			li.dataset.selected = "";
			MenuBar.open(menuBar);
		} finally {
			ev.stopPropagation();
		}
	}

	static pointerup = (ev: PointerEvent) => {
		const target: HTMLElement = ev.target as HTMLElement;
		const li: HTMLElement = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
		if (li === null) {
			return;
		}
		const input: HTMLInputElement | null = li.querySelector(":scope>input, :scope>:not(ul) input");
		if (input !== null) {
			if (input.type === "radio") {
				if (!input.checked) {
					input.checked = true;
				}
			} else if (input.type === "checkbox") {
				input.checked = !input.checked;
			}
		}
		const menuBar: HTMLElement = ev.currentTarget as HTMLElement;
		if (li.parentElement === menuBar) {
			// menu
			if (menuBar.dataset.closed !== undefined) {
				menuBar.removeAttribute("data-closed");
			} else {
				if (ev.pointerType === "mouse") {
					MenuBar.close(menuBar);
				}
			}
			return;
		}
		const ul: HTMLElement | null = li.querySelector(":scope>ul");
		if (ul !== null) {
			// submenu
			return;
		}
		const hr: HTMLElement | null = li.querySelector(":scope>hr");
		if (hr !== null) {
			return;
		}
		MenuBar.close(menuBar);
	}

	static pointerover = (ev: PointerEvent) => {
		if (ev.pointerType === "mouse") {
			const menuBar: HTMLElement = ev.currentTarget as HTMLElement;
			const target: HTMLElement = ev.target as HTMLElement;
			MenuBar._select(menuBar, target);
		}
	}

	static _select = (menuBar: HTMLElement, target: HTMLElement) => {
		if (menuBar.dataset.open === undefined) {
			return;
		}
		const li: HTMLElement = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
		if (li === null) {
			return;
		}
		const ul: HTMLElement | null = li.parentElement;
		if (ul === null) {
			return;
		}
		MenuBar.select(menuBar, ul, li);
	}

	static pointerleave = (ev: PointerEvent) => {
		const menuBar: HTMLElement = ev.currentTarget as HTMLElement;
		MenuBar.clearTimeout(menuBar);
		menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected: Element) {
			const ul: HTMLElement | null = selected.querySelector(":scope>ul");
			if (ul === null) {
				selected.removeAttribute("data-selected");
			}
		});
	}
}

document.addEventListener("pointerdown", MenuBar.pointerdown);
