/**
 * Menu
 * 
 * Based on the javax.swing.JMenu
 * https://docs.oracle.com/javase/tutorial/uiswing/components/menu.html
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JMenu.html
 * 
 * Classes:
 * MenuUtils
 * MenuEventListener
 */

/**
 * MenuUtils
 * 
 * @author Yassuo Toda
 */
class MenuUtils {

	static _instance: MenuUtils = null;

	static get instance(): MenuUtils {
		if (MenuUtils._instance == null) {
			MenuUtils._instance = new MenuUtils();
		}
		return MenuUtils._instance;
	}

	open(menuBar: HTMLElement): void {
		menuBar.classList.add("open");
	}

	close(menuBar: HTMLElement): void {
		menuBar.classList.add("closed");
		menuBar.classList.remove("open");
		MenuUtils.instance.select(menuBar, menuBar, null);
	}

	select(menuBar: HTMLElement, ul: HTMLElement, li: HTMLElement): void {
		this.clearTimeout(menuBar);
		if (ul === menuBar) {
			if (li !== null && li.classList.contains("selected")) {
				return;
			}
			menuBar.querySelectorAll(":scope li.selected").forEach(function (selected: Element) {
				selected.classList.remove("selected");
			});
			if (li !== null) {
				li.classList.add("selected");
			}
		} else {
			if (li === null) {
				this.setTimeout(menuBar, function () {
					for (let i: number = 0; i < ul.children.length; i++) {
						ul.children[i].classList.remove("selected");
					}
				}, 250);
			} else {
				this.setTimeout(menuBar, function () {
					for (let i: number = 0; i < ul.children.length; i++) {
						const child: HTMLElement = <HTMLElement>ul.children[i];
						if (child === li) {
							child.classList.add("selected");
						} else {
							child.classList.remove("selected");
						}
					}
				}, 250);
			}
		}
	}

	clearTimeout(menuBar: HTMLElement): void {
		if (menuBar.dataset.timeoutId !== undefined) {
			clearTimeout(+menuBar.dataset.timeoutId);
		}
	}

	setTimeout(menuBar: HTMLElement, handler: TimerHandler, timeout: number): void {
		menuBar.dataset.timeoutId = "" + setTimeout(handler, timeout);
	}
}

/**
 * MenuEventListener
 * 
 * @author Yassuo Toda
 */
class MenuEventListener {

	static _instance: MenuEventListener = null;

	static get instance(): MenuEventListener {
		if (MenuEventListener._instance == null) {
			MenuEventListener._instance = new MenuEventListener();
		}
		return MenuEventListener._instance;
	}

	shortcuts: Map<string, string> = new Map();

	pointerdown(ev: PointerEvent): void {
		if (ev.currentTarget === window) {
			document.querySelectorAll(`
					.menu-bar
			`).forEach(function (menuBar: Element) {
				MenuUtils.instance.close(<HTMLElement>menuBar);
			});
			return;
		}
		const target: HTMLElement = <HTMLElement>ev.target;
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		if (menuBar.classList.contains("open")) {
			if (target === menuBar || (target.parentElement === menuBar && target.tagName !== "li")) {
				MenuUtils.instance.close(menuBar);
			}
			ev.stopPropagation();
			return;
		}
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (li === null) {
			return;
		}
		li.classList.add("selected");
		MenuUtils.instance.open(menuBar);
		ev.stopPropagation();
	}

	pointerup(ev: PointerEvent): void {
		const target: HTMLElement = <HTMLElement>ev.target;
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (li === null) {
			return;
		}
		const input: HTMLInputElement = li.querySelector(":scope>input, :scope>:not(ul) input");
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
		const menuItem: HTMLElement = li.querySelector(":scope>.menu-item");
		if (menuItem !== null) {
			const action: string = menuItem.dataset.action;
			if (action !== undefined && action.trim() !== "") {
				document.dispatchEvent(new CustomEvent(action + "-action", {
					detail: {
						menuBar: menuBar,
						li: li,
						menuItem: menuItem,
						source: menuItem
					}
				}));
			}
		}
		if (menuBar.classList.contains("closed")) {
			menuBar.classList.remove("closed");
			return;
		}
		const ul: HTMLElement = li.querySelector(":scope>ul");
		if (ul !== null && li.parentElement !== menuBar) {
			// submenu
			return;
		}
		MenuUtils.instance.close(menuBar);
	}

	pointerover(ev: PointerEvent): void {
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		if (!menuBar.classList.contains("open")) {
			return;
		}
		const target: HTMLElement = <HTMLElement>ev.target;
		const li: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (li === null) {
			return;
		}
		MenuUtils.instance.select(menuBar, li.parentElement, li);
	}

	pointerleave(ev: PointerEvent): void {
		const menuBar: HTMLElement = <HTMLElement>ev.currentTarget;
		MenuUtils.instance.clearTimeout(menuBar);
		menuBar.querySelectorAll(":scope li.selected").forEach(function (selected: Element) {
			const ul: HTMLElement = selected.querySelector(":scope>ul");
			if (ul === null) {
				selected.classList.remove("selected");
			}
		});
	}

	blur(ev: FocusEvent): void {
		document.querySelectorAll(`
				.menu-bar
		`).forEach(function (menuBar: Element) {
			MenuUtils.instance.close(<HTMLElement>menuBar);
		});
	}

	keydown(ev: KeyboardEvent): void {
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
		key = key.trim();
		const action: string = MenuEventListener.instance.shortcuts.get(key);
		if (action !== undefined && action.trim() !== "") {
			document.dispatchEvent(new CustomEvent(action + "-action", {
				detail: {
					key: key,
					source: key
				}
			}));
			ev.preventDefault();
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const menus = document.querySelectorAll(`
			.menu-bar
	`);
	menus.forEach(function (element: Element) {
		const menuBar: HTMLElement = <HTMLElement>element;
		menuBar.addEventListener("pointerdown", MenuEventListener.instance.pointerdown);
		menuBar.addEventListener("pointerup", MenuEventListener.instance.pointerup);
		menuBar.addEventListener("pointerover", MenuEventListener.instance.pointerover);
		menuBar.addEventListener("pointerleave", MenuEventListener.instance.pointerleave);
		MenuUtils.instance.close(menuBar);
		menuBar.querySelectorAll(`
				:scope [data-shortcut]
		`).forEach(function (element: Element) {
			const accelerator: HTMLElement = <HTMLElement>element;
			const shortcut: string = (<HTMLElement>accelerator).dataset.shortcut;
			if (shortcut === undefined || shortcut.trim() === "") {
				return;
			}
			let s: string = " " + shortcut.toLowerCase() + " ";
			let key: string = "";
			if (s.includes(" ctrl ")) {
				key += "ctrl ";
				s = s.replace(" ctrl ", " ");
			}
			if (s.includes(" control ")) {
				key += "ctrl ";
				s = s.replace(" control ", " ");
			}
			if (s.includes(" shift ")) {
				key += "shift ";
				s = s.replace(" shift ", " ");
			}
			if (s.includes(" alt ")) {
				key += "alt ";
				s = s.replace(" alt ", " ");
			}
			if (s.includes(" meta ")) {
				key += "meta ";
				s = s.replace(" meta ", " ");
			}
			key += s.trim();
			key = key.trim();
			const span: HTMLSpanElement = document.createElement("span");
			span.textContent = shortcut.trim().replace(/ +/, "+");
			accelerator.appendChild(span);
			const li: HTMLElement = <HTMLElement>document.evaluate("ancestor::li[position() = 1]", accelerator, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (li === null) {
				return;
			}
			const menuItem: HTMLElement = li.querySelector(":scope>.menu-item");
			if (menuItem === null) {
				return;
			}
			const action: string = menuItem.dataset.action;
			if (action !== undefined && action.trim() !== "") {
				MenuEventListener.instance.shortcuts.set(key, action);
			}
		});
	});
	if (menus.length > 0) {
		window.addEventListener("pointerdown", MenuEventListener.instance.pointerdown);
		window.addEventListener("blur", MenuEventListener.instance.blur);
		window.addEventListener("keydown", MenuEventListener.instance.keydown);
	}
});
