import BraftEditor, {
  BraftEditorProps,
  BuiltInControlType,
} from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';
import './TextEditor.less';

BraftEditor.use(
  ColorPicker({
    clearButtonText: 'Clear',
    closeButtonText: 'Close',
  })
);

BraftEditor.use(
  Table({
    columnResizable: true,
    exportAttrString: 'border="1" class="braft-table"',
  })
);

const TextEditor = (props: BraftEditorProps) => {
  const excludeCtrl: BuiltInControlType[] = ['fullscreen', 'media'];

  return <BraftEditor language='en' excludeControls={excludeCtrl} {...props} />;
};

export default TextEditor;
