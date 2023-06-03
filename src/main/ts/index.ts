import { Dialog, MenuBar, SplitPane, TabComponent } from "./simpa";

if ((window as any)["Dialog"]) {
  document.removeEventListener(
    "pointerdown",
    (window as any)["Dialog"].pointerdown
  );
}

document.addEventListener("pointerdown", Dialog.pointerdown);

if ((window as any)["MenuBar"]) {
  document.removeEventListener(
    "pointerdown",
    (window as any)["MenuBar"].pointerdown
  );
}

document.addEventListener("pointerdown", MenuBar.pointerdown);

if ((window as any)["SplitPane"]) {
  document.removeEventListener(
    "pointerdown",
    (window as any)["SplitPane"].pointerdown
  );
}

document.addEventListener("pointerdown", SplitPane.pointerdown);

if ((window as any)["TabComponent"]) {
  document.removeEventListener(
    "pointerdown",
    (window as any)["TabComponent"].pointerdown
  );
}

document.addEventListener("pointerdown", TabComponent.pointerdown);
