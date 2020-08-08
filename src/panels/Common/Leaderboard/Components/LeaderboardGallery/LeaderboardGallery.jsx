import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card, classNames,
  Gallery,
  PanelSpinner,
  Placeholder,
  Separator,
  SimpleCell,
} from '@vkontakte/vkui';
import Icon24UserAddOutline from '@vkontakte/icons/dist/24/user_add_outline';
import Icon56Users3Outline from '@vkontakte/icons/dist/56/users_3_outline';

import './leaderboardGallery.css';
import bridge from '@vkontakte/vk-bridge';
import { useSelector } from 'react-redux';
import globalVariables from '../../../../../GlobalVariables';
import LeaderboardBadge from '../LeaderboardBadge/LeaderboardBadge';


const LeaderboardGallery = (props) => {
  const {
    friendsLeaderboard, worldLeaderboard, activeTab,
    setActiveTab, spinnerIsActive, getFriendsAccess,
  } = props;
  const scrollListener = useSelector((state) => state.scrollTo);
  const scheme = useSelector((state) => state.schemeChanger.scheme);
  const contentsRef = useRef([React.createRef(), React.createRef()]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [renderedFriendsLeaderboard, setRenderedFriendsLeaderBoard] = useState([]);
  const [renderedWorldLeaderboard, setRenderedWorldLeaderboard] = useState([]);

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.leaderboard) {
      if (slideIndex === 0) {
        contentsRef.current[0].current.scroll({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        contentsRef.current[1].current.scroll({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }, [scrollListener]);

  useEffect(() => {
    if (activeTab === 'WorldLeaderboardTab') setSlideIndex(0);
    else if (activeTab === 'FriendsLeaderboardTab') setSlideIndex(1);
  }, [activeTab]);

  useEffect(() => {
    const rendered = friendsLeaderboard.map((item) => {
      return (
        <div
          key={`worldLeaderboard_id${item.id}`}
        >
          <a target="_blank" rel="noopener noreferrer" href={`https://vk.com/id${item.id}`}>
            <SimpleCell
              before={(
                <Avatar size={48} src={item.photo}>
                  {(item.isMaster) && <LeaderboardBadge type={globalVariables.leaderboardBadgeType.master} />}
                </Avatar>
              )}
              indicator={`${item.bp} GP`}
            >
              {`${item.first_name} `}
              <b>{item.last_name}</b>
            </SimpleCell>
          </a>
        </div>
      );
    });
    setRenderedFriendsLeaderBoard(rendered);
  }, [friendsLeaderboard]);

  useEffect(() => {
    const rendered = worldLeaderboard.map((item) => (
      <div
        key={`worldLeaderboard_id${item.id}`}
      >
        <a target="_blank" rel="noopener noreferrer" href={`https://vk.com/id${item.id}`}>
          <SimpleCell
            before={(
              <Avatar size={48} src={item.photo}>
                {(item.isMaster) && <LeaderboardBadge type={globalVariables.leaderboardBadgeType.master} />}
              </Avatar>
            )}
            indicator={`${item.bp} GP`}
          >
            {`${item.first_name} `}
            <b>{item.last_name}</b>
          </SimpleCell>
        </a>
      </div>
    ));
    setRenderedWorldLeaderboard(rendered);
  }, [worldLeaderboard]);

  const memoRenderedWorldLeaderboard = useMemo(() => (
    <Card
      mode="shadow"
      className="LeaderboardGallery--card"
      style={{ height: 'auto' }}
    >
      {renderedWorldLeaderboard}
    </Card>
  ), [renderedWorldLeaderboard.length]);

  const memoRenderedFriendsLeaderboard = useMemo(() => (
    <Card
      mode="shadow"
      style={{ height: 'auto' }}
      className="LeaderboardGallery--card"
    >
      {(localStorage.getItem(globalVariables.friendsAccessToken) && renderedFriendsLeaderboard)}
      {spinnerIsActive && <PanelSpinner size="small" />}
      {(!localStorage.getItem(globalVariables.friendsAccessToken) && (
      <Placeholder
        className={classNames('LeaderboardGenius__placeholder', { 'LeaderboardGenius__placeholder-dark': scheme === 'space_gray' })}
        icon={(
          <Icon56Users3Outline
            width={56}
            height={56}
            style={{ color: 'var(--button_primary_background)' }}
          />
          )}
        header="Доступ к друзьям"
        action={(
          <Button
            size="l"
            onClick={getFriendsAccess}
          >
            Разрешить
          </Button>
          )}
      >
        Мозгополии необходим список Ваших друзей, чтобы составить таблицу лидеров.
      </Placeholder>
      ))}

      {(localStorage.getItem(globalVariables.friendsAccessToken) && (
      <Placeholder
        className={classNames('LeaderboardGenius__placeholder', { 'LeaderboardGenius__placeholder-dark': scheme === 'space_gray' })}
        icon={(
          <Icon24UserAddOutline
            width={56}
            height={36}
            style={{ color: 'var(--button_primary_background)' }}
          />
          )}
        header="Пригласить друзей"
        action={(
          <Button
            size="l"
            onClick={() => bridge.send('VKWebAppShare', { link: 'https://vk.com/app7441788' })}
          >
            Пригласить
          </Button>
          )}
      >
        Проверьте, смогут ли Ваши друзья ответить на придуманные Вами вопросы.
      </Placeholder>
      ))}

    </Card>
  ), [renderedFriendsLeaderboard.length, spinnerIsActive, scheme]);

  return (
    <Gallery
      slideWidth="100%"
      slideIndex={slideIndex}
      onChange={(i) => {
        setSlideIndex(i);
        if (i === 0) {
          setActiveTab('WorldLeaderboardTab');
        }
        if (i === 1) {
          setActiveTab('FriendsLeaderboardTab');
        }
      }}
      align="center"
      className={scheme === 'space_gray' && 'GalleryDark'}
    >
      <div
        ref={contentsRef.current[0]}
        className="LeaderboardGallery--content"
      >
        {memoRenderedWorldLeaderboard}
      </div>

      <div
        ref={contentsRef.current[1]}
        className="LeaderboardGallery--content"
      >
        {memoRenderedFriendsLeaderboard}
      </div>
    </Gallery>
  );
};

LeaderboardGallery.propTypes = {
  friendsLeaderboard: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo: PropTypes.string,
    bp: PropTypes.number,
  })).isRequired,
  worldLeaderboard: PropTypes.arrayOf(PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    photo: PropTypes.string,
    bp: PropTypes.number,
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  spinnerIsActive: PropTypes.bool.isRequired,
  getFriendsAccess: PropTypes.func.isRequired,
};
LeaderboardGallery.defaultProps = {};
export default LeaderboardGallery;
