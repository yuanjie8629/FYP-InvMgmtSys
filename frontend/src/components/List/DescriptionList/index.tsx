import Button, { ButtonProps } from '@components/Button';
import { Col, List, ListProps, Row, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { TitleProps } from 'antd/es/typography/Title';

export interface DescriptionListDataProps {
  key: string;
  title: string;
  desc?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
};

export type TitleTextProps = TextProps | TitleProps;


export interface DescriptionListProps extends Omit<ListProps<any>, 'dataSource'> {
  dataSource: DescriptionListDataProps[];
  buttons?: string[];
  buttonProps?: ButtonProps;
  titleProps?: TextProps | TitleProps;
  descProps?: TextProps | TitleProps;
  onButtonClick?: (key: string) => void;
}

const DescriptionList = ({
  dataSource,
  buttons,
  onButtonClick = () => '',
  buttonProps,
  titleProps,
  descProps,
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
    title: string;
    desc?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <List.Item actions={buttons !== undefined && actions(item)}>
      <Row className='full-width' align='middle'>
        <Col span={item.content !== undefined ? 5 : 24}>
          <List.Item.Meta
            avatar={item.icon}
            title={
              <Text className='text-lg' {...titleProps}>
                {item.title}
              </Text>
            }
            description={
              <Text type='secondary' {...descProps}>
                {item.desc}
              </Text>
            }
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
