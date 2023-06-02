/**
 * OptionPane
 * 
 * Based on the javax.swing.JOptionPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JOptionPane.html
 * 
 * @author Yassuo Toda
 */

class OptionPane {

    static showMessageDialog = (message: string = "", title: string = "Message", messageType: string = "information", icon?: string) => {
        return new Promise((resolve, reject) => {
            let modalLayer: HTMLElement = document.body.querySelector(":scope>.ModalLayer");
            if (modalLayer === null) {
                modalLayer = document.createElement("div");
                modalLayer.classList.add("ModalLayer");
                modalLayer.classList.add("CenterLayout");
                modalLayer.style.visibility = "inherit";
                document.body.appendChild(modalLayer);
            }
            const dialog = OptionPane.createDialog(resolve, reject, message, title, "default", messageType, icon);
            modalLayer.appendChild(dialog);
            modalLayer.style.visibility = "inherit";
        });
    }

    static showConfirmDialog(message: string = "", title: string = "Message", optionType: string = "yes-no-cancel", messageType?: string, icon?: string) {
        return new Promise((resolve, reject) => {
            let modalLayer: HTMLElement = document.body.querySelector(":scope>.ModalLayer");
            if (modalLayer === null) {
                modalLayer = document.createElement("div");
                modalLayer.classList.add("ModalLayer");
                modalLayer.classList.add("CenterLayout");
                modalLayer.style.visibility = "inherit";
                document.body.appendChild(modalLayer);
            }
            const dialog = OptionPane.createDialog(resolve, reject, message, title, optionType, messageType || (optionType !== "default" ? "question" : "information"), icon);
            modalLayer.appendChild(dialog);
            modalLayer.style.visibility = "inherit";
        });
    }

    static createDialog(resolve: (input: string) => void, reject: (error: Error) => void, message: string, title: string, optionType: string, messageType: string, icon?: string) {
        try {
            const dialog = document.createElement("div");
            dialog.classList.add("Dialog");
            dialog.classList.add("BorderLayout");

            const dialogTitleBar = OptionPane.createDialogTitleBar();
            dialogTitleBar.classList.add("PageStart");
            dialog.appendChild(dialogTitleBar);

            dialogTitleBar.classList.add("BorderLayout");

            const dialogTitleLabel = OptionPane.createDialogTitleLabel(title);
            dialogTitleLabel.style.paddingInline = ".5em";
            dialogTitleBar.appendChild(dialogTitleLabel);

            const dialogContentPane = OptionPane.createDialogContentPane();
            dialog.appendChild(dialogContentPane);

            dialogContentPane.style.padding = ".5em";
            dialogContentPane.classList.add("BorderLayout");

            const dialogMainPane = OptionPane.createDialogMainPane();
            dialogMainPane.style.marginBlockEnd = ".5em";
            dialogContentPane.appendChild(dialogMainPane);

            dialogMainPane.classList.add("BorderLayout");

            const dialogIconPane = OptionPane.createDialogIconPane();
            dialogIconPane.classList.add("LineStart");
            dialogMainPane.appendChild(dialogIconPane);

            dialogIconPane.classList.add("CenterLayout");

            if (icon) {
                const dialogIcon = OptionPane.createCustomIcon(icon);
                dialogIconPane.appendChild(dialogIcon);
                dialogIconPane.style.marginInlineEnd = ".5em";
            } else {
                const dialogIcon = OptionPane.createDialogIcon(messageType);
                if (dialogIcon !== null) {
                    dialogIconPane.appendChild(dialogIcon);
                    dialogIconPane.style.marginInlineEnd = ".5em";
                }
            }

            const dialogMessageInputPane = OptionPane.createDialogMessageInputPane();
            dialogMainPane.appendChild(dialogMessageInputPane);

            dialogMessageInputPane.classList.add("BorderLayout");

            const dialogMessageLabel = OptionPane.createDialogMessageLabel(message);
            dialogMessageInputPane.appendChild(dialogMessageLabel);

            const dialogButtonPane = OptionPane.createDialogButtonPane();
            dialogButtonPane.classList.add("PageEnd");
            dialogContentPane.appendChild(dialogButtonPane);

            dialogButtonPane.classList.add("FlowLayout");
            dialogButtonPane.style.gap = ".5em";

            const handleClick = (ev: MouseEvent) => {
                try {
                    const button = ev.currentTarget as HTMLElement;
                    resolve(button.textContent);
                    const dialog = button.closest(".Dialog");
                    dialog.remove();
                    const modalLayer: HTMLElement = document.body.querySelector(":scope>.ModalLayer");
                    if (modalLayer !== null) {
                        modalLayer.style.visibility = "hidden";
                    }
                } catch (e) {
                    reject(e);
                }
            }

            const dialogOkButton = OptionPane.createDialogOkButton("OK");
            dialogButtonPane.appendChild(dialogOkButton);

            dialogOkButton.onclick = handleClick;

            if (optionType === "yes-no" || optionType === "yes-no-cancel") {

                const dialogYesButton = OptionPane.createDialogYesButton("Yes");
                dialogButtonPane.appendChild(dialogYesButton);

                dialogYesButton.onclick = handleClick;
            }

            if (optionType === "yes-no" || optionType === "yes-no-cancel") {

                const dialogNoButton = OptionPane.createDialogNoButton("No");
                dialogButtonPane.appendChild(dialogNoButton);

                dialogNoButton.onclick = handleClick;
            }

            if (optionType === "yes-no-cancel" || optionType === "ok-cancel") {

                const dialogCancelButton = OptionPane.createDialogCancelButton("Cancel");
                dialogButtonPane.appendChild(dialogCancelButton);

                dialogCancelButton.onclick = handleClick;
            }

            return dialog;
        } catch (e) {
            reject(e);
        }
    }

    static createDialogTitleBar() {
        const dialogTitleBar = document.createElement("div");
        dialogTitleBar.classList.add("DialogTitleBar");
        return dialogTitleBar;
    }

    static createDialogTitleLabel(title: string) {
        const dialogTitleLabel = document.createElement("span");
        dialogTitleLabel.textContent = title;
        return dialogTitleLabel;
    }

    static createDialogContentPane() {
        const dialogContentPane = document.createElement("div");
        return dialogContentPane;
    }

    static createDialogMainPane() {
        const dialogMainPane = document.createElement("div");
        return dialogMainPane;
    }

    static createDialogIconPane() {
        const dialogIconPane = document.createElement("div");
        return dialogIconPane;
    }

    static createCustomIcon(icon: string) {
        const customIcon = document.createElement("img");
        customIcon.src = icon;
        customIcon.alt = "Custom icon";
        return customIcon;
    }

    static createDialogIcon(messageType: string) {
        switch (messageType) {
            case "error":
                const errorIcon = OptionPane.createErrorIcon();
                errorIcon.style.fill = "Red";
                errorIcon.style.width = "24px";
                return errorIcon;
            case "information":
                const informationIcon = OptionPane.createInformationIcon();
                informationIcon.style.fill = "Blue";
                informationIcon.style.width = "24px";
                return informationIcon;
            case "warning":
                const warningIcon = OptionPane.createWarningIcon();
                warningIcon.style.fill = "GoldenRod";
                warningIcon.style.width = "24px";
                return warningIcon;
            case "question":
                const questionIcon = OptionPane.createQuestionIcon();
                questionIcon.style.fill = "Green";
                questionIcon.style.width = "24px";
                return questionIcon;
            case "plain":
                return null;
        }
    }

    static createDialogMessageInputPane() {
        const dialogMessageInputPane = document.createElement("div");
        return dialogMessageInputPane;
    }

    static createDialogMessageLabel(message: string) {
        const dialogMessageLabel = document.createElement("div");
        dialogMessageLabel.classList.add("CenterLayout");
        dialogMessageLabel.textContent = message;
        return dialogMessageLabel;
    }

    static createDialogButtonPane() {
        const dialogButtonPane = document.createElement("div");
        return dialogButtonPane;
    }

    static createDialogOkButton(text: string) {
        const dialogOkButton = document.createElement("button");
        dialogOkButton.textContent = text;
        return dialogOkButton;
    }

    static createDialogYesButton(text: string) {
        const dialogYesButton = document.createElement("button");
        dialogYesButton.textContent = text;
        return dialogYesButton;
    }

    static createDialogNoButton(text: string) {
        const dialogNoButton = document.createElement("button");
        dialogNoButton.textContent = text;
        return dialogNoButton;
    }

    static createDialogCancelButton(text: string) {
        const dialogCancelButton = document.createElement("button");
        dialogCancelButton.textContent = text;
        return dialogCancelButton;
    }

    /*
     * Icons designed by Google.
     * Icons sourced from Material-UI (mui.com) Material Icons collection.
     * You can find the original icons and more at: https://mui.com/material-ui/material-icons/
     */

    static createErrorIcon() {
        const errorIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        errorIcon.setAttribute("viewBox", "0 0 24 24");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z");
        errorIcon.appendChild(path);
        return errorIcon;
    }

    static createInformationIcon() {
        const informationIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        informationIcon.setAttribute("viewBox", "0 0 24 24");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z");
        informationIcon.appendChild(path);
        return informationIcon;
    }

    static createWarningIcon() {
        const warningIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        warningIcon.setAttribute("viewBox", "0 0 24 24");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z");
        warningIcon.appendChild(path);
        return warningIcon;
    }

    static createQuestionIcon() {
        const questionIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        questionIcon.setAttribute("viewBox", "0 0 24 24");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z");
        questionIcon.appendChild(path);
        return questionIcon;
    }
}
