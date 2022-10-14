/**
 * Split pane
 * 
 * Based on the javax.swing.JSplitPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/splitpane.html
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JSplitPane.html
 * 
 * Classes:
 * SplitPaneUtils
 * SplitPaneEventListener
 */

/**
 * SplitPaneUtils
 * 
 * @author Yassuo Toda
 */
 class SplitPaneUtils {

	static _instance: SplitPaneUtils = null;

	static get instance(): SplitPaneUtils {
		if (SplitPaneUtils._instance == null) {
			SplitPaneUtils._instance = new SplitPaneUtils();
		}
		return SplitPaneUtils._instance;
	}

	setDividerProportionalLocation(splitPane: HTMLElement, proportionalLocation: number): void {
		const pageEndSplitPane: boolean = splitPane.classList.contains("page-end-split-pane");
		const verticalSplit: boolean = splitPane.classList.contains("vertical-split-pane") || splitPane.classList.contains("page-start-split-pane") || pageEndSplitPane;
		const lineEndSplitPane: boolean = splitPane.classList.contains("line-end-split-pane");
		const leftComponent = <HTMLElement>splitPane.children[0];
		const rightComponent = <HTMLElement>splitPane.children[2];
		const leftComponentRect: DOMRect = leftComponent.getBoundingClientRect();
		const rightComponentRect: DOMRect = rightComponent.getBoundingClientRect();
		const leftComponentComputedStyle: CSSStyleDeclaration = getComputedStyle(leftComponent);
		const rightComponentComputedStyle: CSSStyleDeclaration = getComputedStyle(rightComponent);
		let maximumDividerLocation: number = 0;
		if (verticalSplit) {
			maximumDividerLocation = leftComponentRect.height - +leftComponentComputedStyle.borderTopWidth.replace("px", "") - +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
			maximumDividerLocation += rightComponentRect.height - +rightComponentComputedStyle.borderTopWidth.replace("px", "") - +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
			const dividerLocation = proportionalLocation * maximumDividerLocation;
			if (pageEndSplitPane) {
				rightComponent.style.height = dividerLocation + "px";
			} else {
				leftComponent.style.height = dividerLocation + "px";
			}
		} else {
			maximumDividerLocation = leftComponentRect.width - +leftComponentComputedStyle.borderLeftWidth.replace("px", "") - +leftComponentComputedStyle.borderRightWidth.replace("px", "");
			maximumDividerLocation += rightComponentRect.width - +rightComponentComputedStyle.borderLeftWidth.replace("px", "") - +rightComponentComputedStyle.borderRightWidth.replace("px", "");
			const dividerLocation = proportionalLocation * maximumDividerLocation;
			if (lineEndSplitPane) {
				rightComponent.style.width = dividerLocation + "px";
			} else {
				leftComponent.style.width = dividerLocation + "px";
			}
		}
	}

	setDividerLocation(splitPane: HTMLElement, location: number): void {
		const pageEndSplitPane: boolean = splitPane.classList.contains("page-end-split-pane");
		const verticalSplit: boolean = splitPane.classList.contains("vertical-split-pane") || splitPane.classList.contains("page-start-split-pane") || pageEndSplitPane;
		const lineEndSplitPane: boolean = splitPane.classList.contains("line-end-split-pane");
		if (verticalSplit) {
			if (pageEndSplitPane) {
				const rightComponent = <HTMLElement>splitPane.children[2];
				rightComponent.style.height = location + "px";
			} else {
				const leftComponent = <HTMLElement>splitPane.children[0];
				leftComponent.style.height = location + "px";
			}
		} else {
			if (lineEndSplitPane) {
				const rightComponent = <HTMLElement>splitPane.children[2];
				rightComponent.style.width = location + "px";
			} else {
				const leftComponent = <HTMLElement>splitPane.children[0];
				leftComponent.style.width = location + "px";
			}
		}
	}
}

/**
 * SplitPaneEventListener
 * 
 * @author Yassuo Toda
 */
class SplitPaneEventListener {

	static _instance: SplitPaneEventListener = null;

	static get instance(): SplitPaneEventListener {
		if (SplitPaneEventListener._instance == null) {
			SplitPaneEventListener._instance = new SplitPaneEventListener();
		}
		return SplitPaneEventListener._instance;
	}

	mousedown(ev: MouseEvent): void {
		const divider: HTMLElement = <HTMLElement>ev.currentTarget;
        const splitPane: HTMLElement = <HTMLElement>divider.parentElement;
		const leftComponent = <HTMLElement>splitPane.children[0];
		const rightComponent = <HTMLElement>splitPane.children[2];
		const leftComponentRect: DOMRect = leftComponent.getBoundingClientRect();
		const rightComponentRect: DOMRect = rightComponent.getBoundingClientRect();
		const leftComponentComputedStyle: CSSStyleDeclaration = getComputedStyle(leftComponent);
		const rightComponentComputedStyle: CSSStyleDeclaration = getComputedStyle(rightComponent);
		const pageEndSplitPane: boolean = splitPane.classList.contains("page-end-split-pane");
		const verticalSplit: boolean = splitPane.classList.contains("vertical-split-pane") || splitPane.classList.contains("page-start-split-pane") || pageEndSplitPane;
		const lineEndSplitPane: boolean = splitPane.classList.contains("line-end-split-pane");
		let offset: number = 0;
		let maximumDividerLocation: number = 0;
		if (verticalSplit) {
			if (pageEndSplitPane) {
				offset = ev.y + rightComponentRect.height;
			} else {
				offset = ev.y - leftComponentRect.height;
			}
			maximumDividerLocation = leftComponentRect.height - +leftComponentComputedStyle.borderTopWidth.replace("px", "") - +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
			maximumDividerLocation += rightComponentRect.height - +rightComponentComputedStyle.borderTopWidth.replace("px", "") - +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
		} else {
			if (lineEndSplitPane) {
				offset = ev.x + rightComponentRect.width;
			} else {
				offset = ev.x - leftComponentRect.width;
			}
			maximumDividerLocation = leftComponentRect.width - +leftComponentComputedStyle.borderLeftWidth.replace("px", "") - +leftComponentComputedStyle.borderRightWidth.replace("px", "");
			maximumDividerLocation += rightComponentRect.width - +rightComponentComputedStyle.borderLeftWidth.replace("px", "") - +rightComponentComputedStyle.borderRightWidth.replace("px", "");
		}
		const glassPane = document.createElement("div");
		glassPane.classList.add("glass-pane");
		if (verticalSplit) {
			glassPane.style.cursor = "ns-resize";
		} else {
			glassPane.style.cursor = "ew-resize";
		}
		document.body.appendChild(glassPane);
		const glassPaneEventListener = {
			mousemove(ev: MouseEvent): void {
				if (verticalSplit) {
					if (pageEndSplitPane) {
						const location = Math.min(Math.max(offset - ev.y, 0), maximumDividerLocation);
						rightComponent.style.height = location + "px";
					} else {
						const location = Math.min(Math.max(ev.y - offset, 0), maximumDividerLocation);
						leftComponent.style.height = location + "px";
					}
				} else {
					if (lineEndSplitPane) {
						const location = Math.min(Math.max(offset - ev.x, 0), maximumDividerLocation);
						rightComponent.style.width = location + "px";
					} else {
						const location = Math.min(Math.max(ev.x - offset, 0), maximumDividerLocation);
						leftComponent.style.width = location + "px";
					}
				}
			},
			mouseup(ev: MouseEvent): void {
				glassPane.remove();
			},
			mouseleave(ev: MouseEvent): void {
				glassPane.remove();
			}
		};
		glassPane.addEventListener("mousemove", glassPaneEventListener.mousemove);
		glassPane.addEventListener("mouseup", glassPaneEventListener.mouseup);
		glassPane.addEventListener("mouseleave", glassPaneEventListener.mouseleave);
	}
}

document.addEventListener("split-pane-divider-location-action", function(ev: CustomEvent) {
	const splitPane: HTMLElement = ev.detail.splitPane;
	const dividerLocation: number = ev.detail.dividerLocation;
	SplitPaneUtils.instance.setDividerLocation(splitPane, dividerLocation);
});

document.addEventListener("split-pane-divider-proportional-location-action", function(ev: CustomEvent) {
	const splitPane: HTMLElement = ev.detail.splitPane;
	const dividerProportionalLocation: number = ev.detail.dividerProportionalLocation;
	SplitPaneUtils.instance.setDividerProportionalLocation(splitPane, dividerProportionalLocation);
});

document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(`
			.split-pane,
			.horizontal-split-pane,
			.line-start-split-pane,
			.line-end-split-pane,
			.vertical-split-pane,
			.page-start-split-pane,
			.page-end-split-pane
	`).forEach(function (element: Element) {
		const splitPane: HTMLElement = <HTMLElement>element;
		if (splitPane.children.length != 3) {
			return;
		}
		const divider: HTMLElement = <HTMLElement>splitPane.children[1];
		divider.addEventListener("mousedown", SplitPaneEventListener.instance.mousedown);
		if (splitPane.dataset.dividerLocation !== undefined) {
			const dividerLocation: number = +splitPane.dataset.dividerLocation;
			SplitPaneUtils.instance.setDividerLocation(splitPane, dividerLocation);
		} else if (splitPane.dataset.dividerProportionalLocation !== undefined) {
			const dividerProportionalLocation: number = +splitPane.dataset.dividerProportionalLocation;
			SplitPaneUtils.instance.setDividerProportionalLocation(splitPane, dividerProportionalLocation);
		}
	});
});
