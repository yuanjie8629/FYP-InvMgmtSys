import ContainerCard from '@components/ContainerCard/ContainerCard';
import InputRange from '@components/Input/InputRange';
import InputSelect from '@components/Input/InputSelect';
import Button from '@components/Button/Button';
import Layout from '@components/Layout/Layout';
import Tag, { TagProps } from '@components/Tag/Tag';
import {
  Row,
  Space,
  Select,
  Col,
  Typography,
  Image,
  Dropdown,
  Menu,
} from 'antd';
import InformativeTable from '@components/Table/InformativeTable';
import prodList from './prodList';
import { HiEyeOff, HiPencilAlt, HiTrash } from 'react-icons/hi';
import { MdArrowDropDown } from 'react-icons/md';

const ProdMgmt = () => {
  const { Text, Title } = Typography;
  const { Option } = Select;

  const onSelectBtn = (
    <Space size={15}>
      <Button
        type='primary'
        color='grey'
        icon={
          <HiEyeOff
            size={16}
            style={{ marginRight: 5, position: 'relative', top: 3 }}
          />
        }
      >
        Hide
      </Button>
      <Button
        type='primary'
        color='error'
        icon={
          <HiTrash
            size={16}
            style={{ marginRight: 5, position: 'relative', top: 3 }}
          />
        }
      >
        Delete
      </Button>
    </Space>
  );

  const tabList = [
    { key: 'all', tab: 'All' },
    { key: 'active', tab: 'Active' },
    { key: 'oos', tab: 'Out of Stock' },
    { key: 'hidden', tab: 'Hidden' },
  ];

  const prodInputSelect: {
    defaultVal: string;
    options: {
      val: string;
      label: string;
    }[];
  } = {
    defaultVal: 'prodName',
    options: [
      { val: 'prodName', label: 'Product Name' },
      { val: 'prodSKU', label: 'Product SKU' },
    ],
  };

  const prodCatSelect = {
    placeholder: 'Category',
    options: [
      { val: 'rte', label: 'Ready-To-Eat' },
      { val: 'rtc', label: 'Ready-To-Cook' },
      { val: 'paste', label: 'Paste' },
    ],
  };

  const prodListColumns: {
    title: string;
    dataIndex?: string | string[];
    key: string;
    sorter?: boolean;
    align?: 'left' | 'center' | 'right';
    render?: any;
  }[] = [
    {
      title: 'Product',
      dataIndex: ['prodNm', 'prodCat', 'prodImg'],
      key: 'prod',
      sorter: true,
      render: (_: any, data: { [x: string]: string | undefined }) => (
        <Row>
          <Col>
            <Image src={data['prodImg']} height={120} />
          </Col>
          <Col>
            <Space direction='vertical' size={5}>
              <Button type='link' color='info'>
                {data['prodNm']}
              </Button>
              <Text className='color-grey text-sm'>{data['prodCat']}</Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'prodSKU',
      key: 'prodSKU',
      sorter: true,
    },
    {
      title: 'Price',
      dataIndex: 'prodPrice',
      key: 'prodPrice',
      sorter: true,
      render: (amount: string) => (
        <Text className='color-grey'>RM {parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'prodStock',
      key: 'prodStock',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'prodStatus',
      key: 'prodStatus',
      render: (status: string) => {
        const statusList = [
          { status: 'active', label: 'Active', color: 'success' },
          { status: 'oos', label: 'Out of Stock', color: 'error' },
          { status: 'hidden', label: 'Hidden', color: 'default' },
        ];
        const menu = (
          <Menu>
            {statusList.map((statusItem) =>
              status !== statusItem.status ? (
                <Menu.Item key={statusItem.status}>
                  {statusItem.label}
                </Menu.Item>
              ) : null
            )}
          </Menu>
        );

        interface ProdStatusTagProps extends TagProps {
          color: string;
          children: React.ReactNode;
        }
        const ProdStatusTag = ({
          color,
          children,
          ...props
        }: ProdStatusTagProps) => (
          <Tag minWidth='50%' maxWidth='100%' color={color} {...props}>
            {children}
          </Tag>
        );

        const matchedStatus = statusList.find(
          (statusItem) => status === statusItem.status
        );

        return matchedStatus?.status !== 'oos' ? (
          <Row align='middle'>
            <ProdStatusTag color={matchedStatus!.color}>
              {matchedStatus!.label}
            </ProdStatusTag>
            <Dropdown overlay={menu} placement='bottomRight'>
              <MdArrowDropDown size={25} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Row>
        ) : (
          <ProdStatusTag
            color={
              statusList.find((statusItem) => statusItem.status === 'oos')!
                .color
            }
          >
            {
              statusList.find((statusItem) => statusItem.status === 'oos')!
                .label
            }
          </ProdStatusTag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space direction='vertical' size={5}>
          <Button
            type='link'
            color='info'
            icon={
              <HiPencilAlt
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 3 }}
              />
            }
          >
            Edit
          </Button>
          <Button
            type='link'
            color='info'
            icon={
              <HiTrash
                size={16}
                style={{ marginRight: 5, position: 'relative', top: 2 }}
              />
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className='prod-mgmt'>
        <Space
          direction='vertical'
          size={20}
          className='container-card-wrapper'
        >
          <Row justify='center'>
            <ContainerCard tabList={tabList}>
              <Space direction='vertical' size={40} className='width-full'>
                <Space direction='vertical' size={20} className='width-full'>
                  <Row gutter={[30, 30]}>
                    <Col lg={10} xl={8}>
                      <InputSelect
                        selectBefore={prodInputSelect}
                        placeholder='Input'
                      ></InputSelect>
                    </Col>
                    <Col lg={4} xl={3}>
                      <Select
                        placeholder={prodCatSelect.placeholder}
                        style={{ width: '100%' }}
                      >
                        {prodCatSelect.options.map((option) => (
                          <Option key={option.val} value={option.val}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col lg={7} xl={5}>
                      <InputRange
                        label='Stock'
                        placeholder={['Start', 'End']}
                        min={0}
                      />
                    </Col>
                    <Col lg={12} xl={7}>
                      <InputRange
                        label='Price'
                        placeholder={['Start', 'End']}
                        addonBefore='RM'
                        min={0}
                        precision={2}
                      />
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col>
                      <Button type='primary'>Search</Button>
                    </Col>
                    <Col>
                      <Button>Reset</Button>
                    </Col>
                  </Row>
                </Space>
                <Space direction='vertical' size={15} className='width-full'>
                  <Row justify='space-between'>
                    <Col>
                      <Title level={4}>Product List</Title>
                    </Col>
                    <Col>
                      <Button type='primary'>Add Product</Button>
                    </Col>
                  </Row>
                  <InformativeTable
                    dataSource={prodList}
                    columns={prodListColumns}
                    buttons={onSelectBtn}
                  />
                </Space>
              </Space>
            </ContainerCard>
          </Row>
        </Space>
      </div>
    </Layout>
  );
};

export default ProdMgmt;
