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
 * DialogTitlePane
 * 
 * @author Yassuo Toda
 */
class DialogTitlePane {

	static pointerdown = (ev: CustomEvent) => {
		const dialogTitle = ev.detail.event.currentTarget as HTMLElement;
		const dialog: HTMLElement = document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' Dialog ')]", dialogTitle, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
		var rect = dialog.getBoundingClientRect();
		let x = ev.detail.event.clientX - rect.left;
		let y = ev.detail.event.clientY - rect.top;
		const dragLayer = document.createElement("div");
		document.body.appendChild(dragLayer);
		dragLayer.classList.add("DragLayer");
		const dragLayerEventListener = {
			pointermove(ev: MouseEvent) {
				dialog.style.left = ev.clientX - x + "px";
				dialog.style.top = ev.clientY - y + "px";
			},
			pointerup(ev: MouseEvent) {
				dragLayer.remove();
			},
			pointerleave(ev: MouseEvent) {
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
	}
}

document.addEventListener("dialogtitlepanepointerdown", DialogTitlePane.pointerdown);
