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

  static splitpanedividerpointerdown = (ev: CustomEvent) => {
    let splitPaneDivider: HTMLElement = ev.detail.event.target;
    if (!splitPaneDivider.classList.contains("SplitPaneDivider")) {
      splitPaneDivider = ev.detail.event.currentTarget;
    }
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
    const callback: (dividerLocation: number) => void = ev.detail.callback;
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
        dragLayer.remove();
        if (callback) {
          callback(this.dividerLocation);
        }
      },
      pointerleave(ev: PointerEvent) {
        dragLayer.remove();
        if (callback) {
          callback(this.dividerLocation);
        }
      }
    };
    dragLayer.onpointermove = dragLayerEventListener.pointermove;
    dragLayer.onpointerup = dragLayerEventListener.pointerup;
    dragLayer.onpointerleave = dragLayerEventListener.pointerleave;
  }

  static pointerdown = (ev: PointerEvent) => {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    document.dispatchEvent(
      new CustomEvent("splitpanedividerpointerdown", {
        detail: {
          event: ev
        }
      })
    );
  }
}

document.addEventListener("splitpanedividerpointerdown", SplitPane.splitpanedividerpointerdown);
document.addEventListener("pointerdown", SplitPane.pointerdown);
