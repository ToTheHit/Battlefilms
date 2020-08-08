import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './myFilms.css';
import { Footer } from '@vkontakte/vkui';
import Film from '../../../Main/Components/Films/Components/Film';

const MyFilms = (props) => {
  const [myFilms, setMyFilms] = useState([{
    mid: 0,
    name: 'Назад в будущее',
    year: '1995',
    score: '8.9',
    imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
    authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
  },
  {
    mid: 0,
    name: '1+1',
    year: '2011',
    score: '8.8',
    imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/4c78b2e3-ffed-4985-bbc2-642952c92f5e/52',
    authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
  },
  ]);

  function getCorrectWordFilms(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['фильм', 'фильма', 'фильмов'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  const myFilmsMemo = useMemo(() => {
    const temp = [];
    temp.push(myFilms.map((item) => (
      <Film
        key={`MyFilms__${item.name}-${item.year}`}
        mid={item.mid}
        disabled
        name={item.name}
        year={item.year}
        score={item.score}
        imageURL={item.imageURL}
      />
    )));
    temp.push(
      <Footer
        key="MyFilms__footer"
      >
        {`${myFilms.length} ${getCorrectWordFilms(myFilms.length)}`}
      </Footer>,
    );
    return temp;
  }, [myFilms]);
  return (
    <div className="MyFilms">
      {myFilmsMemo}
    </div>
  );
};

MyFilms.propTypes = {};
MyFilms.defaultProps = {};
export default MyFilms;
