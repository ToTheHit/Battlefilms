import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './battleParticipant.css';
import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PullToRefresh, Separator,
  SimpleCell,
} from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux';
import globalVariables from '../../../GlobalVariables';
import Actions from '../Main/Components/Actions/Actions';
import Films from '../Main/Components/Films/Films';

const BattleParticipant = (props) => {
  const dispatch = useDispatch();
  const {
    id, setActivePanel, setActiveStory, popoutHistoryView, setPopoutHistoryView, nextView,
  } = props;
  const { isInvited, participantBattleID } = useSelector((state) => state.userInfo);
  const myBattle = useSelector((state) => state.myBattle);
  const scrollListener = useSelector((state) => state.scrollTo);

  const [updatingData, setUpdatingData] = useState(false);
  const [settings, setSettings] = useState({
    limit: 3,
    type: 0,
    numberOfWinners: 1,
    allowDuplicates: false,
  });

  useEffect(() => {
/*    setTimeout(() => {
      setPopoutHistoryView(false);
    }, 2000);*/

    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: {
        participantBattleID: 'testInside',
      },
    });
  }, []);

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.history) {
      // scroll.top(document.body, 0);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollListener]);



  function updateData() {
    setTimeout(() => {
      setUpdatingData(false);
    }, 1000);
  }
  useEffect(() => {
    if (updatingData) {
      updateData();
    }
  }, [updatingData]);

  function onBack() {
    if (isInvited) {
      setActiveStory(globalVariables.commonView.roots.main);
      dispatch({
        type: 'UPDATE_USER_INFO',
        payload: {
          isInvited: false,
          participantBattleID: '',
        },
      });
    } else {
      setActivePanel(globalVariables.commonView.panels.history);
    }
  }

  return (
    <Panel
      id={id}
      className="BattleParticipant"
      style={{ opacity: (popoutHistoryView ? '0' : '1') }}
    >
      <PanelHeader
        left={(
          <PanelHeaderBack
            label="Назад"
            onClick={onBack}
          />
        )}
      >
        Битва фильмов
      </PanelHeader>
      <PullToRefresh
        onRefresh={() => setUpdatingData(true)}
        isFetching={updatingData}
      >
        <SimpleCell
          style={{ paddingTop: '6px', paddingBottom: '6px' }}
          disabled
          before={<Avatar size={48} src="" />}
          description="Имя Фамилия"
        >
          {`${myBattle.settings.name}`}
        </SimpleCell>
        <Separator />
        <Actions
          setActivePanel={setActivePanel}
          isOwner={false}
        />
        <div className="divider" />

        <Films
          nextView={nextView}
          allFilms={[]}
          myFilms={[]}
          isOwner={false}
          settings={myBattle.settings}
        />

      </PullToRefresh>
    </Panel>
  );
};

BattleParticipant.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setActiveStory: PropTypes.func.isRequired,
  setPopoutHistoryView: PropTypes.func.isRequired,
  popoutHistoryView: PropTypes.bool.isRequired,
  nextView: PropTypes.func.isRequired,
};
BattleParticipant.defaultProps = {};
export default BattleParticipant;
