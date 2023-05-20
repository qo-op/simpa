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

  static pointerdown = (ev: PointerEvent) => {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    const splitPaneDivider: HTMLElement = target;
    const splitPane: HTMLElement = document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' SplitPane ')]", splitPaneDivider, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
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
        offset = ev.clientY + rightComponentRect.height;
      } else {
        offset = ev.clientY - leftComponentRect.height;
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
        offset = ev.clientX + rightComponentRect.width;
      } else {
        offset = ev.clientX - leftComponentRect.width;
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
    let dragLayer: HTMLElement = document.querySelector(".SplitPaneDragLayer");
    if (!dragLayer) {
      dragLayer = document.createElement("div");
      dragLayer.classList.add("SplitPaneDragLayer");
      document.body.appendChild(dragLayer);
    }
    const dragLayerGlassPane: HTMLElement = document.createElement("div");
    dragLayer.appendChild(dragLayerGlassPane);
    dragLayer.style.visibility = "visible";
    if (verticalSplit) {
      dragLayerGlassPane.style.cursor = "ns-resize";
    } else {
      dragLayerGlassPane.style.cursor = "ew-resize";
    }
    const dragLayerEventListener = {
      dividerLocation: null,
      pointermove(ev: PointerEvent) {
        if (verticalSplit) {
          if (pageEndSplitPane) {
            this.dividerLocation = Math.min(
              Math.max(offset - ev.clientY, 0),
              maximumDividerLocation
            );
            rightComponent.style.height = this.dividerLocation + "px";
          } else {
            this.dividerLocation = Math.min(
              Math.max(ev.clientY - offset, 0),
              maximumDividerLocation
            );
            leftComponent.style.height = this.dividerLocation + "px";
          }
        } else {
          if (lineEndSplitPane) {
            this.dividerLocation = Math.min(
              Math.max(offset - ev.clientX, 0),
              maximumDividerLocation
            );
            rightComponent.style.width = this.dividerLocation + "px";
          } else {
            this.dividerLocation = Math.min(
              Math.max(ev.clientX - offset, 0),
              maximumDividerLocation
            );
            leftComponent.style.width = this.dividerLocation + "px";
          }
        }
      },
      pointerup(ev: PointerEvent) {
        dragLayer.style.visibility = "hidden";
        dragLayerGlassPane.remove();
      },
      pointerleave(ev: PointerEvent) {
        dragLayer.style.visibility = "hidden";
        dragLayerGlassPane.remove();
      },
    };
    dragLayerGlassPane.addEventListener("pointermove", dragLayerEventListener.pointermove);
    dragLayerGlassPane.addEventListener("pointerup", dragLayerEventListener.pointerup);
    dragLayerGlassPane.addEventListener("pointerleave", dragLayerEventListener.pointerleave);
  };
}

document.addEventListener("pointerdown", SplitPane.pointerdown);