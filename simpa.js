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
var Dialog = /** @class */ (function () {
    function Dialog() {
    }
    Dialog.preventTouchMove = function (ev) {
        ev.preventDefault();
    };
    Dialog.dragStart = false;
    Dialog.pointerdown = function (ev) {
        var dialogTitleBar;
        var target = ev.target;
        if (target.classList.contains("DialogTitleBar")) {
            dialogTitleBar = target;
        }
        else {
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
    };
    Dialog.pointermove = function (ev) {
        if (!Dialog.dragStart) {
            return;
        }
        Dialog.dialog.style.top = Math.min(Math.max(ev.clientY - Dialog.y, 0), window.innerHeight - Dialog.height) + "px";
        Dialog.dialog.style.left = Math.min(Math.max(ev.clientX - Dialog.x, 0), window.innerWidth - Dialog.width) + "px";
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
 * OptionPane
 *
 * Based on the javax.swing.JOptionPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JOptionPane.html
 *
 * @author Yassuo Toda
 */
var OptionPane = /** @class */ (function () {
    function OptionPane() {
    }
    OptionPane.showConfirmDialog = function (message, title, optionType, messageType, icon) {
        if (message === void 0) { message = ""; }
        if (title === void 0) { title = "Message"; }
        if (optionType === void 0) { optionType = "yes-no-cancel"; }
        return new Promise(function (resolve, reject) {
            var modalLayer = document.body.querySelector(":scope>.ModalLayer");
            if (modalLayer === null) {
                modalLayer = document.createElement("div");
                modalLayer.classList.add("ModalLayer");
                modalLayer.classList.add("CenterLayout");
                modalLayer.style.visibility = "inherit";
                document.body.appendChild(modalLayer);
            }
            var dialog = OptionPane.createDialog(resolve, reject, message, title, optionType, messageType || (optionType !== "default" ? "question" : "information"), icon);
            modalLayer.appendChild(dialog);
            modalLayer.style.visibility = "inherit";
        });
    };
    OptionPane.createDialog = function (resolve, reject, message, title, optionType, messageType, icon) {
        try {
            var dialog = document.createElement("div");
            dialog.classList.add("Dialog");
            dialog.classList.add("BorderLayout");
            var dialogTitleBar = OptionPane.createDialogTitleBar();
            dialogTitleBar.classList.add("PageStart");
            dialog.appendChild(dialogTitleBar);
            dialogTitleBar.classList.add("BorderLayout");
            var dialogTitleLabel = OptionPane.createDialogTitleLabel(title);
            dialogTitleLabel.style.paddingInline = ".5em";
            dialogTitleBar.appendChild(dialogTitleLabel);
            var dialogContentPane = OptionPane.createDialogContentPane();
            dialog.appendChild(dialogContentPane);
            dialogContentPane.style.padding = ".5em";
            dialogContentPane.classList.add("BorderLayout");
            var dialogMainPane = OptionPane.createDialogMainPane();
            dialogMainPane.style.marginBlockEnd = ".5em";
            dialogContentPane.appendChild(dialogMainPane);
            dialogMainPane.classList.add("BorderLayout");
            var dialogIconPane = OptionPane.createDialogIconPane();
            dialogIconPane.classList.add("LineStart");
            dialogMainPane.appendChild(dialogIconPane);
            dialogIconPane.classList.add("CenterLayout");
            if (icon) {
                var dialogIcon = OptionPane.createCustomIcon(icon);
                dialogIconPane.appendChild(dialogIcon);
                dialogIconPane.style.marginInlineEnd = ".5em";
            }
            else {
                var dialogIcon = OptionPane.createDialogIcon(messageType);
                if (dialogIcon !== null) {
                    dialogIconPane.appendChild(dialogIcon);
                    dialogIconPane.style.marginInlineEnd = ".5em";
                }
            }
            var dialogMessageInputPane = OptionPane.createDialogMessageInputPane();
            dialogMainPane.appendChild(dialogMessageInputPane);
            dialogMessageInputPane.classList.add("BorderLayout");
            var dialogMessageLabel = OptionPane.createDialogMessageLabel(message);
            dialogMessageInputPane.appendChild(dialogMessageLabel);
            var dialogButtonPane = OptionPane.createDialogButtonPane();
            dialogButtonPane.classList.add("PageEnd");
            dialogContentPane.appendChild(dialogButtonPane);
            dialogButtonPane.classList.add("FlowLayout");
            dialogButtonPane.style.gap = ".5em";
            var handleClick = function (ev) {
                try {
                    var button = ev.currentTarget;
                    resolve(button.textContent);
                    var dialog_1 = button.closest(".Dialog");
                    dialog_1.remove();
                    var modalLayer = document.body.querySelector(":scope>.ModalLayer");
                    if (modalLayer !== null) {
                        modalLayer.style.visibility = "hidden";
                    }
                }
                catch (e) {
                    reject(e);
                }
            };
            if (optionType === "default" || optionType === "ok-cancel") {
                var dialogOkButton = OptionPane.createDialogOkButton("OK");
                dialogButtonPane.appendChild(dialogOkButton);
                dialogOkButton.onclick = handleClick;
            }
            if (optionType === "yes-no" || optionType === "yes-no-cancel") {
                var dialogYesButton = OptionPane.createDialogYesButton("Yes");
                dialogButtonPane.appendChild(dialogYesButton);
                dialogYesButton.onclick = handleClick;
            }
            if (optionType === "yes-no" || optionType === "yes-no-cancel") {
                var dialogNoButton = OptionPane.createDialogNoButton("No");
                dialogButtonPane.appendChild(dialogNoButton);
                dialogNoButton.onclick = handleClick;
            }
            if (optionType === "yes-no-cancel" || optionType === "ok-cancel") {
                var dialogCancelButton = OptionPane.createDialogCancelButton("Cancel");
                dialogButtonPane.appendChild(dialogCancelButton);
                dialogCancelButton.onclick = handleClick;
            }
            return dialog;
        }
        catch (e) {
            reject(e);
        }
    };
    OptionPane.createDialogTitleBar = function () {
        var dialogTitleBar = document.createElement("div");
        dialogTitleBar.classList.add("DialogTitleBar");
        return dialogTitleBar;
    };
    OptionPane.createDialogTitleLabel = function (title) {
        var dialogTitleLabel = document.createElement("span");
        dialogTitleLabel.textContent = title;
        return dialogTitleLabel;
    };
    OptionPane.createDialogContentPane = function () {
        var dialogContentPane = document.createElement("div");
        return dialogContentPane;
    };
    OptionPane.createDialogMainPane = function () {
        var dialogMainPane = document.createElement("div");
        return dialogMainPane;
    };
    OptionPane.createDialogIconPane = function () {
        var dialogIconPane = document.createElement("div");
        return dialogIconPane;
    };
    OptionPane.createCustomIcon = function (icon) {
        var customIcon = document.createElement("img");
        customIcon.src = icon;
        customIcon.alt = "Custom icon";
        return customIcon;
    };
    OptionPane.createDialogIcon = function (messageType) {
        switch (messageType) {
            case "error":
                var errorIcon = OptionPane.createErrorIcon();
                errorIcon.style.fill = "Red";
                errorIcon.style.width = "24px";
                return errorIcon;
            case "information":
                var informationIcon = OptionPane.createInformationIcon();
                informationIcon.style.fill = "Blue";
                informationIcon.style.width = "24px";
                return informationIcon;
            case "warning":
                var warningIcon = OptionPane.createWarningIcon();
                warningIcon.style.fill = "GoldenRod";
                warningIcon.style.width = "24px";
                return warningIcon;
            case "question":
                var questionIcon = OptionPane.createQuestionIcon();
                questionIcon.style.fill = "Green";
                questionIcon.style.width = "24px";
                return questionIcon;
            case "plain":
                return null;
        }
    };
    OptionPane.createDialogMessageInputPane = function () {
        var dialogMessageInputPane = document.createElement("div");
        return dialogMessageInputPane;
    };
    OptionPane.createDialogMessageLabel = function (message) {
        var dialogMessageLabel = document.createElement("div");
        dialogMessageLabel.classList.add("CenterLayout");
        dialogMessageLabel.textContent = message;
        return dialogMessageLabel;
    };
    OptionPane.createDialogButtonPane = function () {
        var dialogButtonPane = document.createElement("div");
        return dialogButtonPane;
    };
    OptionPane.createDialogOkButton = function (text) {
        var dialogOkButton = document.createElement("button");
        dialogOkButton.textContent = text;
        return dialogOkButton;
    };
    OptionPane.createDialogYesButton = function (text) {
        var dialogYesButton = document.createElement("button");
        dialogYesButton.textContent = text;
        return dialogYesButton;
    };
    OptionPane.createDialogNoButton = function (text) {
        var dialogNoButton = document.createElement("button");
        dialogNoButton.textContent = text;
        return dialogNoButton;
    };
    OptionPane.createDialogCancelButton = function (text) {
        var dialogCancelButton = document.createElement("button");
        dialogCancelButton.textContent = text;
        return dialogCancelButton;
    };
    /*
     * Icons designed by Google.
     * Icons sourced from Material-UI (mui.com) Material Icons collection.
     * You can find the original icons and more at: https://mui.com/material-ui/material-icons/
     */
    OptionPane.createErrorIcon = function () {
        var errorIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        errorIcon.setAttribute("viewBox", "0 0 24 24");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z");
        errorIcon.appendChild(path);
        return errorIcon;
    };
    OptionPane.createInformationIcon = function () {
        var informationIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        informationIcon.setAttribute("viewBox", "0 0 24 24");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z");
        informationIcon.appendChild(path);
        return informationIcon;
    };
    OptionPane.createWarningIcon = function () {
        var warningIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        warningIcon.setAttribute("viewBox", "0 0 24 24");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z");
        warningIcon.appendChild(path);
        return warningIcon;
    };
    OptionPane.createQuestionIcon = function () {
        var questionIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        questionIcon.setAttribute("viewBox", "0 0 24 24");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z");
        questionIcon.appendChild(path);
        return questionIcon;
    };
    OptionPane.showMessageDialog = function (message, title, messageType, icon) {
        if (message === void 0) { message = ""; }
        if (title === void 0) { title = "Message"; }
        if (messageType === void 0) { messageType = "information"; }
        return new Promise(function (resolve, reject) {
            var modalLayer = document.body.querySelector(":scope>.ModalLayer");
            if (modalLayer === null) {
                modalLayer = document.createElement("div");
                modalLayer.classList.add("ModalLayer");
                modalLayer.classList.add("CenterLayout");
                modalLayer.style.visibility = "inherit";
                document.body.appendChild(modalLayer);
            }
            var dialog = OptionPane.createDialog(resolve, reject, message, title, "default", messageType, icon);
            modalLayer.appendChild(dialog);
            modalLayer.style.visibility = "inherit";
        });
    };
    return OptionPane;
}());
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
        SplitPane.dragLayer.style.visibility = "";
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
            if (cardComponent.style.visibility !== "hidden") {
                return i;
            }
        }
        return -1;
    };
    CardContainer.setSelectedIndex = function (cardContainer, selectedIndex) {
        for (var i = 0; i < cardContainer.children.length; i++) {
            var cardComponent = cardContainer.children[i];
            if (i === selectedIndex) {
                cardComponent.style.visibility = "";
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
        if (cardContainer === tabContainer) {
            return;
        }
        TabContainer.setSelectedTabComponent(tabContainer, cardContainer, tabComponent);
    };
    return TabComponent;
}());
document.addEventListener("pointerdown", TabComponent.pointerdown);
//# sourceMappingURL=simpa.js.map