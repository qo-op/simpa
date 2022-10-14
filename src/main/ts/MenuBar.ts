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

	static open(menuBar: HTMLElement): void {
		menuBar.dataset.open = "";
	}

	static close(menuBar: HTMLElement): void {
		menuBar.dataset.closed = "";
		menuBar.removeAttribute("data-open");
		MenuBar.select(menuBar, menuBar, null);
	}

	static select(menuBar: HTMLElement, ul: HTMLElement, li: HTMLElement | null): void {
		MenuBar.clearTimeout(menuBar);
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
				MenuBar.setTimeout(menuBar, function () {
					for (let i: number = 0; i < ul.children.length; i++) {
						ul.children[i].removeAttribute("data-selected");
					}
				}, 250);
			} else {
				MenuBar.setTimeout(menuBar, function () {
					for (let i: number = 0; i < ul.children.length; i++) {
						const child: HTMLElement = <HTMLElement>ul.children[i];
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

	static clearTimeout(menuBar: HTMLElement): void {
		if (menuBar.dataset.timeoutId !== undefined) {
			clearTimeout(+menuBar.dataset.timeoutId);
		}
	}

	static setTimeout(menuBar: HTMLElement, handler: TimerHandler, timeout: number): void {
		menuBar.dataset.timeoutId = "" + setTimeout(handler, timeout);
	}

	static shortcuts: Map<string, HTMLElement> = new Map();

	static addShortcuts(menuBar: HTMLElement) {
		menuBar
			.querySelectorAll(":scope [data-shortcut]")
			.forEach(function (element: Element) {
				const accelerator: HTMLElement = <HTMLElement>element;
				const shortcut: string | undefined = (<HTMLElement>accelerator).dataset.shortcut;
				if (shortcut === undefined || shortcut.trim() === "") {
					return;
				}
				let s: string = " " + shortcut.toLowerCase() + " ";
				let key: string = "";
				if (s.includes(" alt ")) {
					key += "alt ";
					s = s.replace(" alt ", " ");
				}
				if (s.includes(" control ")) {
					key += "ctrl ";
					s = s.replace(" control ", " ");
				}
				if (s.includes(" ctrl ")) {
					key += "ctrl ";
					s = s.replace(" ctrl ", " ");
				}
				if (s.includes(" meta ")) {
					key += "meta ";
					s = s.replace(" meta ", " ");
				}
				if (s.includes(" shift ")) {
					key += "shift ";
					s = s.replace(" shift ", " ");
				}
				key += s.trim();
				MenuBar.shortcuts.set(key, <HTMLElement>element);
				const span: HTMLSpanElement = document.createElement("span");
				span.textContent = (" " + key + " ")
					.replaceAll(" alt ", " Alt ")
					.replaceAll(" ctrl ", " Ctrl ")
					.replaceAll(" meta ", " Meta ")
					.replaceAll(" shift ", " Shift ")
					.trim()
					.replaceAll(/ +/g, "+")
				accelerator.appendChild(span);
			});
	}

	static pointerdown(ev: PointerEvent): void {
		const currentTarget: EventTarget = <EventTarget>ev.currentTarget;
		const target: HTMLElement = <HTMLElement>ev.target;
		let menuBar: HTMLElement;
		if (currentTarget === document) {
			menuBar = <HTMLElement>document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' MenuBar ')]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (!menuBar) {
				document
					.querySelectorAll(".MenuBar")
					.forEach(function (menuBar: Element) {
						MenuBar.close(<HTMLElement>menuBar);
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
			if (!menuBar.dataset.shortcuts) {
				MenuBar.addShortcuts(menuBar);
				menuBar.dataset.shortcuts = "true";
			}
		} else {
			menuBar = <HTMLElement>ev.currentTarget;
		}
		try {
			if (menuBar.dataset.open !== undefined) {
				if (target === menuBar || (target.parentElement === menuBar && target.tagName !== "li")) {
					MenuBar.close(menuBar);
				}
				return;
			}
			menuBar.dataset.closed = "";
			const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (li === null) {
				return;
			}
			li.dataset.selected = "";
			MenuBar.open(menuBar);
		} finally {
			ev.stopPropagation();
		}
	}

	static pointerup(ev: PointerEvent): void {
		const target: HTMLElement = <HTMLElement>ev.target;
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		if (li.parentElement === menuBar) {
			// menu
			if (menuBar.dataset.closed !== undefined) {
				menuBar.removeAttribute("data-closed");
			} else {
				MenuBar.close(menuBar);
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

	static pointerover(ev: PointerEvent): void {
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		if (menuBar.dataset.open === undefined) {
			return;
		}
		const target: HTMLElement = <HTMLElement>ev.target;
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (li === null) {
			return;
		}
		const ul: HTMLElement | null = li.parentElement;
		if (ul === null) {
			return;
		}
		MenuBar.select(menuBar, ul, li);
	}

	static pointerleave(ev: PointerEvent): void {
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		MenuBar.clearTimeout(menuBar);
		menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected: Element) {
			const ul: HTMLElement | null = selected.querySelector(":scope>ul");
			if (ul === null) {
				selected.removeAttribute("data-selected");
			}
		});
	}

	static keydown(ev: KeyboardEvent): void {
		document
			.querySelectorAll(".MenuBar")
			.forEach(function (element: Element) {
				const menuBar: HTMLElement = <HTMLElement>element;
				if (!menuBar.dataset.shortcuts) {
					MenuBar.addShortcuts(menuBar);
					menuBar.dataset.shortcuts = "true";
				}
			});
		let key: string = "";
		if (ev.ctrlKey) {
			key += "ctrl ";
		}
		if (ev.shiftKey) {
			key += "shift ";
		}
		if (ev.altKey) {
			key += "alt ";
		}
		if (ev.metaKey) {
			key += "meta ";
		}
		key += ev.key.toLowerCase();
		const element: HTMLElement | undefined = MenuBar.shortcuts.get(key);
		if (element) {
			element.click();
			ev.preventDefault();
		}
	}
}

document.addEventListener("pointerdown", MenuBar.pointerdown);
document.addEventListener("keydown", MenuBar.keydown);
