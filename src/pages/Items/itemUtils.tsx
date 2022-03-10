import { Image } from 'antd';

export const getItemDetails = (selectedRecord) => {
  const selected = [];
  selectedRecord.forEach((prod) =>
    selected.push({
      key: prod.item_id,
      title: prod.name,
      desc: prod.sku,
      icon: (
        <Image src={prod.thumbnail} height={40} width={40} preview={false} />
      ),
    })
  );
  return selected;
};

export const getItemInvDetails = (selectedRecord) => {
  const selected = [];
  selectedRecord.forEach((prod) =>
    selected.push({
      key: prod.item_id,
      title: prod.name,
      desc: prod.sku,
      content: prod.stock,
      icon: (
        <Image src={prod.thumbnail} height={40} width={40} preview={false} />
      ),
    })
  );
  return selected;
};
