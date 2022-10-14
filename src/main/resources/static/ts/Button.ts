/**
 * Button
 * 
 * @author Yassuo Toda
 */

document.addEventListener("click", function (ev: MouseEvent) {
	const target: HTMLElement = <HTMLElement>ev.target;
	const button: HTMLElement = <HTMLElement>document.evaluate("ancestor-or-self::button[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (button === null) {
		return;
	}
	const action: string = button.dataset.action;
	if (action !== undefined && action.trim() !== "") {
		document.dispatchEvent(new CustomEvent(action + "-action", {
			detail: {
				button: button,
				source: button
			}
		}));
	}
});
