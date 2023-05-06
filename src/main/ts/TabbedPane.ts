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
				tabComponent.dataset.selected = "";
				const name: string | null= tabComponent.getAttribute("name");
				CardContainer.show(cardContainer, name);
			} else {
				tabComponent.removeAttribute("data-selected");
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
				tabComponent.dataset.selected = "";
				const name: string | null = tabComponent.getAttribute("name");
				CardContainer.show(cardContainer, name);
			} else {
				tabComponent.removeAttribute("data-selected");
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

	static show = (cardContainer: HTMLElement, name: string | null) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (cardComponent.getAttribute("name") === name) {
				CardContainer.setSelectedIndex(cardContainer, i);
				break;
			}
		}
	}

	static getSelectedIndex = (cardContainer: HTMLElement) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (cardComponent.style.visibility === "visible") {
				return i;
			}
		}
		return -1;
	}

	static setSelectedIndex = (cardContainer: HTMLElement, selectedIndex: number) => {
		for (let i: number = 0; i < cardContainer.children.length; i++) {
			const cardComponent: HTMLElement = cardContainer.children[i] as HTMLElement;
			if (i === selectedIndex) {
				cardComponent.style.visibility = "visible";
			} else {
				cardComponent.style.visibility = "hidden";
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

	static pointerdown = (ev: CustomEvent) => {
		const tabComponent: HTMLElement = ev.detail.event.currentTarget;
		try {
			const tabContainer: HTMLElement | null = tabComponent.parentElement;
			if (tabContainer === null) {
				return;
			}
			const tabbedPane: HTMLElement | null = tabContainer.parentElement;
			if (tabbedPane === null) {
				return;
			}
			const cardContainer: HTMLElement | null = tabbedPane.querySelector(":scope>.CardContainer");
			if (cardContainer === null) {
				return;
			}
			TabContainer.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
		} finally {
			ev.stopPropagation();
		}
	}
}

document.addEventListener("tabcomponentpointerdow", TabComponent.pointerdown);
