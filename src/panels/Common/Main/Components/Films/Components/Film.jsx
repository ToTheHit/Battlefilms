import React from 'react';
import PropTypes from 'prop-types';
import './film.css';
import { Avatar, Cell } from '@vkontakte/vkui';

const Film = (props) => {
  const {
    name, score, year, imageURL, authorPhoto, disabled, removable, onSelectFilm, mid,
  } = props;

  function onRemoveFilm() {
    console.info(`Remove film ${name}`);
  }

  return (
    <Cell
      disabled={disabled}
      className="Film"
      removable={removable}
      before={(
        <img
          className="Film__preview"
          alt="Film poster"
          // src="https://avatars.mds.yandex.net/get-kinopoisk-image/1600647/afab999b-c6bb-4fac-a951-03f72fd2b8cf/52"
          src={imageURL}
        />
      )}
      indicator={(authorPhoto && <Avatar className="Film__authorPhoto" size={32} src={authorPhoto} />)}
      description={`${year} г, оценка ${score}`}
      onClick={() => onSelectFilm(name, mid)}
      onRemove={() => onRemoveFilm()}
    >
      {name}
    </Cell>
  );
};

Film.propTypes = {
  mid: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageURL: PropTypes.string.isRequired,
  authorPhoto: PropTypes.string,
  disabled: PropTypes.bool,
  removable: PropTypes.bool,
  onSelectFilm: PropTypes.func,
};
Film.defaultProps = {
  authorPhoto: '',
  disabled: false,
  removable: false,
  onSelectFilm: () => {
  },
};
export default Film;
