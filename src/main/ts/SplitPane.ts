/**
 * SplitPane
 *
 * Based on the javax.swing.JSplitPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/splitpane.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html
 *
 * @author Yassuo Toda
 */

if (window["SplitPane"]) {
  document.removeEventListener("pointerdown", window["SplitPane"].pointerdown);
}

class SplitPane {
  static dragStart: boolean = false;
  static dragLayer: HTMLElement;

  static splitPaneDivider: HTMLElement;
  static splitPane: HTMLElement;
  static leftComponent: HTMLElement;
  static rightComponent: HTMLElement;
  static verticalSplit: boolean = false;
  static offset: number;
  static maximumDividerLocation: number;

  static pointerdown = (ev: PointerEvent) => {
    const target: HTMLElement = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    console.log("pointerdown");
    SplitPane.dragStart = true;
    SplitPane.splitPaneDivider = target;
    SplitPane.splitPane = SplitPane.splitPaneDivider.closest(".SplitPane");
    SplitPane.leftComponent = SplitPane.splitPane.children[0] as HTMLElement;
    SplitPane.rightComponent = SplitPane.splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect =
      SplitPane.leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect =
      SplitPane.rightComponent.getBoundingClientRect();
    SplitPane.verticalSplit =
      SplitPane.splitPane.dataset.orientation === "vertical-split";
    if (SplitPane.verticalSplit) {
      SplitPane.maximumDividerLocation =
        leftComponentRect.height + rightComponentRect.height;
      const percentage =
        (100 * leftComponentRect.height) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.height = percentage + "%";
      SplitPane.rightComponent.style.height = 100 - percentage + "%";
      SplitPane.offset = ev.clientY - leftComponentRect.height;
    } else {
      SplitPane.maximumDividerLocation =
        leftComponentRect.width + rightComponentRect.width;
      const percentage =
        (100 * leftComponentRect.width) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.width = percentage + "%";
      SplitPane.rightComponent.style.width = 100 - percentage + "%";
      SplitPane.offset = ev.clientX - leftComponentRect.width;
    }
    if (SplitPane.verticalSplit) {
      document.body.style.cursor = "ns-resize";
    } else {
      document.body.style.cursor = "ew-resize";
    }
    document.addEventListener("touchmove", SplitPane.preventTouchMove, {
      passive: false,
    });
    document.addEventListener("pointermove", SplitPane.pointermove);
    document.addEventListener("pointerup", SplitPane.pointerup);
    document.addEventListener("dragstart", SplitPane.dragstart);
    SplitPane.dragLayer = document.body.querySelector(":scope>.DragLayer");
    if (SplitPane.dragLayer === null) {
      SplitPane.dragLayer = document.createElement("div");
      SplitPane.dragLayer.classList.add("DragLayer");
      document.body.appendChild(SplitPane.dragLayer);
    }
    SplitPane.dragLayer.style.visibility = "";
    ev.preventDefault();
  };

  static preventTouchMove(ev: TouchEvent) {
    ev.preventDefault();
  }

  static pointermove = (ev: PointerEvent) => {
    if (!SplitPane.dragStart) {
      return;
    }
    if (SplitPane.verticalSplit) {
      const dividerLocation = Math.min(
        Math.max(ev.clientY - SplitPane.offset, 0),
        SplitPane.maximumDividerLocation
      );
      const percentage =
        (100 * dividerLocation) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.height = percentage + "%";
      SplitPane.rightComponent.style.height = 100 - percentage + "%";
    } else {
      const dividerLocation = Math.min(
        Math.max(ev.clientX - SplitPane.offset, 0),
        SplitPane.maximumDividerLocation
      );
      const percentage =
        (100 * dividerLocation) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.width = percentage + "%";
      SplitPane.rightComponent.style.width = 100 - percentage + "%";
    }
    ev.preventDefault();
  };

  static pointerup = (ev: PointerEvent) => {
    console.log("pointerup");
    SplitPane.dragStart = false;
    document.body.style.cursor = "";
    document.removeEventListener("touchmove", SplitPane.preventTouchMove);
    document.removeEventListener("pointermove", SplitPane.pointermove);
    document.removeEventListener("pointerup", SplitPane.pointerup);
    document.removeEventListener("dragstart", SplitPane.dragstart);
    if (SplitPane.dragLayer !== null) {
      SplitPane.dragLayer.style.visibility = "hidden";
    }
  };

  static dragstart = (ev: PointerEvent) => {
    console.log("dragstart: " + ev.target);
    if (ev.target === SplitPane.splitPaneDivider) {
      SplitPane.pointerup(ev);
      ev.preventDefault();
    }
  };
}

document.addEventListener("pointerdown", SplitPane.pointerdown);
