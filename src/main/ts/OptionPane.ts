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
  static showMessageDialog = (
    message: string = "",
    title: string = "Message",
    messageType: string = "information",
    icon?: string
  ) => {
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          let modalLayer: HTMLElement =
            document.body.querySelector(":scope>.ModalLayer");
          if (modalLayer === null) {
            modalLayer = document.createElement("div");
            modalLayer.classList.add("ModalLayer");
            modalLayer.classList.add("CenterLayout");
            modalLayer.style.visibility = "inherit";
            document.body.appendChild(modalLayer);
          }
          const optionPane = new OptionPane(
            resolve,
            reject,
            undefined,
            message,
            title,
            "default",
            messageType,
            img
          );
          modalLayer.appendChild(optionPane.dialog);
          modalLayer.style.visibility = "inherit";
          optionPane.dialogOkButton.focus();
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        let modalLayer: HTMLElement =
          document.body.querySelector(":scope>.ModalLayer");
        if (modalLayer === null) {
          modalLayer = document.createElement("div");
          modalLayer.classList.add("ModalLayer");
          modalLayer.classList.add("CenterLayout");
          modalLayer.style.visibility = "inherit";
          document.body.appendChild(modalLayer);
        }
        const optionPane = new OptionPane(
          resolve,
          reject,
          undefined,
          message,
          title,
          "default",
          messageType
        );
        modalLayer.appendChild(optionPane.dialog);
        modalLayer.style.visibility = "inherit";
        optionPane.dialogOkButton.focus();
      });
    }
  };

  static showConfirmDialog = (
    message: string = "",
    title: string = "Message",
    optionType: string = "yes-no-cancel",
    messageType?: string,
    icon?: string
  ) => {
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          let modalLayer: HTMLElement =
            document.body.querySelector(":scope>.ModalLayer");
          if (modalLayer === null) {
            modalLayer = document.createElement("div");
            modalLayer.classList.add("ModalLayer");
            modalLayer.classList.add("CenterLayout");
            modalLayer.style.visibility = "inherit";
            document.body.appendChild(modalLayer);
          }
          const optionPane = new OptionPane(
            resolve,
            reject,
            undefined,
            message,
            title,
            optionType,
            messageType ||
              (optionType !== "default" ? "question" : "information"),
            img
          );
          modalLayer.appendChild(optionPane.dialog);
          modalLayer.style.visibility = "inherit";
          if (optionPane.dialogOkButton) {
            optionPane.dialogOkButton.focus();
          } else {
            optionPane.dialogYesButton.focus();
          }
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        let modalLayer: HTMLElement =
          document.body.querySelector(":scope>.ModalLayer");
        if (modalLayer === null) {
          modalLayer = document.createElement("div");
          modalLayer.classList.add("ModalLayer");
          modalLayer.classList.add("CenterLayout");
          modalLayer.style.visibility = "inherit";
          document.body.appendChild(modalLayer);
        }
        const optionPane = new OptionPane(
          resolve,
          reject,
          undefined,
          message,
          title,
          optionType,
          messageType || (optionType !== "default" ? "question" : "information")
        );
        modalLayer.appendChild(optionPane.dialog);
        modalLayer.style.visibility = "inherit";
        if (optionPane.dialogOkButton) {
          optionPane.dialogOkButton.focus();
        } else {
          optionPane.dialogYesButton.focus();
        }
      });
    }
  };

  static showInputDialog = (
    message: string = "",
    title: string = "Message",
    messageType: string = "question",
    icon?: string,
    selectionValues?: string[],
    initialSelectionValue?: string
  ) => {
    let input: HTMLElement;
    if (selectionValues) {
      const comboBox = document.createElement("select") as HTMLSelectElement;
      selectionValues.forEach((selectionValue: string) => {
        const option = document.createElement("option");
        option.value = selectionValue;
        option.text = selectionValue;
        comboBox.appendChild(option);
      });
      if (initialSelectionValue) {
        comboBox.value = initialSelectionValue;
      }
      input = comboBox;
    } else {
      const textField = document.createElement("input") as HTMLInputElement;
      textField.type = "text";
      if (initialSelectionValue) {
        textField.value = initialSelectionValue;
      }
      input = textField;
    }
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          let modalLayer: HTMLElement =
            document.body.querySelector(":scope>.ModalLayer");
          if (modalLayer === null) {
            modalLayer = document.createElement("div");
            modalLayer.classList.add("ModalLayer");
            modalLayer.classList.add("CenterLayout");
            modalLayer.style.visibility = "inherit";
            document.body.appendChild(modalLayer);
          }
          const optionPane = new OptionPane(
            resolve,
            reject,
            input,
            message,
            title,
            "ok-cancel",
            messageType,
            img
          );
          modalLayer.appendChild(optionPane.dialog);
          modalLayer.style.visibility = "inherit";
          input.focus();
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        let modalLayer: HTMLElement =
          document.body.querySelector(":scope>.ModalLayer");
        if (modalLayer === null) {
          modalLayer = document.createElement("div");
          modalLayer.classList.add("ModalLayer");
          modalLayer.classList.add("CenterLayout");
          modalLayer.style.visibility = "inherit";
          document.body.appendChild(modalLayer);
        }
        const optionPane = new OptionPane(
          resolve,
          reject,
          input,
          message,
          title,
          "ok-cancel",
          messageType
        );
        modalLayer.appendChild(optionPane.dialog);
        modalLayer.style.visibility = "inherit";
        input.focus();
      });
    }
  };

  static showOptionDialog = (
    message: string = "",
    title: string = "Message",
    optionType: string = "yes-no-cancel",
    messageType: string,
    icon: string,
    options: string[],
    initialValue: string
  ) => {
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          let modalLayer: HTMLElement =
            document.body.querySelector(":scope>.ModalLayer");
          if (modalLayer === null) {
            modalLayer = document.createElement("div");
            modalLayer.classList.add("ModalLayer");
            modalLayer.classList.add("CenterLayout");
            modalLayer.style.visibility = "inherit";
            document.body.appendChild(modalLayer);
          }
          const optionPane = new OptionPane(
            resolve,
            reject,
            undefined,
            message,
            title,
            optionType,
            messageType ||
              (optionType !== "default" ? "question" : "information"),
            img,
            options,
            initialValue
          );
          modalLayer.appendChild(optionPane.dialog);
          modalLayer.style.visibility = "inherit";
          if (initialValue) {
            const index = options.indexOf(initialValue);
            optionPane.dialogButtons[index].focus();
          } else {
            if (optionPane.dialogOkButton) {
              optionPane.dialogOkButton.focus();
            } else {
              optionPane.dialogYesButton.focus();
            }
          }
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        let modalLayer: HTMLElement =
          document.body.querySelector(":scope>.ModalLayer");
        if (modalLayer === null) {
          modalLayer = document.createElement("div");
          modalLayer.classList.add("ModalLayer");
          modalLayer.classList.add("CenterLayout");
          modalLayer.style.visibility = "inherit";
          document.body.appendChild(modalLayer);
        }
        const optionPane = new OptionPane(
          resolve,
          reject,
          undefined,
          message,
          title,
          optionType,
          messageType ||
            (optionType !== "default" ? "question" : "information"),
          undefined,
          options,
          initialValue
        );
        modalLayer.appendChild(optionPane.dialog);
        modalLayer.style.visibility = "inherit";
      });
    }
  };

  dialog: HTMLElement;
  dialogTitleBar: HTMLElement;
  dialogTitleLabel: HTMLElement;
  dialogContentPane: HTMLElement;
  dialogMainPane: HTMLElement;
  dialogIconPane: HTMLElement;
  dialogMessagePane: HTMLElement;
  dialogMessageLabel: HTMLElement;
  dialogInputPane: HTMLElement;
  dialogButtonPane: HTMLElement;
  dialogOkButton: HTMLElement;
  dialogCancelButton: HTMLElement;
  dialogYesButton: HTMLElement;
  dialogNoButton: HTMLElement;
  dialogButtons: HTMLElement[];

  constructor(
    resolve: (input: string) => void,
    reject: (error: Error) => void,
    input: HTMLElement,
    message: string,
    title: string,
    optionType: string,
    messageType: string,
    img?: HTMLImageElement,
    options?: string[],
    initialValue?: string
  ) {
    this.dialog = document.createElement("div");
    this.dialog.classList.add("Dialog");
    this.dialog.classList.add("BorderLayout");

    this.dialogTitleBar = OptionPane.createDialogTitleBar();
    this.dialogTitleBar.classList.add("PageStart");
    this.dialog.appendChild(this.dialogTitleBar);

    this.dialogTitleBar.classList.add("BorderLayout");

    this.dialogTitleLabel = OptionPane.createDialogTitleLabel(title);
    this.dialogTitleLabel.style.paddingInline = ".5em";
    this.dialogTitleBar.appendChild(this.dialogTitleLabel);

    this.dialogContentPane = OptionPane.createDialogContentPane();
    this.dialog.appendChild(this.dialogContentPane);

    this.dialogContentPane.style.padding = ".5em";
    this.dialogContentPane.classList.add("BorderLayout");

    this.dialogMainPane = OptionPane.createDialogMainPane();
    this.dialogMainPane.style.marginBlockEnd = ".5em";
    this.dialogContentPane.appendChild(this.dialogMainPane);

    this.dialogMainPane.style.display = "grid";
    this.dialogMainPane.style.rowGap = ".5em";

    this.dialogIconPane = OptionPane.createDialogIconPane();
    this.dialogIconPane.style.gridRow = "1";
    this.dialogIconPane.style.gridColumn = "1";
    this.dialogMainPane.appendChild(this.dialogIconPane);

    this.dialogIconPane.classList.add("CenterLayout");

    if (img) {
      this.dialogIconPane.style.marginInlineEnd = ".5em";
      this.dialogIconPane.appendChild(img);
    } else {
      const dialogIcon = OptionPane.createDialogIcon(messageType);
      if (dialogIcon !== null) {
        this.dialogIconPane.style.marginInlineEnd = ".5em";
        this.dialogIconPane.appendChild(dialogIcon);
      }
    }

    this.dialogMessagePane = OptionPane.createDialogMessagePane();
    this.dialogMessagePane.style.gridRow = "1";
    this.dialogMessagePane.style.gridColumn = "2";
    this.dialogMainPane.appendChild(this.dialogMessagePane);

    this.dialogMessagePane.classList.add("GridBagConstraints");
    this.dialogMessagePane.dataset.anchor = "center";
    this.dialogMessagePane.dataset.fill = "horizontal";

    this.dialogMessageLabel = OptionPane.createDialogMessageLabel(message);
    this.dialogMessagePane.appendChild(this.dialogMessageLabel);

    if (input) {
      this.dialogInputPane = OptionPane.createDialogInputPane();
      this.dialogInputPane.style.gridRow = "2";
      this.dialogInputPane.style.gridColumn = "2";
      this.dialogMainPane.appendChild(this.dialogInputPane);

      this.dialogInputPane.classList.add("BorderLayout");

      this.dialogInputPane.appendChild(input);
    }

    this.dialogButtonPane = OptionPane.createDialogButtonPane();
    this.dialogButtonPane.classList.add("PageEnd");
    this.dialogContentPane.appendChild(this.dialogButtonPane);

    this.dialogButtonPane.classList.add("FlowLayout");
    this.dialogButtonPane.style.gap = ".5em";

    this.dialogButtons = [];

    if (input) {
      this.dialogOkButton = OptionPane.createDialogButton("OK");
      this.dialogButtonPane.appendChild(this.dialogOkButton);

      this.dialogButtons.push(this.dialogOkButton);

      this.dialogOkButton.onclick = (ev: MouseEvent) =>
        this.handleInput(ev, resolve, reject, input);

      if (input.tagName === "INPUT" && input.getAttribute("type") === "text") {
        input.onkeydown = (ev: KeyboardEvent) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            this.dialogOkButton.click();
          }
        };
      }

      this.dialogCancelButton = OptionPane.createDialogButton("Cancel");
      this.dialogButtonPane.appendChild(this.dialogCancelButton);

      this.dialogButtons.push(this.dialogCancelButton);

      this.dialogCancelButton.onclick = (ev: MouseEvent) =>
        this.handleInput(ev, resolve, reject, input);
    } else {
      if (options) {
        options.forEach(function (option) {
          const dialogButton = OptionPane.createDialogButton(option);
          this.dialogButtonPane.appendChild(dialogButton);

          this.dialogButtons.push(this.dialogButton);

          dialogButton.onclick = (ev: MouseEvent) =>
            this.handleOption(ev, resolve, reject);
        });
      } else {
        if (optionType === "default" || optionType === "ok-cancel") {
          this.dialogOkButton = OptionPane.createDialogButton("OK");
          this.dialogButtonPane.appendChild(this.dialogOkButton);

          this.dialogButtons.push(this.dialogOkButton);

          this.dialogOkButton.onclick = (ev: MouseEvent) =>
            this.handleOption(ev, resolve, reject);
        }
        if (optionType === "yes-no" || optionType === "yes-no-cancel") {
          this.dialogYesButton = OptionPane.createDialogButton("Yes");
          this.dialogButtonPane.appendChild(this.dialogYesButton);

          this.dialogButtons.push(this.dialogYesButton);

          this.dialogYesButton.onclick = (ev: MouseEvent) =>
            this.handleOption(ev, resolve, reject);
        }
        if (optionType === "yes-no" || optionType === "yes-no-cancel") {
          this.dialogNoButton = OptionPane.createDialogButton("No");
          this.dialogButtonPane.appendChild(this.dialogNoButton);

          this.dialogButtons.push(this.dialogNoButton);

          this.dialogNoButton.onclick = (ev: MouseEvent) =>
            this.handleOption(ev, resolve, reject);
        }
        if (optionType === "yes-no-cancel" || optionType === "ok-cancel") {
          this.dialogCancelButton = OptionPane.createDialogButton("Cancel");
          this.dialogButtonPane.appendChild(this.dialogCancelButton);

          this.dialogButtons.push(this.dialogCancelButton);

          this.dialogCancelButton.onclick = (ev: MouseEvent) =>
            this.handleOption(ev, resolve, reject);
        }
      }
    }
  }

  handleInput = (
    ev: MouseEvent,
    resolve: (input: string) => void,
    reject: (error: Error) => void,
    input: HTMLElement
  ) => {
    try {
      const modalLayer: HTMLElement =
        document.body.querySelector(":scope>.ModalLayer");
      if (modalLayer !== null) {
        modalLayer.style.visibility = "hidden";
      }
      const button = ev.currentTarget as HTMLElement;
      switch (button.textContent) {
        case "OK":
          resolve((input as HTMLSelectElement | HTMLInputElement).value);
          break;
        default:
          resolve(null);
      }
      const dialog = button.closest(".Dialog");
      dialog.remove();
    } catch (e) {
      reject(e);
    }
  };

  handleOption = (
    ev: MouseEvent,
    resolve: (input: string) => void,
    reject: (error: Error) => void
  ) => {
    try {
      const modalLayer: HTMLElement =
        document.body.querySelector(":scope>.ModalLayer");
      if (modalLayer !== null) {
        modalLayer.style.visibility = "hidden";
      }
      const button = ev.currentTarget as HTMLElement;
      resolve(button.textContent);
      const dialog = button.closest(".Dialog");
      dialog.remove();
    } catch (e) {
      reject(e);
    }
  };

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
        warningIcon.style.fill = "Gold";
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

  static createDialogMessagePane() {
    const dialogMessagePane = document.createElement("div");
    return dialogMessagePane;
  }

  static createDialogMessageLabel(message: string) {
    const dialogMessageLabel = document.createElement("div");
    dialogMessageLabel.classList.add("CenterLayout");
    dialogMessageLabel.textContent = message;
    return dialogMessageLabel;
  }

  static createDialogInputPane() {
    const dialogInputPane = document.createElement("div");
    return dialogInputPane;
  }

  static createDialogButtonPane() {
    const dialogButtonPane = document.createElement("div");
    return dialogButtonPane;
  }

  static createDialogButton(text: string) {
    const dialogButton = document.createElement("button");
    dialogButton.textContent = text;
    return dialogButton;
  }

  /*
   * Icons designed by Google.
   * Icons sourced from Material-UI (mui.com) Material Icons collection.
   * You can find the original icons and more at: https://mui.com/material-ui/material-icons/
   */

  static createErrorIcon() {
    const errorIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    errorIcon.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
    );
    errorIcon.appendChild(path);
    return errorIcon;
  }

  static createInformationIcon() {
    const informationIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    informationIcon.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
    );
    informationIcon.appendChild(path);
    return informationIcon;
  }

  static createWarningIcon() {
    const warningIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    warningIcon.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
    );
    warningIcon.appendChild(path);
    return warningIcon;
  }

  static createQuestionIcon() {
    const questionIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    questionIcon.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
    );
    questionIcon.appendChild(path);
    return questionIcon;
  }
}
