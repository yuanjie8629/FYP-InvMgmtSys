import React, { useState } from 'react';
import { Affix, AffixProps, Card, Col, Row } from 'antd';
import Button from '@components/Button';
import { useNavigate } from 'react-router-dom';

export interface AffixAddProps extends AffixProps {
  type?: 'add' | 'edit';
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const AffixAction = ({
  type = 'add',
  label,
  loading = false,
  disabled = false,
  onClick,
  ...props
}: Omit<AffixAddProps, 'children'>) => {
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
        <Row justify='end' gutter={20}>
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
          <Col>
            <Button
              size='middle'
              type='primary'
              htmlType={onClick ? 'button' : 'submit'}
              loading={loading}
              disabled={disabled && !loading}
              onClick={onClick}
            >
              {type === 'add' ? 'Add' : 'Edit'} {label}
            </Button>
          </Col>
        </Row>
      </Card>
    </Affix>
  );
};

export default AffixAction;
