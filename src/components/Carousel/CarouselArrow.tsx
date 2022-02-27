import { Carousel, CarouselProps } from 'antd';
import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './CarouselArrow.less';

export interface CarouselArrowProps extends CarouselProps {}

const CarouselArrow = (props: CarouselArrowProps) => {
  const [carouselPrev, setCarouselPrev] = useState(false);
  const [carouselNext, setCarouselNext] = useState(true);
  return (
    <span className='carousel-arrow'>
      <Carousel
        dots={false}
        arrows
        prevArrow={carouselPrev ? <MdChevronLeft /> : <></>}
        nextArrow={carouselNext ? <MdChevronRight /> : <></>}
        afterChange={(current) => {
          if (current > 0) setCarouselPrev(true);
          else setCarouselPrev(false);

          if (
            current !== React.Children.count(props.children) - 1 ||
            current === 0
          )
            setCarouselNext(true);
          else setCarouselNext(false);
        }}
        {...props}
      >
        {props.children}
      </Carousel>
    </span>
  );
};

export default CarouselArrow;
