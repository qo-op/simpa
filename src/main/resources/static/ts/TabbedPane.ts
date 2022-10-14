/**
 * Tabbed pane
 * 
 * Based on the javax.swing.JTabbedPane and java.awt.CardLayout
 * https://docs.oracle.com/javase/tutorial/uiswing/components/tabbedpane.html
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JTabbedPane.html
 * https://docs.oracle.com/javase/tutorial/uiswing/layout/card.html
 * https://docs.oracle.com/javase/7/docs/api/java/awt/CardLayout.html
 * 
 * Classes:
 * CardContainerUtils
 * TabbedPaneUtils
 * TabbedPaneEventListener
 */

/**
 * CardContainerUtils
 * 
 * @author Yassuo Toda
 */
 class CardContainerUtils {

	static _instance: CardContainerUtils = null;

	static get instance(): CardContainerUtils {
		if (CardContainerUtils._instance == null) {
			CardContainerUtils._instance = new CardContainerUtils();
		}
		return CardContainerUtils._instance;
	}

	first(cardContainer: HTMLElement): void {
		if (cardContainer.children.length === 0) {
			return;
		}
		this.setSelectedIndex(cardContainer, 0);
	}

	next(cardContainer: HTMLElement): void {
		if (cardContainer.children.length === 0) {
			return;
		}
		let selectedIndex: number = this.getSelectedIndex(cardContainer);
		if (selectedIndex === -1) {
			selectedIndex = 0;
		} else {
			selectedIndex = (selectedIndex + 1) % cardContainer.children.length;
		}
		this.setSelectedIndex(cardContainer, selectedIndex);
	}

	previous(cardContainer: HTMLElement): void {
		if (cardContainer.children.length === 0) {
			return;
		}
		let selectedIndex: number = this.getSelectedIndex(cardContainer);
		if (selectedIndex === -1) {
			selectedIndex = cardContainer.children.length - 1;
		} else {
			selectedIndex = (selectedIndex + cardContainer.children.length - 1) % cardContainer.children.length;
		}
		this.setSelectedIndex(cardContainer, selectedIndex);
	}

	last(cardContainer: HTMLElement): void {
		if (cardContainer.children.length === 0) {
			return;
		}
		this.setSelectedIndex(cardContainer, cardContainer.children.length - 1);
	}

	show(cardContainer: HTMLElement, name: string): void {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = <HTMLElement>cardContainer.children[i];
			if (cardComponent.getAttribute("name") === name) {
				this.setSelectedIndex(cardContainer, i);
				break;
			}
		}
	}

	getSelectedIndex(cardContainer: HTMLElement): number {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = <HTMLElement>cardContainer.children[i];
			if (cardComponent.classList.contains("visible")) {
				return i;
			}
		}
		return -1;
	}

	setSelectedIndex(cardContainer: HTMLElement, selectedIndex: number): void {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = <HTMLElement>cardContainer.children[i];
			if (i === selectedIndex) {
				cardComponent.classList.add("visible");
			} else {
				cardComponent.classList.remove("visible");
			}
		}
	}
}

/**
 * TabbedPaneUtils
 *
 * @author Yassuo Toda
 */
 class TabbedPaneUtils {

	static _instance: TabbedPaneUtils = null;

	static get instance(): TabbedPaneUtils {
		if (TabbedPaneUtils._instance == null) {
			TabbedPaneUtils._instance = new TabbedPaneUtils();
		}
		return TabbedPaneUtils._instance;
	}

	first(tabContainer: HTMLElement, cardContainer: HTMLElement): void {
		if (tabContainer.children.length === 0) {
			return;
		}
		this.setSelectedTabIndex(tabContainer, cardContainer, 0);
	}

	next(tabContainer: HTMLElement, cardContainer: HTMLElement): void {
		if (tabContainer.children.length === 0) {
			return;
		}
		let selectedTabIndex: number = this.getSelectedTabIndex(tabContainer);
		if (selectedTabIndex === -1) {
			selectedTabIndex = 0;
		} else {
			selectedTabIndex = (selectedTabIndex + 1) % tabContainer.children.length;
		}
		this.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
	}

	previous(tabContainer: HTMLElement, cardContainer: HTMLElement): void {
		if (tabContainer.children.length === 0) {
			return;
		}
		let selectedTabIndex: number = this.getSelectedTabIndex(tabContainer);
		if (selectedTabIndex === -1) {
			selectedTabIndex = tabContainer.children.length - 1;
		} else {
			selectedTabIndex = (selectedTabIndex + tabContainer.children.length - 1) % tabContainer.children.length;
		}
		this.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
	}

	last(tabContainer: HTMLElement, cardContainer: HTMLElement): void {
		if (tabContainer.children.length === 0) {
			return;
		}
		this.setSelectedTabIndex(tabContainer, cardContainer, tabContainer.children.length - 1);
	}

	show(tabContainer: HTMLElement, cardContainer: HTMLElement, name: string): void {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = <HTMLElement>tabContainer.children[i];
			if (tabComponent.getAttribute("name") === name) {
				this.setSelectedTabIndex(tabContainer, cardContainer, i);
				break;
			}
		}
	}

	getSelectedTabIndex(tabContainer: HTMLElement): number {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = <HTMLElement>tabContainer.children[i];
			if (tabComponent.classList.contains("selected")) {
				return i;
			}
		}
		return -1;
	}

	setSelectedTabIndex(tabContainer: HTMLElement, cardContainer: HTMLElement, selectedTabIndex: number): void {
		for (let i :number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = <HTMLElement>tabContainer.children[i];
			if (i === selectedTabIndex) {
				tabComponent.classList.add("selected");
				const name: string = tabComponent.getAttribute("name");
				CardContainerUtils.instance.show(cardContainer, name);
			} else {
				tabComponent.classList.remove("selected");
			}
		}
	}

	getSelectedTabComponent(tabContainer: HTMLElement): HTMLElement {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = <HTMLElement>tabContainer.children[i];
			if (tabComponent.classList.contains("selected")) {
				return tabComponent;
			}
		}
		return null;
	}

	setSelectedTabComponent(tabContainer: HTMLElement, cardContainer: HTMLElement, selectedTabComponent: HTMLElement): void {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = <HTMLElement>tabContainer.children[i];
			if (tabComponent === selectedTabComponent) {
				tabComponent.classList.add("selected");
				const name: string = tabComponent.getAttribute("name");
				CardContainerUtils.instance.show(cardContainer, name);
			} else {
				tabComponent.classList.remove("selected");
			}
		}
	}
}

/**
 * TabbedPaneEventListener
 * 
 * @author Yassuo Toda
 */
class TabbedPaneEventListener {

	static _instance: TabbedPaneEventListener = null;

	static get instance(): TabbedPaneEventListener {
		if (TabbedPaneEventListener._instance == null) {
			TabbedPaneEventListener._instance = new TabbedPaneEventListener();
		}
		return TabbedPaneEventListener._instance;
	}

	click(ev: MouseEvent): void {
		const target: HTMLElement = <HTMLElement>ev.target;
		const tabComponent: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' tab-component ')]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (tabComponent === null) {
			return;
		}
		const tabbedPane: HTMLElement = <HTMLElement>ev.currentTarget;
		const tabContainer: HTMLElement = tabComponent.parentElement;
		const cardContainer: HTMLElement = tabbedPane.querySelector(":scope>.card-container");
		if (target.classList.contains("tab-close")) {
			document.dispatchEvent(new CustomEvent("tab-close-action", {
				detail: {
					tabbedPane: tabbedPane,
					tabContainer: tabContainer,
					cardContainer: cardContainer,
					tabComponent: tabComponent,
					source: tabComponent
				}
			}));
			return;
		}
		TabbedPaneUtils.instance.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(`
			.tabbed-pane,
			.wrap-tabbed-pane,
			.scroll-tabbed-pane,
			.page-start-tabbed-pane,
			.page-start-wrap-tabbed-pane,
			.page-start-scroll-tabbed-pane,
			.page-end-tabbed-pane,
			.page-end-wrap-tabbed-pane,
			.page-end-scroll-tabbed-pane,
			.line-start-tabbed-pane,
			.line-start-wrap-tabbed-pane,
			.line-start-scroll-tabbed-pane,
			.line-end-tabbed-pane,
			.line-end-wrap-tabbed-pane,
			.line-end-scroll-tabbed-pane
	`).forEach(function (tabbedPane: Element) {
		const tabContainer: HTMLElement = tabbedPane.querySelector(":scope>.tab-container");
		const cardContainer: HTMLElement = tabbedPane.querySelector(":scope>.card-container");
		if (tabContainer === null || cardContainer === null) {
			return;
		}
		tabbedPane.addEventListener("click", TabbedPaneEventListener.instance.click);
	});
});
