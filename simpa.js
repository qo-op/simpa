/**
 * MenuBar
 *
 * Based on the javax.swing.JMenu
 * https://docs.oracle.com/javase/tutorial/uiswing/components/menu.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JMenuBar.html
 *
 * @author Yassuo Toda
 */
var MenuBar = /** @class */ (function () {
    function MenuBar() {
    }
    MenuBar.open = function (menuBar) {
        menuBar.dataset.open = "";
    };
    MenuBar.close = function (menuBar) {
        menuBar.dataset.closed = "";
        menuBar.removeAttribute("data-open");
        MenuBar.select(menuBar, menuBar, null);
    };
    MenuBar.select = function (menuBar, ul, li) {
        MenuBar.clearTimeout(menuBar);
        if (ul === menuBar) {
            if (li !== null && li.dataset.selected !== undefined) {
                return;
            }
            menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected) {
                selected.removeAttribute("data-selected");
            });
            if (li !== null) {
                li.dataset.selected = "";
            }
        }
        else {
            if (li === null) {
                MenuBar.setTimeout(menuBar, function () {
                    for (var i = 0; i < ul.children.length; i++) {
                        ul.children[i].removeAttribute("data-selected");
                    }
                }, 250);
            }
            else {
                MenuBar.setTimeout(menuBar, function () {
                    for (var i = 0; i < ul.children.length; i++) {
                        var child = ul.children[i];
                        if (child === li) {
                            child.dataset.selected = "";
                        }
                        else {
                            child.removeAttribute("data-selected");
                        }
                    }
                }, 250);
            }
        }
    };
    MenuBar.clearTimeout = function (menuBar) {
        if (menuBar.dataset.timeoutId !== undefined) {
            clearTimeout(+menuBar.dataset.timeoutId);
        }
    };
    MenuBar.setTimeout = function (menuBar, handler, timeout) {
        menuBar.dataset.timeoutId = "" + setTimeout(handler, timeout);
    };
    MenuBar.addShortcuts = function (menuBar) {
        menuBar
            .querySelectorAll(":scope [data-shortcut]")
            .forEach(function (element) {
            var accelerator = element;
            var shortcut = accelerator.dataset.shortcut;
            if (shortcut === undefined || shortcut.trim() === "") {
                return;
            }
            var s = " " + shortcut.toLowerCase() + " ";
            var key = "";
            if (s.includes(" alt ")) {
                key += "alt ";
                s = s.replace(" alt ", " ");
            }
            if (s.includes(" control ")) {
                key += "ctrl ";
                s = s.replace(" control ", " ");
            }
            if (s.includes(" ctrl ")) {
                key += "ctrl ";
                s = s.replace(" ctrl ", " ");
            }
            if (s.includes(" meta ")) {
                key += "meta ";
                s = s.replace(" meta ", " ");
            }
            if (s.includes(" shift ")) {
                key += "shift ";
                s = s.replace(" shift ", " ");
            }
            key += s.trim();
            MenuBar.shortcuts.set(key, element);
            var span = document.createElement("span");
            span.textContent = (" " + key + " ")
                .replaceAll(" alt ", " Alt ")
                .replaceAll(" ctrl ", " Ctrl ")
                .replaceAll(" meta ", " Meta ")
                .replaceAll(" shift ", " Shift ")
                .trim()
                .replaceAll(/ +/g, "+");
            accelerator.appendChild(span);
        });
    };
    MenuBar.pointerdown = function (ev) {
        var currentTarget = ev.currentTarget;
        var target = ev.target;
        var menuBar;
        if (currentTarget === document) {
            menuBar = document.evaluate("ancestor-or-self::*[contains(concat(' ', @class, ' '), ' MenuBar ')]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (!menuBar) {
                document
                    .querySelectorAll(".MenuBar")
                    .forEach(function (menuBar) {
                    MenuBar.close(menuBar);
                });
                return;
            }
            if (!menuBar.onpointerdown) {
                menuBar.onpointerdown = MenuBar.pointerdown;
            }
            if (!menuBar.onpointerup) {
                menuBar.onpointerup = MenuBar.pointerup;
            }
            if (!menuBar.onpointerover) {
                menuBar.onpointerover = MenuBar.pointerover;
            }
            if (!menuBar.onpointerleave) {
                menuBar.onpointerleave = MenuBar.pointerleave;
            }
            if (!menuBar.dataset.shortcuts) {
                MenuBar.addShortcuts(menuBar);
                menuBar.dataset.shortcuts = "true";
            }
        }
        else {
            menuBar = ev.currentTarget;
        }
        try {
            if (menuBar.dataset.open !== undefined) {
                if (target === menuBar || (target.parentElement === menuBar && target.tagName !== "li")) {
                    MenuBar.close(menuBar);
                }
                return;
            }
            menuBar.dataset.closed = "";
            var li = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (li === null) {
                return;
            }
            li.dataset.selected = "";
            MenuBar.open(menuBar);
        }
        finally {
            ev.stopPropagation();
        }
    };
    MenuBar.pointerup = function (ev) {
        var target = ev.target;
        var li = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (li === null) {
            return;
        }
        var input = li.querySelector(":scope>input, :scope>:not(ul) input");
        if (input !== null) {
            if (input.type === "radio") {
                if (!input.checked) {
                    input.checked = true;
                }
            }
            else if (input.type === "checkbox") {
                input.checked = !input.checked;
            }
        }
        var menuBar = ev.currentTarget;
        if (li.parentElement === menuBar) {
            // menu
            if (menuBar.dataset.closed !== undefined) {
                menuBar.removeAttribute("data-closed");
            }
            else {
                MenuBar.close(menuBar);
            }
            return;
        }
        var ul = li.querySelector(":scope>ul");
        if (ul !== null) {
            // submenu
            return;
        }
        var hr = li.querySelector(":scope>hr");
        if (hr !== null) {
            return;
        }
        MenuBar.close(menuBar);
    };
    MenuBar.pointerover = function (ev) {
        var menuBar = ev.currentTarget;
        if (menuBar.dataset.open === undefined) {
            return;
        }
        var target = ev.target;
        var li = document.evaluate("ancestor-or-self::li[position() = 1]", target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (li === null) {
            return;
        }
        var ul = li.parentElement;
        if (ul === null) {
            return;
        }
        MenuBar.select(menuBar, ul, li);
    };
    MenuBar.pointerleave = function (ev) {
        var menuBar = ev.currentTarget;
        MenuBar.clearTimeout(menuBar);
        menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected) {
            var ul = selected.querySelector(":scope>ul");
            if (ul === null) {
                selected.removeAttribute("data-selected");
            }
        });
    };
    MenuBar.keydown = function (ev) {
        document
            .querySelectorAll(".MenuBar")
            .forEach(function (element) {
            var menuBar = element;
            if (!menuBar.dataset.shortcuts) {
                MenuBar.addShortcuts(menuBar);
                menuBar.dataset.shortcuts = "true";
            }
        });
        var key = "";
        if (ev.ctrlKey) {
            key += "ctrl ";
        }
        if (ev.shiftKey) {
            key += "shift ";
        }
        if (ev.altKey) {
            key += "alt ";
        }
        if (ev.metaKey) {
            key += "meta ";
        }
        key += ev.key.toLowerCase();
        var element = MenuBar.shortcuts.get(key);
        if (element) {
            element.click();
            ev.preventDefault();
        }
    };
    MenuBar.shortcuts = new Map();
    return MenuBar;
}());
document.addEventListener("pointerdown", MenuBar.pointerdown);
document.addEventListener("keydown", MenuBar.keydown);
/**
 * SplitPane
 *
 * Based on the javax.swing.JSplitPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/splitpane.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html
 *
 * @author Yassuo Toda
 */
var SplitPane = /** @class */ (function () {
    function SplitPane() {
    }
    SplitPane.setDividerProportionalLocation = function (splitPane, proportionalLocation) {
        var verticalSplit = splitPane.dataset.orientation === "vertical-split";
        var pageEndSplitPane = splitPane.dataset.dividerAnchor === "page-end";
        var lineEndSplitPane = splitPane.dataset.dividerAnchor === "line-end";
        var leftComponent = splitPane.children[0];
        var rightComponent = splitPane.children[2];
        var leftComponentRect = leftComponent.getBoundingClientRect();
        var rightComponentRect = rightComponent.getBoundingClientRect();
        var leftComponentComputedStyle = getComputedStyle(leftComponent);
        var rightComponentComputedStyle = getComputedStyle(rightComponent);
        var maximumDividerLocation = 0;
        if (verticalSplit) {
            maximumDividerLocation =
                leftComponentRect.height -
                    +leftComponentComputedStyle.borderTopWidth.replace("px", "") -
                    +leftComponentComputedStyle.borderBottomWidth.replace("px", "");
            maximumDividerLocation +=
                rightComponentRect.height -
                    +rightComponentComputedStyle.borderTopWidth.replace("px", "") -
                    +rightComponentComputedStyle.borderBottomWidth.replace("px", "");
            var dividerLocation = proportionalLocation * maximumDividerLocation;
            if (pageEndSplitPane) {
                rightComponent.style.height = dividerLocation + "px";
            }
            else {
                leftComponent.style.height = dividerLocation + "px";
            }
        }
        else {
            maximumDividerLocation =
                leftComponentRect.width -
                    +leftComponentComputedStyle.borderLeftWidth.replace("px", "") -
                    +leftComponentComputedStyle.borderRightWidth.replace("px", "");
            maximumDividerLocation +=
                rightComponentRect.width -
                    +rightComponentComputedStyle.borderLeftWidth.replace("px", "") -
                    +rightComponentComputedStyle.borderRightWidth.replace("px", "");
            var dividerLocation = proportionalLocation * maximumDividerLocation;
            if (lineEndSplitPane) {
                rightComponent.style.width = dividerLocation + "px";
            }
            else {
                leftComponent.style.width = dividerLocation + "px";
            }
        }
    };
    SplitPane.setDividerLocation = function (splitPane, location) {
        var verticalSplit = splitPane.dataset.orientation === "vertical-split";
        var pageEndSplitPane = splitPane.dataset.dividerAnchor === "page-end";
        var lineEndSplitPane = splitPane.dataset.dividerAnchor === "line-end";
        if (verticalSplit) {
            if (pageEndSplitPane) {
                var rightComponent = splitPane.children[2];
                rightComponent.style.height = location + "px";
            }
            else {
                var leftComponent = splitPane.children[0];
                leftComponent.style.height = location + "px";
            }
        }
        else {
            if (lineEndSplitPane) {
                var rightComponent = splitPane.children[2];
                rightComponent.style.width = location + "px";
            }
            else {
                var leftComponent = splitPane.children[0];
                leftComponent.style.width = location + "px";
            }
        }
    };
    SplitPane.pointerdown = function (ev) {
        var splitPaneDivider = ev.detail.event.currentTarget;
        var splitPane = splitPaneDivider.parentElement;
        var leftComponent = splitPane.children[0];
        var rightComponent = splitPane.children[2];
        var leftComponentRect = leftComponent.getBoundingClientRect();
        var rightComponentRect = rightComponent.getBoundingClientRect();
        var leftComponentComputedStyle = getComputedStyle(leftComponent);
        var rightComponentComputedStyle = getComputedStyle(rightComponent);
        var verticalSplit = splitPane.dataset.orientation === "vertical-split";
        var pageEndSplitPane = splitPane.dataset.dividerAnchor === "page-end";
        var lineEndSplitPane = splitPane.dataset.dividerAnchor === "line-end";
        var offset = 0;
        var maximumDividerLocation = 0;
        if (verticalSplit) {
            if (pageEndSplitPane) {
                offset = ev.detail.event.clientY + rightComponentRect.height;
            }
            else {
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
        }
        else {
            if (lineEndSplitPane) {
                offset = ev.detail.event.clientX + rightComponentRect.width;
            }
            else {
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
        var dragLayer = document.createElement("div");
        dragLayer.classList.add("DragLayer");
        if (verticalSplit) {
            dragLayer.style.cursor = "ns-resize";
        }
        else {
            dragLayer.style.cursor = "ew-resize";
        }
        document.body.appendChild(dragLayer);
        var dragLayerEventListener = {
            pointermove: function (ev) {
                if (verticalSplit) {
                    if (pageEndSplitPane) {
                        var location_1 = Math.min(Math.max(offset - ev.clientY, 0), maximumDividerLocation);
                        rightComponent.style.height = location_1 + "px";
                    }
                    else {
                        var location_2 = Math.min(Math.max(ev.clientY - offset, 0), maximumDividerLocation);
                        leftComponent.style.height = location_2 + "px";
                    }
                }
                else {
                    if (lineEndSplitPane) {
                        var location_3 = Math.min(Math.max(offset - ev.clientX, 0), maximumDividerLocation);
                        rightComponent.style.width = location_3 + "px";
                    }
                    else {
                        var location_4 = Math.min(Math.max(ev.clientX - offset, 0), maximumDividerLocation);
                        leftComponent.style.width = location_4 + "px";
                    }
                }
            },
            pointerup: function (ev) {
                dragLayer.remove();
            },
            pointerleave: function (ev) {
                dragLayer.remove();
            },
        };
        dragLayer.addEventListener("pointermove", dragLayerEventListener.pointermove);
        dragLayer.addEventListener("pointerup", dragLayerEventListener.pointerup);
        dragLayer.addEventListener("pointerleave", dragLayerEventListener.pointerleave);
    };
    return SplitPane;
}());
document.removeEventListener("splitpanedividerpointerdown", SplitPane.pointerdown);
document.addEventListener("splitpanedividerpointerdown", SplitPane.pointerdown);
console.log("splitpanedividerpointerdown added");
/**
 * TabbedPane
 *
 * Based on the javax.swing.JTabbedPane and java.awt.CardLayout
 * https://docs.oracle.com/javase/tutorial/uiswing/components/tabbedpane.html
 * https://docs.oracle.com/javase/7/docs/api/javax/swing/JTabbedPane.html
 * https://docs.oracle.com/javase/tutorial/uiswing/layout/card.html
 * https://docs.oracle.com/javase/7/docs/api/java/awt/CardLayout.html
 *
 * @author Yassuo Toda
 */
var TabbedPane = /** @class */ (function () {
    function TabbedPane() {
    }
    TabbedPane.first = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        TabbedPane.setSelectedTabIndex(tabContainer, cardContainer, 0);
    };
    TabbedPane.next = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        var selectedTabIndex = TabbedPane.getSelectedTabIndex(tabContainer);
        if (selectedTabIndex === -1) {
            selectedTabIndex = 0;
        }
        else {
            selectedTabIndex = (selectedTabIndex + 1) % tabContainer.children.length;
        }
        TabbedPane.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
    };
    TabbedPane.previous = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        var selectedTabIndex = TabbedPane.getSelectedTabIndex(tabContainer);
        if (selectedTabIndex === -1) {
            selectedTabIndex = tabContainer.children.length - 1;
        }
        else {
            selectedTabIndex = (selectedTabIndex + tabContainer.children.length - 1) % tabContainer.children.length;
        }
        TabbedPane.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
    };
    TabbedPane.last = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        TabbedPane.setSelectedTabIndex(tabContainer, cardContainer, tabContainer.children.length - 1);
    };
    TabbedPane.show = function (tabContainer, cardContainer, name) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.getAttribute("name") === name) {
                TabbedPane.setSelectedTabIndex(tabContainer, cardContainer, i);
                break;
            }
        }
    };
    TabbedPane.getSelectedTabIndex = function (tabContainer) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.dataset.selected !== undefined) {
                return i;
            }
        }
        return -1;
    };
    TabbedPane.setSelectedTabIndex = function (tabContainer, cardContainer, selectedTabIndex) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (i === selectedTabIndex) {
                tabComponent.dataset.selected = "";
                var name_1 = tabComponent.getAttribute("name");
                CardContainer.show(cardContainer, name_1);
            }
            else {
                tabComponent.removeAttribute("data-selected");
            }
        }
    };
    TabbedPane.getSelectedTabComponent = function (tabContainer) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.dataset.selected !== undefined) {
                return tabComponent;
            }
        }
        return null;
    };
    TabbedPane.setSelectedTabComponent = function (tabContainer, cardContainer, selectedTabComponent) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent === selectedTabComponent) {
                tabComponent.dataset.selected = "";
                var name_2 = tabComponent.getAttribute("name");
                CardContainer.show(cardContainer, name_2);
            }
            else {
                tabComponent.removeAttribute("data-selected");
            }
        }
    };
    TabbedPane.click = function (ev) {
        var currentTarget = ev.currentTarget;
        var tabComponent;
        if (currentTarget === document) {
            var target = ev.target;
            if (target.classList.contains("TabComponent")) {
                tabComponent = target;
            }
            else if (target.parentElement !== null && target.parentElement.classList.contains("TabComponent")) {
                tabComponent = target.parentElement;
            }
            else {
                return;
            }
            if (!tabComponent.onclick) {
                tabComponent.onclick = TabbedPane.click;
            }
        }
        else {
            tabComponent = currentTarget;
        }
        try {
            var tabContainer = tabComponent.parentElement;
            if (tabContainer === null) {
                return;
            }
            var tabbedPane = tabContainer.parentElement;
            if (tabbedPane === null) {
                return;
            }
            var cardContainer = tabbedPane.querySelector(":scope>.CardContainer");
            if (cardContainer === null) {
                return;
            }
            TabbedPane.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
        }
        finally {
            ev.stopPropagation();
        }
    };
    return TabbedPane;
}());
/**
 * CardContainer
 *
 * @author Yassuo Toda
 */
var CardContainer = /** @class */ (function () {
    function CardContainer() {
    }
    CardContainer.first = function (cardContainer) {
        if (cardContainer.children.length === 0) {
            return;
        }
        CardContainer.setSelectedIndex(cardContainer, 0);
    };
    CardContainer.next = function (cardContainer) {
        if (cardContainer.children.length === 0) {
            return;
        }
        var selectedIndex = CardContainer.getSelectedIndex(cardContainer);
        if (selectedIndex === -1) {
            selectedIndex = 0;
        }
        else {
            selectedIndex = (selectedIndex + 1) % cardContainer.children.length;
        }
        CardContainer.setSelectedIndex(cardContainer, selectedIndex);
    };
    CardContainer.previous = function (cardContainer) {
        if (cardContainer.children.length === 0) {
            return;
        }
        var selectedIndex = CardContainer.getSelectedIndex(cardContainer);
        if (selectedIndex === -1) {
            selectedIndex = cardContainer.children.length - 1;
        }
        else {
            selectedIndex = (selectedIndex + cardContainer.children.length - 1) % cardContainer.children.length;
        }
        CardContainer.setSelectedIndex(cardContainer, selectedIndex);
    };
    CardContainer.last = function (cardContainer) {
        if (cardContainer.children.length === 0) {
            return;
        }
        CardContainer.setSelectedIndex(cardContainer, cardContainer.children.length - 1);
    };
    CardContainer.show = function (cardContainer, name) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (cardComponent.getAttribute("name") === name) {
                CardContainer.setSelectedIndex(cardContainer, i);
                break;
            }
        }
    };
    CardContainer.getSelectedIndex = function (cardContainer) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (cardComponent.style.visibility === "visible") {
                return i;
            }
        }
        return -1;
    };
    CardContainer.setSelectedIndex = function (cardContainer, selectedIndex) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (i === selectedIndex) {
                cardComponent.style.visibility = "visible";
            }
            else {
                cardComponent.style.visibility = "hidden";
            }
        }
    };
    return CardContainer;
}());
document.addEventListener("click", TabbedPane.click);
//# sourceMappingURL=simpa.js.map