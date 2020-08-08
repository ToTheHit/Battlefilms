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
  const { isInvited, inviteHash } = useSelector((state) => state.userInfo);
  const myBattle = useSelector((state) => state.myBattle);

  const [updatingData, setUpdatingData] = useState(false);
  const [settings, setSettings] = useState({
    limit: 3,
    type: 0,
    numberOfWinners: 1,
    allowDuplicates: false,
  })
  useEffect(() => {
    setTimeout(() => {
      setPopoutHistoryView(false);
    }, 2000);
  }, []);

  function updateData() {

  }

  function onBack() {
    if (isInvited) {
      setActiveStory(globalVariables.commonView.roots.main);
      dispatch({
        type: 'UPDATE_USER_INFO',
        payload: {
          isInvited: false,
          inviteHash: '',
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
        isFetching={updateData}
      >
        <SimpleCell
          disabled
          before={<Avatar size={48} src="" />}
          description="Организатор"
        >
          {`${'Имя'} ${'Фамилия'}`}
        </SimpleCell>
        <Separator />
        <Actions
          setActivePanel={setActivePanel}
          isOwner={false}
        />
        <div className="divider" />

        <Films
          nextView={nextView}
          allFilms={myBattle.allFilms}
          myFilms={myBattle.myFilms}
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
