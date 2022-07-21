interface ClipboardItem {
  readonly types: string[];
  readonly presentationStyle: "unspecified" | "inline" | "attachment";
  getType(): Promise<Blob>;
}

interface ClipboardItemData {
  [mimeType: string]: Blob | string | Promise<Blob | string>;
}

interface Clipboard {
  read(): Promise<DataTransfer>;
  write(data: ClipboardItem[]): Promise<void>;
}

declare var ClipboardItem: {
  prototype: ClipboardItem;
  new (itemData: ClipboardItemData): ClipboardItem;
};

declare module "vue-virtual-scroller" {}

declare module "blob-polyfill" {
  export = Blob;
}
