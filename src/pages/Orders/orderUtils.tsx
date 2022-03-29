export const getOrderDetails = (selectedRecord) => {
  const selected = [];
  selectedRecord.forEach((record) =>
    selected.push({
      key: record.id,
      title: `#${record.id}`,
      desc: record.email,
    })
  );
  return selected;
};
