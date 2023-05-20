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
var DialogTitlePane = /** @class */ (function () {
    function DialogTitlePane() {
    }
    DialogTitlePane.pointerdown = function (ev) {
        var dialogTitle = ev.detail.event.currentTarget;
        var dialog = dialogTitle.closest(".Dialog");
        var rect = dialog.getBoundingClientRect();
        var x = ev.detail.event.clientX - rect.left;
        var y = ev.detail.event.clientY - rect.top;
        var dragLayer = document.createElement("div");
        document.body.appendChild(dragLayer);
        dragLayer.classList.add("DragLayer");
        var dragLayerEventListener = {
            pointermove: function (ev) {
                dialog.style.left = ev.clientX - x + "px";
                dialog.style.top = ev.clientY - y + "px";
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
    return DialogTitlePane;
}());
document.addEventListener("dialogtitlepanepointerdown", DialogTitlePane.pointerdown);
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
var SplitPane = /** @class */ (function () {
    function SplitPane() {
    }
    SplitPane.dragStart = false;
    SplitPane.verticalSplit = false;
    SplitPane.pointerdown = function (ev) {
        var target = ev.target;
        if (!target.classList.contains("SplitPaneDivider")) {
            return;
        }
        SplitPane.dragStart = true;
        /*
        SplitPane.scrollPane = target.closest(".ScrollPane");
        if (SplitPane.scrollPane) {
          SplitPane.scrollPane.dataset.disabled = "true";
        }
        */
        document.body.style.overflow = "hidden";
        var splitPaneDivider = target;
        var splitPane = splitPaneDivider.closest(".SplitPane");
        SplitPane.leftComponent = splitPane.children[0];
        SplitPane.rightComponent = splitPane.children[2];
        var leftComponentRect = SplitPane.leftComponent.getBoundingClientRect();
        var rightComponentRect = SplitPane.rightComponent.getBoundingClientRect();
        var leftComponentComputedStyle = getComputedStyle(SplitPane.leftComponent);
        var rightComponentComputedStyle = getComputedStyle(SplitPane.rightComponent);
        SplitPane.verticalSplit =
            splitPane.dataset.orientation === "vertical-split";
        SplitPane.endAnchor =
            splitPane.dataset.dividerAnchor === "end";
        if (SplitPane.verticalSplit) {
            if (SplitPane.endAnchor) {
                SplitPane.offset = ev.clientY + rightComponentRect.height;
            }
            else {
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
        }
        else {
            if (SplitPane.endAnchor) {
                SplitPane.offset = ev.clientX + rightComponentRect.width;
            }
            else {
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
        }
        else {
            document.body.style.cursor = "ew-resize";
        }
        document.addEventListener("pointermove", SplitPane.pointermove);
        document.addEventListener("pointerup", SplitPane.pointerup);
        document.addEventListener("pointerenter", SplitPane.pointerenter);
    };
    SplitPane.pointermove = function (ev) {
        if (!SplitPane.dragStart) {
            return;
        }
        if (SplitPane.verticalSplit) {
            if (SplitPane.endAnchor) {
                var dividerLocation = Math.min(Math.max(SplitPane.offset - ev.clientY, 0), SplitPane.maximumDividerLocation);
                SplitPane.rightComponent.style.height = dividerLocation + "px";
            }
            else {
                var dividerLocation = Math.min(Math.max(ev.clientY - SplitPane.offset, 0), SplitPane.maximumDividerLocation);
                SplitPane.leftComponent.style.height = dividerLocation + "px";
            }
        }
        else {
            if (SplitPane.endAnchor) {
                var dividerLocation = Math.min(Math.max(SplitPane.offset - ev.clientX, 0), SplitPane.maximumDividerLocation);
                SplitPane.rightComponent.style.width = dividerLocation + "px";
            }
            else {
                var dividerLocation = Math.min(Math.max(ev.clientX - SplitPane.offset, 0), SplitPane.maximumDividerLocation);
                SplitPane.leftComponent.style.width = dividerLocation + "px";
            }
        }
    };
    SplitPane.pointerup = function (ev) {
        SplitPane.dragStart = false;
        document.body.style.overflow = "";
        document.removeEventListener("pointermove", SplitPane.pointermove);
        document.removeEventListener("pointerup", SplitPane.pointerup);
        document.removeEventListener("pointerenter", SplitPane.pointerenter);
        document.body.style.cursor = "";
    };
    SplitPane.pointerenter = function (ev) {
        SplitPane.dragStart = false;
        document.body.style.overflow = "";
        document.removeEventListener("pointermove", SplitPane.pointermove);
        document.removeEventListener("pointerup", SplitPane.pointerup);
        document.removeEventListener("pointerenter", SplitPane.pointerenter);
        document.body.style.cursor = "";
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
                tabComponent.dataset.selected = "";
                var name_1 = tabComponent.getAttribute("name");
                CardContainer.show(cardContainer, name_1);
            }
            else {
                tabComponent.removeAttribute("data-selected");
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
                tabComponent.dataset.selected = "";
                var name_2 = tabComponent.getAttribute("name");
                CardContainer.show(cardContainer, name_2);
            }
            else {
                tabComponent.removeAttribute("data-selected");
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
/**
 * TabComponent
 *
 * @author Yassuo Toda
 */
var TabComponent = /** @class */ (function () {
    function TabComponent() {
    }
    TabComponent.pointerdown = function (ev) {
        var tabComponent = ev.detail.event.currentTarget;
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
            TabContainer.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
        }
        finally {
            ev.stopPropagation();
        }
    };
    return TabComponent;
}());
document.addEventListener("tabcomponentpointerdow", TabComponent.pointerdown);
//# sourceMappingURL=simpa.js.map