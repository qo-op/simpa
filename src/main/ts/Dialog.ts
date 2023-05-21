/**
 * Dialog
 * 
 * Based on the javax.swing.JDialog
 * https://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JDialog.html
 * 
 * @author Yassuo Toda
 */

/**
 * Dialog
 * 
 * @author Yassuo Toda
 */
class Dialog {

	static dragStart: boolean = false;

	static dialog: HTMLElement;
	static x: number;
	static y: number;

	static pointerdown = (ev: PointerEvent) => {
		const target: HTMLElement = ev.target as HTMLElement;
		if (!target.classList.contains("DialogTitle")) {
			return;
		}
		Dialog.dragStart = true;
		const dialogTitle: HTMLElement = target;
		Dialog.dialog = dialogTitle.closest(".Dialog");
		Dialog.dialog.style.position = "absolute";
		var rect = Dialog.dialog.getBoundingClientRect();
		Dialog.x = ev.clientX - rect.left;
		Dialog.y = ev.clientY - rect.top;
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
		Dialog.dialog.style.left = (ev.clientX - Dialog.x) + "px";
		Dialog.dialog.style.top = (ev.clientY - Dialog.y) + "px";
	}

	static pointerup = (ev: PointerEvent) => {
		Dialog.dragStart = false;
		document.removeEventListener("touchmove", Dialog.preventTouchMove);
		document.removeEventListener("pointermove", Dialog.pointermove);
		document.removeEventListener("pointerup", Dialog.pointerup);
		document.removeEventListener("pointerenter", Dialog.pointerenter);
	}

	static pointerenter = (ev: PointerEvent) => {
		Dialog.dragStart = false;
		document.removeEventListener("touchmove", Dialog.preventTouchMove);
		document.removeEventListener("pointermove", Dialog.pointermove);
		document.removeEventListener("pointerup", Dialog.pointerup);
		document.removeEventListener("pointerenter", Dialog.pointerenter);
	}
}

document.addEventListener("pointerdown", Dialog.pointerdown);
