import Slider from 'react-slick';
import {Hero} from './Hero';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {FC} from 'react';
import {Welcome} from './Welcome';

type HeroSliderProps = {
  artworks: any[];
};

export const HeroSlider: FC<HeroSliderProps> = ({artworks}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 50,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {artworks.length > 0 ? (
        artworks.map((_artwork, index) => <Hero key={index} />)
      ) : (
        <Welcome />
      )}
    </Slider>
  );
};
