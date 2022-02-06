import Button, { ButtonProps } from '@components/Button';
import { Col, List, ListProps, Row, Typography } from 'antd';

interface DescriptionListProps extends Omit<ListProps<any>, 'dataSource'> {
  dataSource: {
    key: string;
    label: string;
    desc?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  }[];
  buttons?: string[];
  buttonProps?: ButtonProps;
  onButtonClick?: (key: string) => void;
}

const DescriptionList = ({
  dataSource,
  buttons,
  onButtonClick,
  buttonProps,
  ...props
}: DescriptionListProps) => {
  const { Text } = Typography;

  const actions = (item) =>
    buttons.map((btn) => (
      <Button
        key={item.key}
        onClick={() => onButtonClick(item.key)}
        {...buttonProps}
      >
        {btn}
      </Button>
    ));

  const renderItem = (item: {
    label: string;
    desc?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <List.Item actions={actions(item)}>
      <Row className='full-width' align='middle'>
        <Col span={5}>
          <List.Item.Meta
            avatar={item.icon}
            // eslint-disable-next-line react/jsx-no-undef
            title={<Text className='text-lg'>{item.label}</Text>}
            description={<Text type='secondary'>{item.desc}</Text>}
          />
        </Col>
        <Col>
          <div>{item.content}</div>
        </Col>
      </Row>
    </List.Item>
  );
  return <List dataSource={dataSource} renderItem={renderItem} {...props} />;
};

export default DescriptionList;
