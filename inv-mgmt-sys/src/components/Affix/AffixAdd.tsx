import React, { useState } from 'react';
import { Affix, AffixProps, Card, Col, Row } from 'antd';
import Button from '@components/Button/Button';

interface AffixAddProps extends AffixProps {
  label?: string;
}

const AffixAdd = (props: Omit<AffixAddProps, 'children'>) => {
  const [hideCard, setHideCard] = useState(false);
  return (
    <Affix
      {...props}
      onChange={(affixed) =>
        hideCard ? setHideCard(false) : setHideCard(true)
      }
    >
      <Row justify='center'>
        <Card
          bordered={false}
          style={
            hideCard
              ? {
                  width: '95%',
                  boxShadow: '0 -1px 8px 0 rgb(39 52 120 / 12%)',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }
              : { width: '95%', background: 'none' }
          }
        >
          <Row justify='end' gutter={20}>
            <Col>
              <Button size='middle'>Cancel</Button>
            </Col>
            <Col>
              <Button size='middle' type='primary'>
                Add {props.label}
              </Button>
            </Col>
          </Row>
        </Card>
      </Row>
    </Affix>
  );
};

export default AffixAdd;
