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
/**
 * Dialog
 *
 * @author Yassuo Toda
 */
var Dialog = /** @class */ (function () {
    function Dialog() {
    }
    Dialog.preventTouchMove = function (ev) {
        ev.preventDefault();
    };
    Dialog.dragStart = false;
    Dialog.pointerdown = function (ev) {
        var target = ev.target;
        if (!target.classList.contains("DialogTitleBar")) {
            return;
        }
        Dialog.dragStart = true;
        var dialogTitle = target;
        Dialog.dialog = dialogTitle.closest(".Dialog");
        var rect = Dialog.dialog.getBoundingClientRect();
        Dialog.x = ev.clientX - rect.left;
        Dialog.y = ev.clientY - rect.top;
        Dialog.dialog.style.position = "absolute";
        Dialog.dialog.style.top = rect.top + "px";
        Dialog.dialog.style.left = rect.left + "px";
        document.addEventListener("touchmove", Dialog.preventTouchMove, { passive: false });
        document.addEventListener("pointermove", Dialog.pointermove);
        document.addEventListener("pointerup", Dialog.pointerup);
        document.addEventListener("pointerenter", Dialog.pointerenter);
    };
    Dialog.pointermove = function (ev) {
        if (!Dialog.dragStart) {
            return;
        }
        Dialog.dialog.style.top = (ev.clientY - Dialog.y) + "px";
        Dialog.dialog.style.left = (ev.clientX - Dialog.x) + "px";
    };
    Dialog.pointerup = function (ev) {
        Dialog.dragStart = false;
        document.removeEventListener("touchmove", Dialog.preventTouchMove);
        document.removeEventListener("pointermove", Dialog.pointermove);
        document.removeEventListener("pointerup", Dialog.pointerup);
        document.removeEventListener("pointerenter", Dialog.pointerenter);
    };
    Dialog.pointerenter = function (ev) {
        Dialog.pointerup(ev);
    };
    return Dialog;
}());
document.addEventListener("pointerdown", Dialog.pointerdown);
/**
 * MenuBar
 *
 * Based on the javax.swing.JMenu
 * https://docs.oracle.com/javase/tutorial/uiswing/components/menu.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JMenuBar.html
 *
 * @author Yassuo Toda
 */
if (window["MenuBar"]) {
    document.removeEventListener("pointerdown", window["MenuBar"].pointerdown);
}
var MenuBar = /** @class */ (function () {
    function MenuBar() {
    }
    MenuBar.getSelected = function (menuBar) {
        for (var i = 0; i < menuBar.children.length; i++) {
            var li = menuBar.children[i];
            if (li.dataset.selected !== undefined) {
                return li;
            }
        }
        return null;
    };
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
    MenuBar.pointerdown = function (ev) {
        var currentTarget = ev.currentTarget;
        var target = ev.target;
        var menuBar;
        if (currentTarget === document) {
            menuBar = target.closest(".MenuBar");
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
            if (ev.pointerType === "mouse") {
                if (!menuBar.onmouseover) {
                    menuBar.onmouseover = MenuBar.mouseover;
                }
                if (!menuBar.onmouseleave) {
                    menuBar.onmouseleave = MenuBar.mouseleave;
                }
            }
        }
        else {
            menuBar = currentTarget;
        }
        try {
            var li = target.closest("li");
            if (li === null) {
                return;
            }
            var ul = li.parentElement;
            if (ul === null) {
                return;
            }
            var selected = MenuBar.getSelected(menuBar);
            if (selected === li) {
                if (menuBar.dataset.open === undefined) {
                    menuBar.dataset.closed = "";
                    MenuBar.open(menuBar);
                }
            }
            else {
                MenuBar.select(menuBar, ul, li);
                menuBar.dataset.closed = "";
                if (menuBar.dataset.open === undefined) {
                    MenuBar.open(menuBar);
                }
            }
        }
        finally {
            ev.stopPropagation();
        }
    };
    MenuBar.pointerup = function (ev) {
        var target = ev.target;
        var li = target.closest("li");
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
    MenuBar.mouseover = function (ev) {
        var menuBar = ev.currentTarget;
        if (menuBar.dataset.open === undefined) {
            return;
        }
        var target = ev.target;
        var li = target.closest("li");
        if (li === null) {
            return;
        }
        var ul = li.parentElement;
        if (ul === null) {
            return;
        }
        MenuBar.select(menuBar, ul, li);
    };
    MenuBar.mouseleave = function (ev) {
        var menuBar = ev.currentTarget;
        MenuBar.clearTimeout(menuBar);
        menuBar.querySelectorAll(":scope li[data-selected]").forEach(function (selected) {
            var ul = selected.querySelector(":scope>ul");
            if (ul === null) {
                selected.removeAttribute("data-selected");
            }
        });
    };
    return MenuBar;
}());
document.addEventListener("pointerdown", MenuBar.pointerdown);
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
var SplitPane = /** @class */ (function () {
    function SplitPane() {
    }
    SplitPane.preventTouchMove = function (ev) {
        ev.preventDefault();
    };
    SplitPane.dragStart = false;
    SplitPane.verticalSplit = false;
    SplitPane.pointerdown = function (ev) {
        var target = ev.target;
        if (!target.classList.contains("SplitPaneDivider")) {
            return;
        }
        console.log("pointerdown");
        SplitPane.dragStart = true;
        SplitPane.splitPaneDivider = target;
        SplitPane.splitPane = SplitPane.splitPaneDivider.closest(".SplitPane");
        SplitPane.leftComponent = SplitPane.splitPane.children[0];
        SplitPane.rightComponent = SplitPane.splitPane.children[2];
        var leftComponentRect = SplitPane.leftComponent.getBoundingClientRect();
        var rightComponentRect = SplitPane.rightComponent.getBoundingClientRect();
        SplitPane.verticalSplit =
            SplitPane.splitPane.dataset.orientation === "vertical-split";
        if (SplitPane.verticalSplit) {
            SplitPane.maximumDividerLocation = leftComponentRect.height + rightComponentRect.height;
            var percentage = 100 * leftComponentRect.height / SplitPane.maximumDividerLocation;
            SplitPane.leftComponent.style.height = percentage + "%";
            SplitPane.rightComponent.style.height = (100 - percentage) + "%";
            SplitPane.offset = ev.clientY - leftComponentRect.height;
        }
        else {
            SplitPane.maximumDividerLocation = leftComponentRect.width + rightComponentRect.width;
            var percentage = 100 * leftComponentRect.width / SplitPane.maximumDividerLocation;
            SplitPane.leftComponent.style.width = percentage + "%";
            SplitPane.rightComponent.style.width = (100 - percentage) + "%";
            SplitPane.offset = ev.clientX - leftComponentRect.width;
        }
        if (SplitPane.verticalSplit) {
            document.body.style.cursor = "ns-resize";
        }
        else {
            document.body.style.cursor = "ew-resize";
        }
        document.addEventListener("touchmove", SplitPane.preventTouchMove, { passive: false });
        document.addEventListener("pointermove", SplitPane.pointermove);
        document.addEventListener("pointerup", SplitPane.pointerup);
        document.addEventListener("dragstart", SplitPane.dragstart);
        SplitPane.dragLayer = document.body.querySelector(":scope>.DragLayer");
        if (SplitPane.dragLayer === null) {
            SplitPane.dragLayer = document.createElement("div");
            SplitPane.dragLayer.classList.add("DragLayer");
            document.body.appendChild(SplitPane.dragLayer);
        }
        SplitPane.dragLayer.style.visibility = "inherit";
        ev.preventDefault();
    };
    SplitPane.pointermove = function (ev) {
        if (!SplitPane.dragStart) {
            return;
        }
        if (SplitPane.verticalSplit) {
            var dividerLocation = Math.min(Math.max(ev.clientY - SplitPane.offset, 0), SplitPane.maximumDividerLocation);
            var percentage = 100 * dividerLocation / SplitPane.maximumDividerLocation;
            SplitPane.leftComponent.style.height = percentage + "%";
            SplitPane.rightComponent.style.height = (100 - percentage) + "%";
        }
        else {
            var dividerLocation = Math.min(Math.max(ev.clientX - SplitPane.offset, 0), SplitPane.maximumDividerLocation);
            var percentage = 100 * dividerLocation / SplitPane.maximumDividerLocation;
            SplitPane.leftComponent.style.width = percentage + "%";
            SplitPane.rightComponent.style.width = (100 - percentage) + "%";
        }
        ev.preventDefault();
    };
    SplitPane.pointerup = function (ev) {
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
    SplitPane.dragstart = function (ev) {
        console.log("dragstart: " + ev.target);
        if (ev.target === SplitPane.splitPaneDivider) {
            SplitPane.pointerup(ev);
            ev.preventDefault();
        }
    };
    return SplitPane;
}());
document.addEventListener("pointerdown", SplitPane.pointerdown);
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
if (window["TabComponent"]) {
    document.removeEventListener("pointerdown", window["TabComponent"].pointerdown);
}
/**
 * TabContainer
 *
 * @author Yassuo Toda
 */
var TabContainer = /** @class */ (function () {
    function TabContainer() {
    }
    TabContainer.first = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        TabContainer.setSelectedTabIndex(tabContainer, cardContainer, 0);
    };
    TabContainer.next = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        var selectedTabIndex = TabContainer.getSelectedTabIndex(tabContainer);
        if (selectedTabIndex === -1) {
            selectedTabIndex = 0;
        }
        else {
            selectedTabIndex = (selectedTabIndex + 1) % tabContainer.children.length;
        }
        TabContainer.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
    };
    TabContainer.previous = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        var selectedTabIndex = TabContainer.getSelectedTabIndex(tabContainer);
        if (selectedTabIndex === -1) {
            selectedTabIndex = tabContainer.children.length - 1;
        }
        else {
            selectedTabIndex = (selectedTabIndex + tabContainer.children.length - 1) % tabContainer.children.length;
        }
        TabContainer.setSelectedTabIndex(tabContainer, cardContainer, selectedTabIndex);
    };
    TabContainer.last = function (tabContainer, cardContainer) {
        if (tabContainer.children.length === 0) {
            return;
        }
        TabContainer.setSelectedTabIndex(tabContainer, cardContainer, tabContainer.children.length - 1);
    };
    TabContainer.show = function (tabContainer, cardContainer, name) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.getAttribute("name") === name) {
                TabContainer.setSelectedTabIndex(tabContainer, cardContainer, i);
                break;
            }
        }
    };
    TabContainer.getSelectedTabIndex = function (tabContainer) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.dataset.selected !== undefined) {
                return i;
            }
        }
        return -1;
    };
    TabContainer.setSelectedTabIndex = function (tabContainer, cardContainer, selectedTabIndex) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (i === selectedTabIndex) {
                tabComponent.tabIndex = -1;
                var value = tabComponent.getAttribute("value");
                CardContainer.show(cardContainer, value);
            }
            else {
                tabComponent.tabIndex = 0;
            }
        }
    };
    TabContainer.getSelectedTabComponent = function (tabContainer) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent.dataset.selected !== undefined) {
                return tabComponent;
            }
        }
        return null;
    };
    TabContainer.setSelectedTabComponent = function (tabContainer, cardContainer, selectedTabComponent) {
        for (var i = 0; i < tabContainer.children.length; i++) {
            var tabComponent = tabContainer.children[i];
            if (tabComponent === selectedTabComponent) {
                tabComponent.tabIndex = -1;
                var value = tabComponent.getAttribute("value");
                CardContainer.show(cardContainer, value);
            }
            else {
                tabComponent.tabIndex = 0;
            }
        }
    };
    return TabContainer;
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
            if (cardComponent.dataset.name === name) {
                CardContainer.setSelectedIndex(cardContainer, i);
                break;
            }
        }
    };
    CardContainer.getSelectedIndex = function (cardContainer) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (cardComponent.style.visibility === "inherit") {
                return i;
            }
        }
        return -1;
    };
    CardContainer.setSelectedIndex = function (cardContainer, selectedIndex) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (i === selectedIndex) {
                cardComponent.style.visibility = "inherit";
                cardComponent.focus();
            }
            else {
                cardComponent.style.visibility = "hidden";
            }
        }
    };
    return CardContainer;
}());
/**
 * TabComponent
 *
 * @author Yassuo Toda
 */
var TabComponent = /** @class */ (function () {
    function TabComponent() {
    }
    TabComponent.pointerdown = function (ev) {
        var tabComponent = ev.target;
        var tabContainer = tabComponent.parentElement;
        if (!tabContainer) {
            return;
        }
        var tabbedPane = tabContainer.parentElement;
        if (!tabbedPane) {
            return;
        }
        if (!tabbedPane.classList.contains("TabbedPane")) {
            return;
        }
        var cardContainer = tabbedPane.children[tabbedPane.childElementCount - 1];
        if (cardContainer === null) {
            return;
        }
        TabContainer.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
    };
    return TabComponent;
}());
document.addEventListener("pointerdown", TabComponent.pointerdown);
//# sourceMappingURL=simpa.js.map