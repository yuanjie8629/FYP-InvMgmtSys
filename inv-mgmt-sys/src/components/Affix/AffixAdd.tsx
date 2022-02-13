import React, { useState } from 'react';
import { Affix, AffixProps, Card, Col, Row } from 'antd';
import Button from '@components/Button';

export interface AffixAddProps extends AffixProps {
  label?: string;
}

const AffixAdd = ({ label, ...props }: Omit<AffixAddProps, 'children'>) => {
  const [showCard, setShowCard] = useState(false);
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
            <Button size='middle'>Cancel</Button>
          </Col>
          <Col>
            <Button size='middle' type='primary' htmlType='submit'>
              Add {label}
            </Button>
          </Col>
        </Row>
      </Card>
    </Affix>
  );
};

export default AffixAdd;
