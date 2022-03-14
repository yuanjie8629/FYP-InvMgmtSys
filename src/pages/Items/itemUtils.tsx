import { InformativeTableButtonProps } from '@components/Table/InformativeTable';
import { Image } from 'antd';

export const getItemDetails = (selectedRecord) => {
  const selected = [];
  selectedRecord.forEach((record) =>
    selected.push({
      key: record.id,
      title: record.name,
      desc: record.sku,
      icon: (
        <Image src={record.thumbnail} height={40} width={40} preview={false} />
      ),
    })
  );
  return selected;
};

export const getItemInvDetails = (selectedRecord) => {
  const selected = [];
  selectedRecord.forEach((record) =>
    selected.push({
      key: record.id,
      title: record.name,
      desc: record.sku,
      content: record.stock,
      icon: (
        <Image src={record.thumbnail} height={40} width={40} preview={false} />
      ),
    })
  );
  return selected;
};

export interface selectButtonsProps {
  label: 'activate' | 'hide' | 'delete';
  element: (props: any) => JSX.Element;
}

export const onItemSelectBtn: (
  btns: selectButtonsProps[]
) => InformativeTableButtonProps = (btns: selectButtonsProps[]) => {
  return [
    {
      element: btns.find((btn) => btn.label === 'activate').element,
      key: 'activate',
      fltr: [{ fld: 'status', value: 'hidden', rel: 'eq' }],
    },
    {
      element: btns.find((btn) => btn.label === 'hide').element,
      key: 'hide',
      fltr: [{ fld: 'status', value: 'active', rel: 'eq' }],
    },
    {
      element: btns.find((btn) => btn.label === 'delete').element,
      key: 'delete',
    },
  ];
};

export const onInvSelectBtn: (
  btn: (props: any) => JSX.Element
) => InformativeTableButtonProps = (btn: (props: any) => JSX.Element) => [
  {
    element: btn,
    key: 'bulkUpd',
  },
];
