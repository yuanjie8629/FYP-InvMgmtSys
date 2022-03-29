import React, { useState } from 'react';
import { Affix, AffixProps, Card, Col, Row, Typography } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import { AcceptButton, RejectButton } from '@components/Button/ActionButton';
import SpinMask from '@components/Spin/SpinMask';

export interface AffixCustRegProps extends AffixProps {
  loading?: boolean;
  disabled?: boolean;
  accept?: string;
  onClick?: (accept?: boolean) => void;
}

const AffixCustReg = ({
  loading = false,
  disabled = false,
  onClick = () => null,
  accept,
  ...props
}: Omit<AffixCustRegProps, 'children'>) => {
  const { Text } = Typography;
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  return (
    <Affix
      onChange={(affixed) =>
        showCard ? setShowCard(false) : setShowCard(true)
      }
      {...props}
    >
      <Card
        bordered={false}
        style={
          showCard
            ? {
                width: '100%',
                boxShadow: '0 -1px 8px 0 rgb(39 52 120 / 12%)',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }
            : { width: '100%', background: 'none' }
        }
        bodyStyle={showCard ? { padding: '20px 15px' } : { padding: '0 15px' }}
      >
        <SpinMask spinning={disabled || loading}>
          <Row justify='end' align='middle' gutter={20}>
            <Col>
              <Button
                size='middle'
                disabled={loading || disabled}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            </Col>
            {accept === 'Not Set' ? (
              <>
                <Col>
                  <RejectButton
                    size='middle'
                    type='primary'
                    onClick={() => {
                      onClick(false);
                    }}
                  />
                </Col>
                <Col>
                  <AcceptButton
                    size='middle'
                    type='primary'
                    onClick={() => {
                      onClick(true);
                    }}
                  />
                </Col>
              </>
            ) : (
              <Col>
                {accept === 'true' ? (
                  <Text strong type='success' className='text-lg'>
                    Accepted
                  </Text>
                ) : (
                  <Text strong type='danger' className='text-lg'>
                    Rejected
                  </Text>
                )}
              </Col>
            )}
          </Row>
        </SpinMask>
      </Card>
    </Affix>
  );
};

export default AffixCustReg;
