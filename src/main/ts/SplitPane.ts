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

  static splitPane: HTMLElement;
  static leftComponent: HTMLElement;
  static rightComponent: HTMLElement;
  static verticalSplit: boolean = false;
  static endAnchor: boolean;
  static offset: number;
  static maximumDividerLocation: number;

  static pointerdown = (ev: PointerEvent) => {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    SplitPane.dragStart = true;
    const splitPaneDivider: HTMLElement = target;
    SplitPane.splitPane = splitPaneDivider.closest(".SplitPane");
    SplitPane.leftComponent = SplitPane.splitPane.children[0] as HTMLElement;
    SplitPane.rightComponent = SplitPane.splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect = SplitPane.leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect = SplitPane.rightComponent.getBoundingClientRect();
    const leftComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(SplitPane.leftComponent);
    const rightComponentComputedStyle: CSSStyleDeclaration =
      getComputedStyle(SplitPane.rightComponent);
    SplitPane.verticalSplit =
      SplitPane.splitPane.dataset.orientation === "vertical-split";
    SplitPane.endAnchor =
      SplitPane.splitPane.dataset.dividerAnchor === "end";
    if (SplitPane.verticalSplit) {
      if (SplitPane.endAnchor) {
        SplitPane.rightComponent.style.height = rightComponentRect.height + "px";
        SplitPane.splitPane.style.gridTemplateRows = "minmax(0, 1fr) auto auto";
        SplitPane.offset = ev.clientY + rightComponentRect.height;
      } else {
        SplitPane.leftComponent.style.height = leftComponentRect.height + "px";
        SplitPane.splitPane.style.gridTemplateRows = "auto auto minmax(0, 1fr)";
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
        SplitPane.rightComponent.style.width = rightComponentRect.width + "px";
        SplitPane.splitPane.style.gridTemplateColumns = "minmax(0, 1fr) auto auto";
        SplitPane.offset = ev.clientX + rightComponentRect.width;
      } else {
        SplitPane.leftComponent.style.width = leftComponentRect.width + "px";
        SplitPane.splitPane.style.gridTemplateColumns = "auto auto minmax(0, 1fr)";
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
    document.addEventListener("touchmove", SplitPane.preventTouchMove, { passive: false });
    document.addEventListener("pointermove", SplitPane.pointermove);
    document.addEventListener("pointerup", SplitPane.pointerup);
    document.addEventListener("pointerenter", SplitPane.pointerenter);

    document.addEventListener("dragstart", SplitPane.dragstart);
    document.addEventListener("dragenter", SplitPane.dragenter);
    document.addEventListener("dragover", SplitPane.dragover);
    document.addEventListener("dragend", SplitPane.dragend);
  }

  static preventTouchMove(ev: TouchEvent) {
    ev.preventDefault();
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
    document.removeEventListener("touchmove", SplitPane.preventTouchMove);
    document.removeEventListener("pointermove", SplitPane.pointermove);
    document.removeEventListener("pointerup", SplitPane.pointerup);
    document.removeEventListener("pointerenter", SplitPane.pointerenter);

    document.removeEventListener("dragstart", SplitPane.dragstart);
    document.removeEventListener("dragenter", SplitPane.dragenter);
    document.removeEventListener("dragover", SplitPane.dragover);
    document.removeEventListener("dragend", SplitPane.dragend);

    document.body.style.cursor = ""
    let dividerLocation: number;
    if (SplitPane.verticalSplit) {
      if (SplitPane.endAnchor) {
        dividerLocation = +SplitPane.rightComponent.style.height.replace("px", "");
        const percentage: number = dividerLocation / SplitPane.maximumDividerLocation;
        SplitPane.splitPane.style.gridTemplateRows = "minmax(0, " + (1 - percentage) + "fr) auto minmax(0, " + percentage + "fr)";
        SplitPane.rightComponent.style.height = "";
      } else {
        dividerLocation = +SplitPane.leftComponent.style.height.replace("px", "");
        const percentage: number = dividerLocation / SplitPane.maximumDividerLocation;
        SplitPane.splitPane.style.gridTemplateRows = "minmax(0, " + percentage + "fr) auto minmax(0, " + (1 - percentage) + "fr)";
        SplitPane.leftComponent.style.height = "";
      }
    } else {
      if (SplitPane.endAnchor) {
        dividerLocation = +SplitPane.rightComponent.style.width.replace("px", "");
        const percentage: number = dividerLocation / SplitPane.maximumDividerLocation;
        SplitPane.splitPane.style.gridTemplateColumns = "minmax(0, " + (1 - percentage) + "fr) auto minmax(0, " + percentage + "fr)";
        SplitPane.rightComponent.style.width = "";
      } else {
        dividerLocation = +SplitPane.leftComponent.style.width.replace("px", "");
        const percentage: number = dividerLocation / SplitPane.maximumDividerLocation;
        SplitPane.splitPane.style.gridTemplateColumns = "minmax(0, " + percentage + "fr) auto minmax(0, " + (1 - percentage) + "fr)";
        SplitPane.leftComponent.style.width = "";
      }
    }
  }

  static pointerenter = (ev: PointerEvent) => {
    SplitPane.pointerup(ev);
  }

  static dragstart = (ev: PointerEvent) => {
    console.log("dragstart");
    console.log(ev.currentTarget);
  }

  static dragenter = (ev: PointerEvent) => {
    console.log("dragenter");
    console.log(ev.currentTarget);
  }

  static dragover = (ev: PointerEvent) => {
    console.log("dragover");
    console.log(ev.currentTarget);
  }

  static dragend = (ev: PointerEvent) => {
    console.log("dragend");
    console.log(ev.currentTarget);
  }
}

document.addEventListener("pointerdown", SplitPane.pointerdown);
