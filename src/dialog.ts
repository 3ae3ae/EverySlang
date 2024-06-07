import { makeElement } from "./utils";
import { dialogOption } from "./model";

export class Dialog {
  private $document: HTMLElement = document.documentElement;
  private $confirmButton: HTMLButtonElement;
  private $cancelButton: HTMLButtonElement;
  private $closeButton: HTMLButtonElement;
  private $dialog: HTMLDialogElement;
  public $title: HTMLHeadingElement;
  public $content: HTMLParagraphElement;
  public $secret: HTMLSpanElement;
  static dialogNumber: number = 0;

  constructor(
    public confirm: Function,
    option: dialogOption,
    public cancel?: Function
  ) {
    this.$dialog = makeElement("dialog", {
      attribute: "id",
      value: "dialog",
      child: makeElement("article", {
        child: [
          makeElement("header", {
            child: makeElement("button", {
              attribute: ["aria-label", "rel", "id"],
              value: ["Close", "prev", "dialogClose" + Dialog.dialogNumber],
            }),
          }),
          makeElement("h2", {
            attribute: "id",
            value: "dialogTitle" + Dialog.dialogNumber,
          }),
          makeElement("p", {
            attribute: "id",
            value: "dialogBody" + Dialog.dialogNumber,
          }),
          makeElement("footer", {
            child: [
              makeElement("button", {
                attribute: "id",
                value: "dialogCancel" + Dialog.dialogNumber,
                class: "secondary",
                textContent: "취소",
              }),
              makeElement("button", {
                attribute: "id",
                value: "dialogConfirm" + Dialog.dialogNumber,
                textContent: "확인",
              }),
              makeElement("span", {
                attribute: "id",
                value: "dialogSecret" + Dialog.dialogNumber,
              }),
            ],
          }),
        ],
      }),
    }) as HTMLDialogElement;
    this.$title = this.$dialog.querySelector(
      "#dialogTitle" + Dialog.dialogNumber
    ) as HTMLHeadingElement;
    this.$cancelButton = this.$dialog.querySelector(
      "#dialogCancel" + Dialog.dialogNumber
    ) as HTMLButtonElement;
    this.$content = this.$dialog.querySelector(
      "#dialogBody" + Dialog.dialogNumber
    ) as HTMLParagraphElement;
    this.$confirmButton = this.$dialog.querySelector(
      "#dialogConfirm" + Dialog.dialogNumber
    ) as HTMLButtonElement;
    this.$closeButton = this.$dialog.querySelector(
      "#dialogClose" + Dialog.dialogNumber
    ) as HTMLButtonElement;
    this.$secret = this.$dialog.querySelector(
      "#dialogSecret" + Dialog.dialogNumber
    ) as HTMLSpanElement;
    this.$title.textContent = option.title;
    this.$content.textContent = option.content;
    this.$cancelButton.hidden = option.hasCancel;
    this.$secret.hidden = true;
    this.$cancelButton.addEventListener("click", (_) =>
      this.cancel ? this.cancel() : this.closeDialog()
    );
    this.$closeButton.addEventListener("click", (_) =>
      this.cancel ? this.cancel() : this.closeDialog()
    );
    this.$cancelButton.hidden = !option.hasCancel;
    this.$confirmButton.addEventListener("click", (_) => this.confirm());
    document.getElementsByTagName("body")[0].appendChild(this.$dialog);
  }
  showDialog() {
    this.$document.classList.add("modal-is-open", "modal-is-opening");
    setTimeout(() => {
      this.$document.classList.remove("modal-is-opening");
    }, 500);
    this.$dialog.showModal();
  }
  closeDialog() {
    this.$document.classList.add("modal-is-closing");
    setTimeout(() => {
      this.$document.classList.remove("modal-is-closing", "modal-is-open");
    }, 500);
    this.$dialog.close();
  }
  get secret() {
    return this.$secret.textContent as string;
  }
  set secret(content: string) {
    this.$secret.textContent = content;
  }
}
