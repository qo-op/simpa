/**
 * SplitPane
 *
 * Based on the javax.swing.JSplitPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/splitpane.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html
 *
 * @author Yassuo Toda
 */
class SplitPane {
  static setDividerProportionalLocation = (
    splitPane: HTMLElement,
    proportionalLocation: number
  ) => {
    const verticalSplit: boolean =
      splitPane.dataset.orientation === "vertical-split";
    const pageEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "page-end";
    const lineEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "line-end";
    const leftComponent = splitPane.children[0] as HTMLElement;
    const rightComponent = splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect = leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect = rightComponent.getBoundingClientRect();
    const leftComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(leftComponent);
    const rightComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(rightComponent);
    let maximumDividerLocation: number = 0;
    if (verticalSplit) {
      maximumDividerLocation =
        leftComponentRect.height -
        +leftComponentComputedStyle.borderTopWidth.replace("px", "") -
        +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
      maximumDividerLocation +=
        rightComponentRect.height -
        +rightComponentComputedStyle.borderTopWidth.replace("px", "") -
        +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
      const dividerLocation = proportionalLocation * maximumDividerLocation;
      if (pageEndSplitPane) {
        rightComponent.style.height = dividerLocation + "px";
      } else {
        leftComponent.style.height = dividerLocation + "px";
      }
    } else {
      maximumDividerLocation =
        leftComponentRect.width -
        +leftComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +leftComponentComputedStyle.borderRightWidth.replace("px", "");
      maximumDividerLocation +=
        rightComponentRect.width -
        +rightComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +rightComponentComputedStyle.borderRightWidth.replace("px", "");
      const dividerLocation = proportionalLocation * maximumDividerLocation;
      if (lineEndSplitPane) {
        rightComponent.style.width = dividerLocation + "px";
      } else {
        leftComponent.style.width = dividerLocation + "px";
      }
    }
  };

  static setDividerLocation = (splitPane: HTMLElement, location: number) => {
    const verticalSplit: boolean =
      splitPane.dataset.orientation === "vertical-split";
    const pageEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "page-end";
    const lineEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "line-end";
    if (verticalSplit) {
      if (pageEndSplitPane) {
        const rightComponent = splitPane.children[2] as HTMLElement;
        rightComponent.style.height = location + "px";
      } else {
        const leftComponent = splitPane.children[0] as HTMLElement;
        leftComponent.style.height = location + "px";
      }
    } else {
      if (lineEndSplitPane) {
        const rightComponent = splitPane.children[2] as HTMLElement;
        rightComponent.style.width = location + "px";
      } else {
        const leftComponent = splitPane.children[0] as HTMLElement;
        leftComponent.style.width = location + "px";
      }
    }
  };

  static pointerdown = (ev: CustomEvent) => {
    const splitPane = ev.detail.event.currentTarget as HTMLElement;
    const leftComponent: HTMLElement = splitPane.children[0] as HTMLElement;
    const rightComponent: HTMLElement = splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect = leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect = rightComponent.getBoundingClientRect();
    const leftComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(leftComponent);
    const rightComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(rightComponent);
    const verticalSplit: boolean =
      splitPane.dataset.orientation === "vertical-split";
    const pageEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "page-end";
    const lineEndSplitPane: boolean =
      splitPane.dataset.dividerAnchor === "line-end";
    let offset: number = 0;
    let maximumDividerLocation: number = 0;
    if (verticalSplit) {
      if (pageEndSplitPane) {
        offset = ev.detail.event.clientY + rightComponentRect.height;
      } else {
        offset = ev.detail.event.clientY - leftComponentRect.height;
      }
      maximumDividerLocation =
        leftComponentRect.height -
        +leftComponentComputedStyle.borderTopWidth.replace("px", "") -
        +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
      maximumDividerLocation +=
        rightComponentRect.height -
        +rightComponentComputedStyle.borderTopWidth.replace("px", "") -
        +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
    } else {
      if (lineEndSplitPane) {
        offset = ev.detail.event.clientX + rightComponentRect.width;
      } else {
        offset = ev.detail.event.clientX - leftComponentRect.width;
      }
      maximumDividerLocation =
        leftComponentRect.width -
        +leftComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +leftComponentComputedStyle.borderRightWidth.replace("px", "");
      maximumDividerLocation +=
        rightComponentRect.width -
        +rightComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +rightComponentComputedStyle.borderRightWidth.replace("px", "");
    }
    const dragLayer: HTMLElement = document.createElement("div");
    dragLayer.classList.add("DragLayer");
    if (verticalSplit) {
      dragLayer.style.cursor = "ns-resize";
    } else {
      dragLayer.style.cursor = "ew-resize";
    }
    document.body.appendChild(dragLayer);
    const dragLayerEventListener = {
      pointermove(ev: PointerEvent): void {
        if (verticalSplit) {
          if (pageEndSplitPane) {
            const location = Math.min(
              Math.max(offset - ev.clientY, 0),
              maximumDividerLocation
            );
            rightComponent.style.height = location + "px";
          } else {
            const location = Math.min(
              Math.max(ev.clientY - offset, 0),
              maximumDividerLocation
            );
            leftComponent.style.height = location + "px";
          }
        } else {
          if (lineEndSplitPane) {
            const location = Math.min(
              Math.max(offset - ev.clientX, 0),
              maximumDividerLocation
            );
            rightComponent.style.width = location + "px";
          } else {
            const location = Math.min(
              Math.max(ev.clientX - offset, 0),
              maximumDividerLocation
            );
            leftComponent.style.width = location + "px";
          }
        }
      },
      pointerup(ev: PointerEvent): void {
        dragLayer.remove();
      },
      pointerleave(ev: PointerEvent): void {
        dragLayer.remove();
      },
    };
    dragLayer.addEventListener(
      "pointermove",
      dragLayerEventListener.pointermove
    );
    dragLayer.addEventListener("pointerup", dragLayerEventListener.pointerup);
    dragLayer.addEventListener(
      "pointerleave",
      dragLayerEventListener.pointerleave
    );
  };
}

document.addEventListener("splitpanepointerdown", SplitPane.pointerdown);
console.log("splitpanepointerdown added");