import React, { useState } from 'react';
import { Affix, AffixProps, Card, Col, Row } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';
import {
  CancelButton,
  PickupButton,
  PrintButton,
  UpdButton,
} from '@components/Button/ActionButton';
import SpinMask from '@components/Spin/SpinMask';

export interface AffixOrderProps extends AffixProps {
  loading?: boolean;
  disabled?: boolean;
  trackNum?: boolean;
  pickup?: boolean;
  status?: string;
  onClick?: (type?: 'trackNum' | 'pickup' | 'cancel' | 'invoice') => void;
}

const AffixOrder = ({
  loading = false,
  disabled = false,
  trackNum,
  pickup,
  status,
  onClick = () => null,
  ...props
}: Omit<AffixOrderProps, 'children'>) => {
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
            {['toPick', 'toShip', 'unpaid'].includes(status) && (
              <Col>
                <CancelButton
                  size='middle'
                  type='primary'
                  onClick={() => {
                    onClick('cancel');
                  }}
                >
                  Cancel Order
                </CancelButton>
              </Col>
            )}
            {trackNum && !['cancel', 'unpaid', 'complete'].includes(status) && (
              <Col>
                <UpdButton
                  size='middle'
                  type='primary'
                  onClick={() => {
                    onClick('trackNum');
                  }}
                >
                  Update Tracking Number
                </UpdButton>
              </Col>
            )}
            {pickup && !['cancel', 'unpaid', 'completed'].includes(status) && (
              <Col>
                <PickupButton
                  size='middle'
                  type='primary'
                  onClick={() => {
                    onClick('pickup');
                  }}
                />
              </Col>
            )}
            {!['cancel', 'unpaid'].includes(status) && (
              <Col>
                <PrintButton
                  size='middle'
                  onClick={() => {
                    onClick('invoice');
                  }}
                />
              </Col>
            )}
          </Row>
        </SpinMask>
      </Card>
    </Affix>
  );
};

export default AffixOrder;
