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

  static dragStart: boolean = false;

  static scrollPane: HTMLElement;

  static verticalSplit: boolean = false;
  static endAnchor: boolean;
  static offset: number;
  static maximumDividerLocation: number;
  static leftComponent: HTMLElement;
  static rightComponent: HTMLElement;

  static pointerdown = (ev: PointerEvent) => {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    SplitPane.dragStart = true;
    SplitPane.scrollPane = target.closest(".ScrollPane");
    if (SplitPane.scrollPane) {
      SplitPane.scrollPane.dataset.disabled = "true";
    }
    let splitPaneDivider: HTMLElement = target;
    const splitPane: HTMLElement = splitPaneDivider.closest(".SplitPane");
    SplitPane.leftComponent = splitPane.children[0] as HTMLElement;
    SplitPane.rightComponent = splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect = SplitPane.leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect = SplitPane.rightComponent.getBoundingClientRect();
    const leftComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(SplitPane.leftComponent);
    const rightComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(SplitPane.rightComponent);
    SplitPane.verticalSplit =
      splitPane.dataset.orientation === "vertical-split";
    SplitPane.endAnchor =
      splitPane.dataset.dividerAnchor === "end";
    if (SplitPane.verticalSplit) {
      if (SplitPane.endAnchor) {
        SplitPane.offset = ev.clientY + rightComponentRect.height;
      } else {
        SplitPane.offset = ev.clientY - leftComponentRect.height;
      }
      SplitPane.maximumDividerLocation =
        leftComponentRect.height -
        +leftComponentComputedStyle.borderTopWidth.replace("px", "") -
        +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
      SplitPane.maximumDividerLocation +=
        rightComponentRect.height -
        +rightComponentComputedStyle.borderTopWidth.replace("px", "") -
        +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
    } else {
      if (SplitPane.endAnchor) {
        SplitPane.offset = ev.clientX + rightComponentRect.width;
      } else {
        SplitPane.offset = ev.clientX - leftComponentRect.width;
      }
      SplitPane.maximumDividerLocation =
        leftComponentRect.width -
        +leftComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +leftComponentComputedStyle.borderRightWidth.replace("px", "");
      SplitPane.maximumDividerLocation +=
        rightComponentRect.width -
        +rightComponentComputedStyle.borderLeftWidth.replace("px", "") -
        +rightComponentComputedStyle.borderRightWidth.replace("px", "");
    }
    if (SplitPane.verticalSplit) {
      document.body.style.cursor = "ns-resize";
    } else {
      document.body.style.cursor = "ew-resize";
    }
    document.addEventListener("pointermove", SplitPane.pointermove);
    document.addEventListener("pointerup", SplitPane.pointerup);
    document.addEventListener("pointerenter", SplitPane.pointerenter);
  }

  static pointermove = (ev: PointerEvent) => {
    if (!SplitPane.dragStart) {
      return;
    }
    if (SplitPane.verticalSplit) {
      if (SplitPane.endAnchor) {
        const dividerLocation = Math.min(
          Math.max(SplitPane.offset - ev.clientY, 0),
          SplitPane.maximumDividerLocation
        );
        SplitPane.rightComponent.style.height = dividerLocation + "px";
      } else {
        const dividerLocation = Math.min(
          Math.max(ev.clientY - SplitPane.offset, 0),
          SplitPane.maximumDividerLocation
        );
        SplitPane.leftComponent.style.height = dividerLocation + "px";
      }
    } else {
      if (SplitPane.endAnchor) {
        const dividerLocation = Math.min(
          Math.max(SplitPane.offset - ev.clientX, 0),
          SplitPane.maximumDividerLocation
        );
        SplitPane.rightComponent.style.width = dividerLocation + "px";
      } else {
        const dividerLocation = Math.min(
          Math.max(ev.clientX - SplitPane.offset, 0),
          SplitPane.maximumDividerLocation
        );
        SplitPane.leftComponent.style.width = dividerLocation + "px";
      }
    }
  }

  static pointerup = (ev: PointerEvent) => {
    SplitPane.dragStart = false;
    if (SplitPane.scrollPane) {
      SplitPane.scrollPane.removeAttribute("data-disabled");
    }
    document.removeEventListener("pointermove", SplitPane.pointermove);
    document.removeEventListener("pointerup", SplitPane.pointerup);
    document.removeEventListener("pointerenter", SplitPane.pointerenter);
    document.body.style.cursor = ""
  }

  static pointerenter = (ev: PointerEvent) => {
    SplitPane.dragStart = false;
    document.removeEventListener("pointermove", SplitPane.pointermove);
    document.removeEventListener("pointerup", SplitPane.pointerup);
    document.removeEventListener("pointerenter", SplitPane.pointerenter);
    document.body.style.cursor = ""
  }
}

document.addEventListener("pointerdown", SplitPane.pointerdown);
