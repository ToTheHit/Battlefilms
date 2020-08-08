import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './films.css';
import {
  Button,
  classNames,
  Div,
  FixedLayout,
  Footer,
  Header,
  Placeholder,
} from '@vkontakte/vkui';
import Icon56VideoOutline from '@vkontakte/icons/dist/56/video_outline';
import { useSelector } from 'react-redux';
import globalVariables from '../../../../../GlobalVariables';
import Film from './Components/Film';

const Films = (props) => {
  const { nextView, myFilms, allFilms, isOwner, settings } = props;
  // const myFilms = useSelector((state) => state.userInfo.myFilms);
  // const allFilms = useSelector((state) => state.userInfo.allFilms);
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  const [myFilmsRemoval, setMyFilmsRemoval] = useState(false);
  const [allFilmsRemoval, setAllFilmsRemoval] = useState(false);

  function getCorrectWordFilms(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['фильм', 'фильма', 'фильмов'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  const allFilmsMemo = useMemo(() => {
    if (allFilms.length > 0) {
      const temp = [];
      temp.push(
        <Header
          key="AllFilmsHeader"
          aside={(
            <Button
              mode="tertiary"
              style={{ marginRight: '-16px' }}
              onClick={() => setAllFilmsRemoval((prevState) => !prevState)}
            >
              {allFilmsRemoval ? 'Готово' : 'Изменить'}
            </Button>
          )}
        >
          Все фильмы
        </Header>,
      );
      temp.push(allFilms.map((item) => (
        <Film
          key={`AllFilms__${item.name}-${item.year}`}
          mid={item.mid}
          disabled
          removable={allFilmsRemoval}
          name={item.name}
          year={item.year}
          score={item.score}
          imageURL={item.imageURL}
          authorPhoto={item.authorPhoto}
        />
      )));
      temp.push(
        <Footer
          key="Films__footer"
          className={classNames((allFilms.length >= 3 && isOwner) && 'Films__footer')}
        >
          {`${allFilms.length} ${getCorrectWordFilms(allFilms.length)}`}
        </Footer>,
      );
      return temp;
    }
    return (
      <Placeholder
        // stretched
        icon={<Icon56VideoOutline />}
        header="Список фильмов"
        action={(
          <Button
            size="m"
            onClick={() => nextView(globalVariables.view.addFilm)}
          >
            Добавить фильм
          </Button>
        )}
      >
        Добавьте 3 любимых фильма и поделитесь битвой с друзьями.
        Когда список фильмов станет больше – начните битву.
      </Placeholder>
    );
  }, [allFilms, allFilmsRemoval]);

  const myFilmsMemo = useMemo(() => {
    if (allFilms.length > 0) {
      const temp = [];
      temp.push(
        <Header
          key="MyFilmsHeader"
          aside={(
            <Button
              mode="tertiary"
              style={{ marginRight: '-16px' }}
              onClick={() => setMyFilmsRemoval((prevState) => !prevState)}
            >
              {myFilmsRemoval ? 'Готово' : 'Изменить'}
            </Button>
          )}
        >
          Мои фильмы
        </Header>,
      );
      temp.push(myFilms.map((item) => (
        <Film
          key={`MyFilms__${item.name}-${item.year}`}
          mid={item.mid}
          disabled
          removable={myFilmsRemoval}
          name={item.name}
          year={item.year}
          score={item.score}
          imageURL={item.imageURL}
        />
      )));
      if (isOwner) {
        temp.push(
          <Div
            key="Films__addFilm"
            className="Films__addFilm"
          >
            <Button
              mode="secondary"
              size="xl"
              onClick={() => nextView(globalVariables.view.addFilm)}
            >
              Добавить фильм
            </Button>
          </Div>,
        );
      } else if (myFilms.length < settings.limit) {
        temp.push(
          <Div
            key="Films__addFilm"
            className="Films__addFilm"
          >
            <Button
              mode="secondary"
              size="xl"
              onClick={() => nextView(globalVariables.view.addFilm)}
            >
              {`Добавить ещё ${settings.limit - myFilms.length} ${getCorrectWordFilms(settings.limit - myFilms.length)}`}
            </Button>
          </Div>,
        );
      }

      return temp;
    }
    return [];
  }, [myFilms, myFilmsRemoval]);

  const startBattleButton = useMemo(() => {
    if (allFilms.length >= 3 && isOwner) {
      return (
        <FixedLayout
          vertical="bottom"
        >
          <div
            className={classNames('Films__startBattle', scheme === 'space_gray' && 'Films__startBattle-dark')}
          >
            <Button
              size="xl"
            >
              Начать битву
            </Button>
          </div>
        </FixedLayout>
      );
    }
    return [];
  }, [allFilms]);

  return (
    <div className="Films">

      {myFilmsMemo}
      {allFilmsMemo}
      {startBattleButton}

    </div>
  );
};

Films.propTypes = {
  nextView: PropTypes.func.isRequired,
  myFilms: PropTypes.arrayOf(PropTypes.shape({
    mid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageURL: PropTypes.string.isRequired,
    authorPhoto: PropTypes.string,
  })),
  allFilms: PropTypes.arrayOf(PropTypes.shape({
    mid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageURL: PropTypes.string.isRequired,
    authorPhoto: PropTypes.string,
  })).isRequired,
  isOwner: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    limit: PropTypes.number,
    type: PropTypes.number,
    numberOfWinners: PropTypes.number,
    allowDuplicates: PropTypes.bool,
  }).isRequired,
};
Films.defaultProps = {
  myFilms: [],
};
export default Films;
