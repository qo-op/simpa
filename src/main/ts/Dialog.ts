/**
 * Dialog
 * 
 * Based on the javax.swing.JDialog
 * https://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JDialog.html
 * 
 * @author Yassuo Toda
 */

if (window["Dialog"]) {
	document.removeEventListener("pointerdown", window["Dialog"].pointerdown);
}

class Dialog {

	static dragStart: boolean = false;

	static dialog: HTMLElement;
	static x: number;
	static y: number;
	static width: number;
	static height: number;

	static pointerdown = (ev: PointerEvent) => {
		let dialogTitleBar: HTMLElement;
		const target: HTMLElement = ev.target as HTMLElement;
		if (target.classList.contains("DialogTitleBar")) {
			dialogTitleBar = target;
		} else {
			dialogTitleBar = target.closest(".DialogTitleBar");
			if (dialogTitleBar === null) {
				return;
			}
		}
		Dialog.dragStart = true;
		Dialog.dialog = dialogTitleBar.closest(".Dialog");
		var rect = Dialog.dialog.getBoundingClientRect();
		Dialog.x = ev.clientX - rect.left;
		Dialog.y = ev.clientY - rect.top;
		Dialog.width = rect.width;
		Dialog.height = rect.height;
		Dialog.dialog.style.position = "absolute";
		Dialog.dialog.style.top = rect.top + "px";
		Dialog.dialog.style.left = rect.left + "px";
		document.addEventListener("touchmove", Dialog.preventTouchMove, { passive: false });
		document.addEventListener("pointermove", Dialog.pointermove);
		document.addEventListener("pointerup", Dialog.pointerup);
		document.addEventListener("pointerenter", Dialog.pointerenter);
	}

	static preventTouchMove(ev: TouchEvent) {
		ev.preventDefault();
	}

	static pointermove = (ev: PointerEvent) => {
		if (!Dialog.dragStart) {
			return;
		}
		Dialog.dialog.style.top = Math.min(Math.max(ev.clientY - Dialog.y, 0), window.innerHeight - Dialog.height) + "px";
		Dialog.dialog.style.left = Math.min(Math.max(ev.clientX - Dialog.x, 0), window.innerWidth - Dialog.width) + "px";
	}

	static pointerup = (ev: PointerEvent) => {
		Dialog.dragStart = false;
		document.removeEventListener("touchmove", Dialog.preventTouchMove);
		document.removeEventListener("pointermove", Dialog.pointermove);
		document.removeEventListener("pointerup", Dialog.pointerup);
		document.removeEventListener("pointerenter", Dialog.pointerenter);
	}

	static pointerenter = (ev: PointerEvent) => {
		Dialog.pointerup(ev);
	}
}

document.addEventListener("pointerdown", Dialog.pointerdown);
