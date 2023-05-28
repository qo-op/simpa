/**
 * TabbedPane
 * 
 * Based on the javax.swing.JTabbedPane and java.awt.CardLayout
 * https://docs.oracle.com/javase/tutorial/uiswing/components/tabbedpane.html
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JTabbedPane.html
 * https://docs.oracle.com/javase/tutorial/uiswing/layout/card.html
 * https://docs.oracle.com/javase/7/docs/api/java/awt/CardLayout.html
 * 
 * @author Yassuo Toda
 */

if (window["TabComponent"]) {
	document.removeEventListener("pointerdown", window["TabComponent"].pointerdown);
}

/**
 * TabContainer
 * 
 * @author Yassuo Toda
 */
class TabContainer {

	static first = (tabContainer: HTMLElement, cardContainer: HTMLElement) => {
		if (tabContainer.children.length === 0) {
			return;
		}
		TabContainer.setSelectedTabIndex(tabContainer, cardContainer, 0);
	}

	static next = (tabContainer: HTMLElement, cardContainer: HTMLElement) => {
		if (tabContainer.children.length === 0) {
			return;
		}
		let selectedTabIndex: number = TabContainer.getSelectedTabIndex(tabContainer);
		if (selectedTabIndex === -1) {
			selectedTabIndex = 0;
		} else {
			selectedTabIndex = (selectedTabIndex + 1) % tabContainer.children.length;
		}
		TabContainer.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
	}

	static previous = (tabContainer: HTMLElement, cardContainer: HTMLElement) => {
		if (tabContainer.children.length === 0) {
			return;
		}
		let selectedTabIndex: number = TabContainer.getSelectedTabIndex(tabContainer);
		if (selectedTabIndex === -1) {
			selectedTabIndex = tabContainer.children.length - 1;
		} else {
			selectedTabIndex = (selectedTabIndex + tabContainer.children.length - 1) % tabContainer.children.length;
		}
		TabContainer.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
	}

	static last = (tabContainer: HTMLElement, cardContainer: HTMLElement) => {
		if (tabContainer.children.length === 0) {
			return;
		}
		TabContainer.setSelectedTabIndex(tabContainer, cardContainer, tabContainer.children.length - 1);
	}

	static show = (tabContainer: HTMLElement, cardContainer: HTMLElement, name: string) => {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = tabContainer.children[i] as HTMLElement;
			if (tabComponent.getAttribute("name") === name) {
				TabContainer.setSelectedTabIndex(tabContainer, cardContainer, i);
				break;
			}
		}
	}

	static getSelectedTabIndex = (tabContainer: HTMLElement) => {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = tabContainer.children[i] as HTMLElement;
			if (tabComponent.dataset.selected !== undefined) {
				return i;
			}
		}
		return -1;
	}

	static setSelectedTabIndex = (tabContainer: HTMLElement, cardContainer: HTMLElement, selectedTabIndex: number) => {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = tabContainer.children[i] as HTMLElement;
			if (i === selectedTabIndex) {
				tabComponent.tabIndex = -1;
				const value: string = tabComponent.getAttribute("value");
				CardContainer.show(cardContainer, value);
			} else {
				tabComponent.tabIndex = 0;
			}
		}
	}

	static getSelectedTabComponent = (tabContainer: HTMLElement) => {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = tabContainer.children[i] as HTMLElement;
			if (tabComponent.dataset.selected !== undefined) {
				return tabComponent;
			}
		}
		return null;
	}

	static setSelectedTabComponent = (tabContainer: HTMLElement, cardContainer: HTMLElement, selectedTabComponent: HTMLElement) => {
		for (let i: number = 0; i < tabContainer.children.length; i++) {
			const tabComponent: HTMLElement = tabContainer.children[i] as HTMLElement;
			if (tabComponent === selectedTabComponent) {
				tabComponent.tabIndex = -1;
				const value: string = tabComponent.getAttribute("value");
				CardContainer.show(cardContainer, value);
			} else {
				tabComponent.tabIndex = 0;
			}
		}
	}
}

/**
 * CardContainer
 *
 * @author Yassuo Toda
 */
class CardContainer {

	static first = (cardContainer: HTMLElement) => {
		if (cardContainer.children.length === 0) {
			return;
		}
		CardContainer.setSelectedIndex(cardContainer, 0);
	}

	static next = (cardContainer: HTMLElement) => {
		if (cardContainer.children.length === 0) {
			return;
		}
		let selectedIndex: number = CardContainer.getSelectedIndex(cardContainer);
		if (selectedIndex === -1) {
			selectedIndex = 0;
		} else {
			selectedIndex = (selectedIndex + 1) % cardContainer.children.length;
		}
		CardContainer.setSelectedIndex(cardContainer, selectedIndex);
	}

	static previous = (cardContainer: HTMLElement) => {
		if (cardContainer.children.length === 0) {
			return;
		}
		let selectedIndex: number = CardContainer.getSelectedIndex(cardContainer);
		if (selectedIndex === -1) {
			selectedIndex = cardContainer.children.length - 1;
		} else {
			selectedIndex = (selectedIndex + cardContainer.children.length - 1) % cardContainer.children.length;
		}
		CardContainer.setSelectedIndex(cardContainer, selectedIndex);
	}

	static last = (cardContainer: HTMLElement) => {
		if (cardContainer.children.length === 0) {
			return;
		}
		CardContainer.setSelectedIndex(cardContainer, cardContainer.children.length - 1);
	}

	static show = (cardContainer: HTMLElement, name: string) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (cardComponent.dataset.name === name) {
				CardContainer.setSelectedIndex(cardContainer, i);
				break;
			}
		}
	}

	static getSelectedIndex = (cardContainer: HTMLElement) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (cardComponent.style.visibility !== "hidden") {
				return i;
			}
		}
		return -1;
	}

	static setSelectedIndex = (cardContainer: HTMLElement, selectedIndex: number) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (i === selectedIndex) {
				cardComponent.style.visibility = "";
				cardComponent.tabIndex = -1;
				if (cardComponent.onfocus) {
					cardComponent.focus();
				}
			} else {
				cardComponent.style.visibility = "hidden";
				cardComponent.removeAttribute("tabindex");
			}
		}
	}
}

/**
 * TabComponent
 * 
 * @author Yassuo Toda
 */
class TabComponent {

	static pointerdown = (ev: PointerEvent) => {
		const tabComponent: HTMLElement = ev.target as HTMLElement;
		const tabContainer: HTMLElement = tabComponent.parentElement;
		if (!tabContainer) {
			return;
		}
		const tabbedPane: HTMLElement = tabContainer.parentElement;
		if (!tabbedPane) {
			return;
		}
		if (!tabbedPane.classList.contains("TabbedPane")) {
			return;
		}
		const cardContainer: HTMLElement = tabbedPane.children[tabbedPane.childElementCount - 1] as HTMLElement;
		if (cardContainer === null) {
			return;
		}
		TabContainer.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
	}
}

document.addEventListener("pointerdown", TabComponent.pointerdown);
