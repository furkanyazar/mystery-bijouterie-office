import { CKEditor } from "@ckeditor/ckeditor5-react";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough.js";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";

import "@ckeditor/ckeditor5-build-classic/build/translations/tr";

export default function index({ id, onChange, value, disabled }: Props) {
  return <CKEditor id={id} data={value} editor={ClassicEditor} onChange={onChange} config={editorConfig} disabled={disabled} />;
}

interface Props {
  id: string;
  value: string;
  onChange?: any;
  disabled?: boolean;
}

const editorConfig = {
  toolbar: {
    items: ["undo", "redo", "|", "bold", "italic", "underline", "strikethrough", "|", "bulletedList", "numberedList", "|", "insertTable"],
  },
  language: "tr",
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  plugins: [Bold, Italic, Strikethrough, Underline, Essentials, List, Paragraph, Table, TableToolbar],
};
