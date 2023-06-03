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
  document.removeEventListener(
    "pointerdown",
    window["TabComponent"].pointerdown
  );
}

/**
 * TabContainer
 *
 * @author Yassuo Toda
 */
class TabContainer {
  static setSelectedTabComponent = (
    tabContainer: HTMLElement,
    cardContainer: HTMLElement,
    selectedTabComponent: HTMLElement
  ) => {
    let selectedCardComponent: HTMLElement;
    for (let i: number = 0; i < tabContainer.children.length; i++) {
      const tabComponent = tabContainer.children[i] as HTMLElement;
      if (tabComponent === selectedTabComponent) {
        const value: string = tabComponent.getAttribute("value");
        selectedCardComponent = CardContainer.show(cardContainer, value);
      }
    }
    if (selectedCardComponent) {
      for (let i: number = 0; i < tabContainer.children.length; i++) {
        const tabComponent = tabContainer.children[i] as HTMLElement;
        if (tabComponent === selectedTabComponent) {
          tabComponent.tabIndex = -1;
        } else {
          tabComponent.tabIndex = 0;
        }
      }
    }
    return selectedCardComponent;
  };
}

/**
 * CardContainer
 *
 * @author Yassuo Toda
 */
class CardContainer {
  static show = (cardContainer: HTMLElement, name: string) => {
    for (let i: number = 0; i < cardContainer.children.length; i++) {
      const cardComponent: HTMLElement = cardContainer.children[
        i
      ] as HTMLElement;
      if (cardComponent.dataset.name === name) {
        return CardContainer.setSelectedIndex(cardContainer, i);
      }
    }
  };

  static setSelectedIndex = (
    cardContainer: HTMLElement,
    selectedIndex: number
  ) => {
    let selectedCardComponent: HTMLElement;
    for (let i: number = 0; i < cardContainer.children.length; i++) {
      const cardComponent: HTMLElement = cardContainer.children[
        i
      ] as HTMLElement;
      if (i === selectedIndex) {
        cardComponent.style.visibility = "";
        cardComponent.focus();
        selectedCardComponent = cardComponent;
      } else {
        cardComponent.style.visibility = "hidden";
      }
    }
    return selectedCardComponent;
  };
}

/**
 * TabComponent
 *
 * @author Yassuo Toda
 */
class TabComponent {
  static pointerdown = (ev: PointerEvent) => {
    const tabComponent = ev.target as HTMLElement;
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
    const cardContainer: HTMLElement = tabbedPane.children[
      tabbedPane.childElementCount - 1
    ] as HTMLElement;
    if (cardContainer === null) {
      return;
    }
    if (cardContainer === tabContainer) {
      return;
    }
    TabContainer.setSelectedTabComponent(
      tabContainer,
      cardContainer,
      tabComponent
    );
  };
}

document.addEventListener("pointerdown", TabComponent.pointerdown);
