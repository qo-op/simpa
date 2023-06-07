/**
 * Simpa.ts
 *
 *  If you are using TypeScript, you can use OptionPane by following this syntax:
 * (window as any).OptionPane.showMessageDialog("Hello, World!");
 *
 * @author Yassuo Toda
 */

if ((window as any).Dialog) {
  document.removeEventListener(
    "pointerdown",
    (window as any).Dialog.pointerdown
  );
}

if ((window as any).MenuBar) {
  document.removeEventListener(
    "pointerdown",
    (window as any).MenuBar.pointerdown
  );
}

if ((window as any).SplitPane) {
  document.removeEventListener(
    "pointerdown",
    (window as any).SplitPane.pointerdown
  );
}

if ((window as any).TabComponent) {
  document.removeEventListener(
    "pointerdown",
    (window as any).TabComponent.pointerdown
  );
}

/**
 * Dialog
 *
 * Based on the javax.swing.JDialog
 * https://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JDialog.html
 *
 * @author Yassuo Toda
 */

class Dialog {
  static dragStart: boolean = false;

  static dialog: HTMLElement;
  static x: number;
  static y: number;
  static width: number;
  static height: number;

  static pointerdown = (ev: PointerEvent) => {
    let dialogTitleBar: HTMLElement;
    const target = ev.target as HTMLElement;
    if (target.classList.contains("DialogTitleBar")) {
      dialogTitleBar = target;
    } else {
      dialogTitleBar = target.closest(".DialogTitleBar") as HTMLElement;
      if (dialogTitleBar === null) {
        return;
      }
    }
    Dialog.dragStart = true;
    Dialog.dialog = dialogTitleBar.closest(".Dialog") as HTMLElement;
    var rect = Dialog.dialog.getBoundingClientRect();
    Dialog.x = ev.clientX - rect.left;
    Dialog.y = ev.clientY - rect.top;
    Dialog.width = rect.width;
    Dialog.height = rect.height;
    Dialog.dialog.style.position = "absolute";
    Dialog.dialog.style.top = rect.top + "px";
    Dialog.dialog.style.left = rect.left + "px";
    document.addEventListener("touchmove", Dialog.preventTouchMove, {
      passive: false,
    });
    document.addEventListener("pointermove", Dialog.pointermove);
    document.addEventListener("pointerup", Dialog.pointerup);
    document.addEventListener("pointerenter", Dialog.pointerenter);
  };

  static preventTouchMove(ev: TouchEvent) {
    ev.preventDefault();
  }

  static pointermove = (ev: PointerEvent) => {
    if (!Dialog.dragStart) {
      return;
    }
    Dialog.dialog.style.top =
      Math.min(
        Math.max(ev.clientY - Dialog.y, 0),
        window.innerHeight - Dialog.height
      ) + "px";
    Dialog.dialog.style.left =
      Math.min(
        Math.max(ev.clientX - Dialog.x, 0),
        window.innerWidth - Dialog.width
      ) + "px";
  };

  static pointerup = (ev: PointerEvent) => {
    Dialog.dragStart = false;
    document.removeEventListener("touchmove", Dialog.preventTouchMove);
    document.removeEventListener("pointermove", Dialog.pointermove);
    document.removeEventListener("pointerup", Dialog.pointerup);
    document.removeEventListener("pointerenter", Dialog.pointerenter);
  };

  static pointerenter = (ev: PointerEvent) => {
    Dialog.pointerup(ev);
  };
}

/**
 * MenuBar
 *
 * Based on the javax.swing.JMenu
 * https://docs.oracle.com/javase/tutorial/uiswing/components/menu.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JMenuBar.html
 *
 * @author Yassuo Toda
 */

class MenuBar {
  static open = (menuBar: HTMLElement) => {
    menuBar.dataset.open = "";
  };

  static close = (menuBar: HTMLElement) => {
    menuBar.dataset.closed = "";
    menuBar.removeAttribute("data-open");
    MenuBar.select(menuBar, menuBar, null);
  };

  static select = (
    menuBar: HTMLElement,
    ul: HTMLElement,
    li: HTMLElement | null
  ) => {
    MenuBar.clearTimeout(menuBar);
    if (ul === menuBar) {
      if (li !== null && li.dataset.selected !== undefined) {
        return;
      }
      menuBar
        .querySelectorAll(":scope li[data-selected]")
        .forEach((selected: Element) => {
          selected.removeAttribute("data-selected");
        });
      if (li !== null) {
        li.dataset.selected = "";
      }
    } else {
      if (li === null) {
        MenuBar.setTimeout(
          menuBar,
          () => {
            for (let i: number = 0; i < ul.children.length; i++) {
              ul.children[i].removeAttribute("data-selected");
            }
          },
          250
        );
      } else {
        MenuBar.setTimeout(
          menuBar,
          () => {
            for (let i: number = 0; i < ul.children.length; i++) {
              const child = ul.children[i] as HTMLElement;
              if (child === li) {
                child.dataset.selected = "";
              } else {
                child.removeAttribute("data-selected");
              }
            }
          },
          250
        );
      }
    }
  };

  static getSelected(menuBar: HTMLElement): HTMLElement | null {
    for (let i: number = 0; i < menuBar.children.length; i++) {
      const li: HTMLElement = <HTMLElement>menuBar.children[i];
      if (li.dataset.selected !== undefined) {
        return li;
      }
    }
    return null;
  }

  static clearTimeout = (menuBar: HTMLElement) => {
    if (menuBar.dataset.timeoutId !== undefined) {
      clearTimeout(+menuBar.dataset.timeoutId);
    }
  };

  static setTimeout = (
    menuBar: HTMLElement,
    handler: TimerHandler,
    timeout: number
  ) => {
    menuBar.dataset.timeoutId = "" + setTimeout(handler, timeout);
  };

  static pointerdown = (ev: PointerEvent) => {
    const currentTarget = ev.currentTarget;
    const target = ev.target as HTMLElement;
    let menuBar: HTMLElement;
    if (currentTarget === document) {
      menuBar = target.closest(".MenuBar") as HTMLElement;
      if (!menuBar) {
        document.querySelectorAll(".MenuBar").forEach((menuBar: Element) => {
          MenuBar.close(menuBar as HTMLElement);
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
    } else {
      menuBar = currentTarget as HTMLElement;
    }
    try {
      const li = target.closest("li");
      if (li === null) {
        return;
      }
      const ul = li.parentElement;
      if (ul === null) {
        return;
      }
      const selected = MenuBar.getSelected(menuBar);
      if (selected === li) {
        if (menuBar.dataset.open === undefined) {
          menuBar.dataset.closed = "";
          MenuBar.open(menuBar);
        }
      } else {
        MenuBar.select(menuBar, ul, li);
        menuBar.dataset.closed = "";
        if (menuBar.dataset.open === undefined) {
          MenuBar.open(menuBar);
        }
      }
    } finally {
      ev.stopPropagation();
    }
  };

  static pointerup = (ev: PointerEvent) => {
    const target = ev.target as HTMLElement;
    const li = target.closest("li");
    if (li === null) {
      return;
    }
    const input: HTMLInputElement | null = li.querySelector(
      ":scope>input, :scope>:not(ul) input"
    );
    if (input !== null) {
      if (input.type === "radio") {
        if (!input.checked) {
          input.checked = true;
        }
      } else if (input.type === "checkbox") {
        input.checked = !input.checked;
      }
    }
    const menuBar = ev.currentTarget as HTMLElement;
    if (li.parentElement === menuBar) {
      // menu
      if (menuBar.dataset.closed !== undefined) {
        menuBar.removeAttribute("data-closed");
      } else {
        MenuBar.close(menuBar);
      }
      return;
    }
    const ul: HTMLElement | null = li.querySelector(":scope>ul");
    if (ul !== null) {
      // submenu
      return;
    }
    const hr: HTMLElement | null = li.querySelector(":scope>hr");
    if (hr !== null) {
      return;
    }
    MenuBar.close(menuBar);
  };

  static mouseover = (ev: MouseEvent) => {
    const menuBar = ev.currentTarget as HTMLElement;
    if (menuBar.dataset.open === undefined) {
      return;
    }
    const target = ev.target as HTMLElement;
    const li = target.closest("li");
    if (li === null) {
      return;
    }
    const ul: HTMLElement | null = li.parentElement;
    if (ul === null) {
      return;
    }
    MenuBar.select(menuBar, ul, li);
  };

  static mouseleave = (ev: MouseEvent) => {
    const menuBar = ev.currentTarget as HTMLElement;
    MenuBar.clearTimeout(menuBar);
    menuBar
      .querySelectorAll(":scope li[data-selected]")
      .forEach((selected: Element) => {
        const ul: HTMLElement | null = selected.querySelector(":scope>ul");
        if (ul === null) {
          selected.removeAttribute("data-selected");
        }
      });
  };
}

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
    OptionPane.optionPaneModalLayer.style.visibility = "inherit";
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          const optionPane = new OptionPane(
            resolve,
            reject,
            null,
            message,
            title,
            "default",
            messageType,
            img
          );
          OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
          optionPane.dialogOkButton?.focus();
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        const optionPane = new OptionPane(
          resolve,
          reject,
          null,
          message,
          title,
          "default",
          messageType
        );
        OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
        optionPane.dialogOkButton?.focus();
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
    OptionPane.optionPaneModalLayer.style.visibility = "inherit";
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          const optionPane = new OptionPane(
            resolve,
            reject,
            null,
            message,
            title,
            optionType,
            messageType ||
              (optionType !== "default" ? "question" : "information"),
            img
          );
          OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
          if (optionPane.dialogOkButton) {
            optionPane.dialogOkButton.focus();
          } else {
            optionPane.dialogYesButton?.focus();
          }
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        const optionPane = new OptionPane(
          resolve,
          reject,
          null,
          message,
          title,
          optionType,
          messageType || (optionType !== "default" ? "question" : "information")
        );
        OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
        if (optionPane.dialogOkButton) {
          optionPane.dialogOkButton.focus();
        } else {
          optionPane.dialogYesButton?.focus();
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
    OptionPane.optionPaneModalLayer.style.visibility = "inherit";
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
          OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
          input.focus();
        };
        img.onerror = function () {
          reject(new Error(`Failed to load image '${icon}'`));
        };
        img.src = icon;
      });
    } else {
      return new Promise((resolve, reject) => {
        const optionPane = new OptionPane(
          resolve,
          reject,
          input,
          message,
          title,
          "ok-cancel",
          messageType
        );
        OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
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
    OptionPane.optionPaneModalLayer.style.visibility = "inherit";
    if (icon) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.alt = "Custom icon";
        img.onload = function () {
          img.style.width = img.naturalWidth + "px";
          img.style.height = img.naturalHeight + "px";
          const optionPane = new OptionPane(
            resolve,
            reject,
            null,
            message,
            title,
            optionType,
            messageType ||
              (optionType !== "default" ? "question" : "information"),
            img,
            options
          );
          OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
          if (initialValue) {
            const index = options.indexOf(initialValue);
            optionPane.dialogButtons[index].focus();
          } else {
            if (optionPane.dialogOkButton) {
              optionPane.dialogOkButton.focus();
            } else {
              optionPane.dialogYesButton?.focus();
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
        const optionPane = new OptionPane(
          resolve,
          reject,
          null,
          message,
          title,
          optionType,
          messageType ||
            (optionType !== "default" ? "question" : "information"),
          undefined,
          options
        );
        OptionPane.optionPaneModalLayer.appendChild(optionPane.dialog);
      });
    }
  };

  static _optionPaneModalLayer: HTMLElement;

  static get optionPaneModalLayer() {
    if (!OptionPane._optionPaneModalLayer) {
      let modalLayer = document.body.querySelector(
        ":scope>.OptionPane.ModalLayer"
      ) as HTMLElement;
      if (modalLayer === null) {
        modalLayer = document.createElement("div");
        modalLayer.classList.add("OptionPane");
        modalLayer.classList.add("ModalLayer");
        modalLayer.classList.add("CenterLayout");
        modalLayer.style.visibility = "inherit";
        document.body.appendChild(modalLayer);
      }
      OptionPane._optionPaneModalLayer = modalLayer;
    }
    return OptionPane._optionPaneModalLayer;
  }

  dialog: HTMLElement;
  dialogTitleBar: HTMLElement;
  dialogTitleTextPane: HTMLElement;
  dialogContentPane: HTMLElement;
  dialogMainPane: HTMLElement;
  dialogIconPane: HTMLElement;
  dialogMessagePane: HTMLElement;
  dialogMessageTextPane: HTMLElement;
  dialogInputPane: HTMLElement | undefined;
  dialogButtonPane: HTMLElement;
  dialogOkButton: HTMLElement | undefined;
  dialogCancelButton: HTMLElement | undefined;
  dialogYesButton: HTMLElement | undefined;
  dialogNoButton: HTMLElement | undefined;
  dialogButtons: HTMLElement[];

  constructor(
    resolve: (input: string) => void,
    reject: (error: Error) => void,
    input: HTMLElement | null,
    message: string,
    title: string,
    optionType: string,
    messageType: string,
    img?: HTMLImageElement,
    options?: string[]
  ) {
    this.dialog = document.createElement("div");
    this.dialog.classList.add("Dialog");
    this.dialog.classList.add("BorderLayout");

    this.dialogTitleBar = OptionPane.createDialogTitleBar();
    this.dialogTitleBar.classList.add("PageStart");
    this.dialog.appendChild(this.dialogTitleBar);

    this.dialogTitleBar.classList.add("BorderLayout");

    this.dialogTitleTextPane = OptionPane.createDialogTitleTextPane(title);
    this.dialogTitleTextPane.style.paddingInline = ".5em";
    this.dialogTitleBar.appendChild(this.dialogTitleTextPane);

    this.dialogContentPane = OptionPane.createDialogContentPane();
    this.dialog.appendChild(this.dialogContentPane);

    this.dialogContentPane.classList.add("BorderLayout");

    this.dialogMainPane = OptionPane.createDialogMainPane();
    this.dialogContentPane.appendChild(this.dialogMainPane);

    this.dialogMainPane.style.padding = ".5em";
    this.dialogMainPane.style.display = "grid";
    this.dialogMainPane.style.gap = ".5em";

    this.dialogIconPane = OptionPane.createDialogIconPane();
    this.dialogIconPane.style.gridRow = "1";
    this.dialogIconPane.style.gridColumn = "1";

    this.dialogIconPane.classList.add("GridBagConstraints");
    this.dialogIconPane.dataset.anchor = "center";

    if (img) {
      this.dialogIconPane.appendChild(img);
      this.dialogMainPane.appendChild(this.dialogIconPane);
    } else {
      const dialogIcon = OptionPane.createDialogIcon(messageType);
      if (dialogIcon) {
        this.dialogIconPane.appendChild(dialogIcon);
        this.dialogMainPane.appendChild(this.dialogIconPane);
      }
    }

    this.dialogMessagePane = OptionPane.createDialogMessagePane();
    this.dialogMessagePane.style.gridRow = "1";
    this.dialogMessagePane.style.gridColumn = "2";
    this.dialogMainPane.appendChild(this.dialogMessagePane);

    this.dialogMessagePane.classList.add("GridBagConstraints");
    this.dialogMessagePane.dataset.anchor = "center";
    this.dialogMessagePane.dataset.fill = "horizontal";

    this.dialogMessageTextPane =
      OptionPane.createDialogMessageTextPane(message);
    this.dialogMessagePane.appendChild(this.dialogMessageTextPane);

    if (input) {
      this.dialogInputPane = OptionPane.createDialogInputPane();
      this.dialogInputPane.style.gridRow = "2";
      this.dialogInputPane.style.gridColumn = "2";
      this.dialogMainPane.appendChild(this.dialogInputPane);

      this.dialogInputPane.classList.add("GridBagConstraints");
      this.dialogInputPane.dataset.fill = "both";

      this.dialogInputPane.appendChild(input);
    }

    this.dialogButtonPane = OptionPane.createDialogButtonPane();
    this.dialogButtonPane.classList.add("PageEnd");
    this.dialogContentPane.appendChild(this.dialogButtonPane);

    this.dialogButtonPane.style.padding = "0 .5em .5em .5em";
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
            this.dialogOkButton?.click();
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
        options.forEach((option) => {
          const dialogButton = OptionPane.createDialogButton(option);
          this.dialogButtonPane.appendChild(dialogButton);

          this.dialogButtons.push(dialogButton);

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
    const modalLayer = document.body.querySelector(
      ":scope>.ModalLayer"
    ) as HTMLElement;
    if (modalLayer !== null) {
      modalLayer.style.visibility = "hidden";
    }
    const button = ev.currentTarget as HTMLElement;
    switch (button.textContent) {
      case "OK":
        resolve((input as HTMLSelectElement | HTMLInputElement).value);
        break;
      default:
        resolve("");
    }
    const dialog = button.closest(".Dialog");
    dialog?.remove();
  };

  handleOption = (
    ev: MouseEvent,
    resolve: (input: string) => void,
    reject: (error: Error) => void
  ) => {
    const modalLayer = document.body.querySelector(
      ":scope>.ModalLayer"
    ) as HTMLElement;
    if (modalLayer !== null) {
      modalLayer.style.visibility = "hidden";
    }
    const button = ev.currentTarget as HTMLElement;
    resolve(button.textContent || "");
    const dialog = button.closest(".Dialog");
    dialog?.remove();
  };

  static createDialogTitleBar() {
    const dialogTitleBar = document.createElement("div");
    dialogTitleBar.classList.add("DialogTitleBar");
    return dialogTitleBar;
  }

  static createDialogTitleTextPane(title: string) {
    const dialogTitleTextPane = document.createElement("div");
    dialogTitleTextPane.classList.add("DialogTitleTextPane");
    dialogTitleTextPane.innerHTML = title.replace(/\n/g, "<br>");
    return dialogTitleTextPane;
  }

  static createDialogContentPane() {
    const dialogContentPane = document.createElement("div");
    dialogContentPane.classList.add("DialogContentPane");
    return dialogContentPane;
  }

  static createDialogMainPane() {
    const dialogMainPane = document.createElement("div");
    dialogMainPane.classList.add("DialogMainPane");
    return dialogMainPane;
  }

  static createDialogIconPane() {
    const dialogIconPane = document.createElement("div");
    dialogIconPane.classList.add("DialogIconPane");
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
        return;
    }
  }

  static createDialogMessagePane() {
    const dialogMessagePane = document.createElement("div");
    dialogMessagePane.classList.add("DialogMessagePane");
    return dialogMessagePane;
  }

  static createDialogMessageTextPane(message: string) {
    const dialogMessageTextPane = document.createElement("div");
    dialogMessageTextPane.classList.add("DialogMessageTextPane");
    dialogMessageTextPane.innerHTML = message.replace(/\n/g, "<br>");
    return dialogMessageTextPane;
  }

  static createDialogInputPane() {
    const dialogInputPane = document.createElement("div");
    dialogInputPane.classList.add("DialogInputPane");
    return dialogInputPane;
  }

  static createDialogButtonPane() {
    const dialogButtonPane = document.createElement("div");
    dialogButtonPane.classList.add("DialogButtonPane");
    return dialogButtonPane;
  }

  static createDialogButton(text: string) {
    const dialogButton = document.createElement("button");
    dialogButton.classList.add("DialogButton");
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

/**
 * SplitPane
 *
 * Based on the javax.swing.JSplitPane
 * https://docs.oracle.com/javase/tutorial/uiswing/components/splitpane.html
 * https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html
 *
 * @author Yassuo Toda
 */

class SplitPane {
  static dragStart: boolean = false;
  static dragLayer: HTMLElement;

  static splitPaneDivider: HTMLElement;
  static splitPane: HTMLElement;
  static leftComponent: HTMLElement;
  static rightComponent: HTMLElement;
  static verticalSplit: boolean = false;
  static offset: number;
  static maximumDividerLocation: number;

  static pointerdown = (ev: PointerEvent) => {
    const target = ev.target as HTMLElement;
    if (!target.classList.contains("SplitPaneDivider")) {
      return;
    }
    SplitPane.dragStart = true;
    SplitPane.splitPaneDivider = target;
    SplitPane.splitPane = SplitPane.splitPaneDivider.closest(
      ".SplitPane"
    ) as HTMLElement;
    SplitPane.leftComponent = SplitPane.splitPane.children[0] as HTMLElement;
    SplitPane.rightComponent = SplitPane.splitPane.children[2] as HTMLElement;
    const leftComponentRect: DOMRect =
      SplitPane.leftComponent.getBoundingClientRect();
    const rightComponentRect: DOMRect =
      SplitPane.rightComponent.getBoundingClientRect();
    SplitPane.verticalSplit =
      SplitPane.splitPane.dataset.orientation === "vertical-split";
    if (SplitPane.verticalSplit) {
      SplitPane.maximumDividerLocation =
        leftComponentRect.height + rightComponentRect.height;
      const percentage =
        (100 * leftComponentRect.height) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.height = percentage + "%";
      SplitPane.rightComponent.style.height = 100 - percentage + "%";
      SplitPane.offset = ev.clientY - leftComponentRect.height;
    } else {
      SplitPane.maximumDividerLocation =
        leftComponentRect.width + rightComponentRect.width;
      const percentage =
        (100 * leftComponentRect.width) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.width = percentage + "%";
      SplitPane.rightComponent.style.width = 100 - percentage + "%";
      SplitPane.offset = ev.clientX - leftComponentRect.width;
    }
    if (SplitPane.verticalSplit) {
      document.body.style.cursor = "ns-resize";
    } else {
      document.body.style.cursor = "ew-resize";
    }
    document.addEventListener("touchmove", SplitPane.preventTouchMove, {
      passive: false,
    });
    document.addEventListener("pointermove", SplitPane.pointermove);
    document.addEventListener("pointerup", SplitPane.pointerup);
    // document.addEventListener("dragstart", SplitPane.dragstart);
    SplitPane.dragLayer = document.body.querySelector(
      ":scope>.DragLayer"
    ) as HTMLElement;
    if (SplitPane.dragLayer === null) {
      SplitPane.dragLayer = document.createElement("div");
      SplitPane.dragLayer.classList.add("DragLayer");
      document.body.appendChild(SplitPane.dragLayer);
    }
    SplitPane.dragLayer.style.visibility = "";
    ev.preventDefault();
  };

  static preventTouchMove(ev: TouchEvent) {
    // ev.preventDefault();
  }

  static pointermove = (ev: PointerEvent) => {
    if (!SplitPane.dragStart) {
      return;
    }
    if (SplitPane.verticalSplit) {
      const dividerLocation = Math.min(
        Math.max(ev.clientY - SplitPane.offset, 0),
        SplitPane.maximumDividerLocation
      );
      const percentage =
        (100 * dividerLocation) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.height = percentage + "%";
      SplitPane.rightComponent.style.height = 100 - percentage + "%";
    } else {
      const dividerLocation = Math.min(
        Math.max(ev.clientX - SplitPane.offset, 0),
        SplitPane.maximumDividerLocation
      );
      const percentage =
        (100 * dividerLocation) / SplitPane.maximumDividerLocation;
      SplitPane.leftComponent.style.width = percentage + "%";
      SplitPane.rightComponent.style.width = 100 - percentage + "%";
    }
    ev.preventDefault();
  };

  static pointerup = (ev: PointerEvent) => {
    SplitPane.dragStart = false;
    document.body.style.cursor = "";
    document.removeEventListener("touchmove", SplitPane.preventTouchMove);
    document.removeEventListener("pointermove", SplitPane.pointermove);
    document.removeEventListener("pointerup", SplitPane.pointerup);
    // document.removeEventListener("dragstart", SplitPane.dragstart);
    if (SplitPane.dragLayer !== null) {
      SplitPane.dragLayer.style.visibility = "hidden";
    }
  };

  /*
    static dragstart = (ev: PointerEvent) => {
      if (ev.target === SplitPane.splitPaneDivider) {
        SplitPane.pointerup(ev);
        ev.preventDefault();
      }
    };
    */
}

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
class TabContainer {
  static setSelectedTabComponent = (
    tabContainer: HTMLElement,
    cardContainer: HTMLElement,
    selectedTabComponent: HTMLElement
  ) => {
    let selectedCardComponent: HTMLElement | null = null;
    for (let i: number = 0; i < tabContainer.children.length; i++) {
      const tabComponent = tabContainer.children[i] as HTMLElement;
      if (tabComponent === selectedTabComponent) {
        const value = tabComponent.getAttribute("value");
        selectedCardComponent = CardContainer.show(cardContainer, value || "");
      }
    }
    if (selectedCardComponent) {
      for (let i: number = 0; i < tabContainer.children.length; i++) {
        const tabComponent = tabContainer.children[i] as HTMLElement;
        if (tabComponent === selectedTabComponent) {
          tabComponent.tabIndex = -1;
        } else {
          tabComponent.tabIndex = 0;
        }
      }
    }
    return selectedCardComponent;
  };
}

/**
 * CardContainer
 *
 * @author Yassuo Toda
 */
class CardContainer {
  static show = (cardContainer: HTMLElement, name: string) => {
    for (let i: number = 0; i < cardContainer.children.length; i++) {
      const cardComponent: HTMLElement = cardContainer.children[
        i
      ] as HTMLElement;
      if (cardComponent.dataset.name === name) {
        return CardContainer.setSelectedIndex(cardContainer, i);
      }
    }
    return null;
  };

  static setSelectedIndex = (
    cardContainer: HTMLElement,
    selectedIndex: number
  ) => {
    let selectedCardComponent: HTMLElement | null = null;
    for (let i: number = 0; i < cardContainer.children.length; i++) {
      const cardComponent: HTMLElement = cardContainer.children[
        i
      ] as HTMLElement;
      if (i === selectedIndex) {
        cardComponent.style.visibility = "";
        cardComponent.focus();
        selectedCardComponent = cardComponent;
      } else {
        cardComponent.style.visibility = "hidden";
      }
    }
    return selectedCardComponent;
  };
}

/**
 * TabComponent
 *
 * @author Yassuo Toda
 */
class TabComponent {
  static pointerdown = (ev: PointerEvent) => {
    const tabComponent = ev.target as HTMLElement;
    const tabContainer = tabComponent.parentElement;
    if (!tabContainer) {
      return;
    }
    const tabbedPane = tabContainer.parentElement;
    if (!tabbedPane) {
      return;
    }
    if (!tabbedPane.classList.contains("TabbedPane")) {
      return;
    }
    const cardContainer: HTMLElement = tabbedPane.children[
      tabbedPane.childElementCount - 1
    ] as HTMLElement;
    if (cardContainer === null) {
      return;
    }
    if (cardContainer === tabContainer) {
      return;
    }
    TabContainer.setSelectedTabComponent(
      tabContainer,
      cardContainer,
      tabComponent
    );
  };
}

document.addEventListener("pointerdown", Dialog.pointerdown);

document.addEventListener("pointerdown", MenuBar.pointerdown);

document.addEventListener("pointerdown", SplitPane.pointerdown);

document.addEventListener("pointerdown", TabComponent.pointerdown);

/**
 *  No FOUC (Flash Of Unstyled Content)
 */

function noFoucHandler() {
  document.documentElement.classList.remove("NoFouc");
  this.removeEventListener("load", noFoucHandler);
}

if (document.readyState !== "complete") {
  document.documentElement.classList.add("NoFouc");
  window.addEventListener("load", noFoucHandler);
}

/*
module.exports = {
  Dialog,
  MenuBar,
  OptionPane,
  SplitPane,
  TabContainer,
  CardContainer,
  TabComponent,
};
*/
