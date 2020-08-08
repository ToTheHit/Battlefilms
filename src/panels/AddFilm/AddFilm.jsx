import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './addFilm.css';
import {
  Button,
  classNames,
  FixedLayout,
  Footer,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  PanelSpinner,
  Placeholder,
  Search,
} from '@vkontakte/vkui';
import Icon56VideoOutline from '@vkontakte/icons/dist/56/video_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import globalVariables from '../../GlobalVariables';
import useDebounce from '../../useDebounce';
import Film from '../Common/Main/Components/Films/Components/Film';

const AddFilm = (props) => {
  const {
    id, nextView, setAddFilmPopoutView,
  } = props;
  // const isInvited = useSelector((state) => state.userInfo.isInvited);
  const dispatch = useDispatch();
  const AxiosCancelToken = axios.CancelToken;
  const source = AxiosCancelToken.source();
  const [searchValue, setSearchValue] = useState('');
  const searchValueForAPI = useDebounce(searchValue, 1500);
  const [renderedFilms, setRenderedFilms] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  function getCorrectWordFilms(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['фильм', 'фильма', 'фильмов'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  function onSelectFilm(name, mid) {
    setAddFilmPopoutView(true);
    const data = {
      mid,
      user_id: '12321',
      pid: '12321',
    };

    /*    axios.post(`${globalVariables.serverURL}/movie`, data)
      .then((serverResponse) => {
        console.info(serverResponse);
      })
      .catch((error) => console.info(error)); */
    dispatch({
      type: 'UPDATE_MAIN_SNACKBAR',
      payload: {
        showSnackbar: true,
        text: `Фильм ${name} был добавлен в битву`,
      },
    });
    nextView(globalVariables.view.main);
  }

  useEffect(() => {
    if (searchValueForAPI) {
      axios.get(`${globalVariables.serverURL}/search`, {
        cancelToken: source.token,
        timeout: 10000,
        timeoutErrorMessage: 'Timeout',
        params: {
          query: searchValueForAPI,
        },
      })
        .then((data) => {
          if (data.data.isOK) {
            const rendered = data.data.data.map((item) => (
              <Film
                key={`${item.mid}-${item.year}`}
                mid={item.mid}
                name={item.title}
                year={item.release}
                score={item.score}
                imageURL={item.poster_url}
                nextView={nextView}
                onSelectFilm={(name) => onSelectFilm(name)}
              />
            ));
            rendered.push(
              <Footer
                key="AddFilms__footer"
              >
                {`${data.data.data.length} ${getCorrectWordFilms(data.data.data.length)}`}
              </Footer>,
            );
            setRenderedFilms(rendered);
          } else {
            setRenderedFilms([
              <Placeholder
                key="AddFilm__ErrorPlaceholder"
                stretched
                icon={<Icon56ErrorOutline style={{ color: '#EB4250' }} />}
              >
                Не найдено фильмов с таким названием
              </Placeholder>,
            ]);
          }
        })
        .catch((err) => console.info(err))
        .finally(() => {
          setIsSearch(false);
        });
    }
  }, [searchValueForAPI]);

  useEffect(() => {
    if (!searchValue) {
      setRenderedFilms([]);
    } else {
      setIsSearch(true);
    }
  }, [searchValue]);

  useEffect(() =>
    // test();
    () => {
      source.cancel('Unmount panel');
      setAddFilmPopoutView(false);
    },
  []);

  return (
    <Panel id={id} className="AddFilm">
      <PanelHeader
        className="AddFilm__header"
        left={(
          <PanelHeaderButton
            onClick={() => nextView(globalVariables.view.main)}
          >
            Закрыть
          </PanelHeaderButton>
        )}
      >
        Новый фильм
      </PanelHeader>
      <FixedLayout
        vertical="top"
      >
        <Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </FixedLayout>

      {isSearch && <PanelSpinner />}
      {renderedFilms.length > 0 ? renderedFilms : (
        <Placeholder
          stretched
          icon={<Icon56VideoOutline style={{ color: 'var(--tabbar_active_icon)' }} />}
        >
          Воспользуйтесь поиском, чтобы найти фильм и добавьте его в битву.
        </Placeholder>
      )}

    </Panel>
  );
};

AddFilm.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
  setAddFilmPopoutView: PropTypes.func.isRequired,
};
AddFilm.defaultProps = {};
export default AddFilm;
