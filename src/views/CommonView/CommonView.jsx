import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Epic, Root, ScreenSpinner, Tabbar, TabbarItem, View,
} from '@vkontakte/vkui';
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon24Flash from '@vkontakte/icons/dist/24/flash';
import Icon28KeyboardBotsOutline from '@vkontakte/icons/dist/28/keyboard_bots_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon20EducationOutline from '@vkontakte/icons/dist/20/education_outline';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch, useSelector } from 'react-redux';
import BrainLeaderboard from '../../panels/Common/Leaderboard/BrainLeaderboard';

import './commonView.css';
import Shop from '../../panels/Common/Shop/Shop';
import EffectDetailsSelector from '../../panels/Common/EffectDetails/EffectDetailsSelector';
import Main from '../../panels/Common/Main/Main';
import QuestionDetails from '../../panels/Common/QuestionDetails/QuestionDetails';
import globalVariables from '../../GlobalVariables';
import QuestionsList from '../../panels/Common/QuestionsList/QuestionsList';
import RejectedQuestion from '../../panels/Common/RejectedQuestion/RejectedQuestion';
import AddFilm from '../../panels/AddFilm/AddFilm';
import Settings from '../../panels/Common/Settings/Settings';
import BattleParticipant from '../../panels/Common/BattleParticipant/BattleParticipant';
import History from '../../panels/Common/History/History';

const CommonView = (props) => {
  const { id, nextView } = props;
  const dispatch = useDispatch();
  const scheme = useSelector((state) => state.schemeChanger.scheme);
  const { isInvited, participantBattleID } = useSelector((state) => state.userInfo);
  const [activeStory, setActiveStory] = useState(participantBattleID ? globalVariables.commonView.roots.history : globalVariables.commonView.roots.main);



  // Main activity
  const [mainActivePanel, setMainActivePanel] = useState('Main');
  const [mainPopoutView, setMainPopoutView] = useState(true);
  const [mainHistory, setMainHistory] = useState(['Main']);

  useEffect(() => {
    if (mainActivePanel === 'Main') {
      setMainHistory(['Main']);
      bridge.send('VKWebAppDisableSwipeBack');
    } else if (mainActivePanel !== mainHistory[mainHistory.length - 1]) {
      if (mainActivePanel === mainHistory[mainHistory.length - 2]) {
        setMainHistory(((prevState) => prevState.splice(0, prevState.length - 1)));
      } else setMainHistory(((prevState) => [...prevState, mainActivePanel]));
      bridge.send('VKWebAppEnableSwipeBack');
    }
  }, [mainActivePanel]);

  // History activity
  const [historyActivePanel, setHistoryActivePanel] = useState(participantBattleID ? globalVariables.commonView.panels.battleParticipant : globalVariables.commonView.panels.history);
  const [historyPopoutView, setHistoryPopoutView] = useState(false);
  const [historyStoryHistory, setHistoryStoryHistory] = useState([globalVariables.commonView.panels.history]);


  function changeStory(e) {
    dispatch({
      type: 'SCROLL_TO',
      payload: {
        scrollableElement: activeStory,
      },
    });
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: {
        // participantBattleID: '',
        isInvited: false,
      },
    });
    if (e.currentTarget.dataset.story !== activeStory) {
      window.scroll({ top: 0, left: 0 });
    }
    setActiveStory(e.currentTarget.dataset.story);
  }


  const SwipeBack = (view) => {
    switch (view) {
      case 'MainView': {
        const historyTemp = mainHistory;
        historyTemp.pop();
        setMainActivePanel(historyTemp[historyTemp.length - 1]);
        break;
      }
      default: break;
    }
  };

  useEffect(() => {
    if (isInvited || participantBattleID) {
      setActiveStory(globalVariables.commonView.roots.history);
      setHistoryActivePanel(globalVariables.commonView.panels.battleParticipant);
      setMainActivePanel(globalVariables.commonView.panels.main);
    } else {
      setHistoryActivePanel(globalVariables.commonView.panels.history);
    }
  }, [isInvited, participantBattleID]);

  return (
    <Epic
      className={(scheme === 'space_gray' && 'CommonView__Epic-dark')}
      id={id}
      activeStory={activeStory}
      tabbar={(
        <Tabbar>
          <TabbarItem
            onClick={changeStory}
            selected={activeStory === globalVariables.commonView.roots.main}
            data-story={globalVariables.commonView.roots.main}
            text="Битва"
          >
            <Icon24Flash height={28} width={28} />
          </TabbarItem>
          <TabbarItem
            onClick={changeStory}
            selected={activeStory === globalVariables.commonView.roots.history}
            data-story={globalVariables.commonView.roots.history}
            text="История"
          >
            <Icon28ListOutline height={28} width={28} />
          </TabbarItem>
        </Tabbar>
      )}
    >
      <Root id={globalVariables.commonView.roots.main} activeView="MainView">
        <View
          activePanel={mainActivePanel}
          id="MainView"
          popout={(mainPopoutView && (<ScreenSpinner />))}
          onSwipeBack={() => SwipeBack('MainView')}
          history={mainHistory}
          modal={<EffectDetailsSelector />}
        >
          <Main
            id={globalVariables.commonView.panels.main}
            setActivePanel={setMainActivePanel}
            nextView={nextView}
            setActiveStory={setActiveStory}
            setPopoutMainView={setMainPopoutView}
            popoutMainView={mainPopoutView}
          />
          <Settings
            id={globalVariables.commonView.panels.settings}
            setActivePanel={setMainActivePanel}
          />
          {/*          <QuestionsList
            id={globalVariables.commonView.panels.questionsList}
            setActivePanel={setMainActivePanel}
            setSelectedQuestion={setMainSelectedQuestion}
          />
          <RejectedQuestion
            id={globalVariables.commonView.panels.rejectedQuestion}
            setActivePanel={setMainActivePanel}
            selectedQuestion={mainSelectedQuestion}
            setActiveStory={setActiveStory}
          />
          <QuestionDetails
            id={globalVariables.commonView.panels.questionDetails}
            setActivePanel={setMainActivePanel}
            selectedQuestion={mainSelectedQuestion}
          /> */}
        </View>
      </Root>
      <Root id={globalVariables.commonView.roots.history} activeView="HistoryView">
        <View
          id="HistoryView"
          activePanel={historyActivePanel}
          popout={(historyPopoutView && (<ScreenSpinner />))}
          modal={<EffectDetailsSelector />}
        >
          <History
            id={globalVariables.commonView.panels.history}
            setActivePanel={setHistoryActivePanel}
            setPopoutHistoryView={setHistoryPopoutView}
            popoutHistoryView={historyPopoutView}
          />
          <BattleParticipant
            id={globalVariables.commonView.panels.battleParticipant}
            setActivePanel={setHistoryActivePanel}
            setActiveStory={setActiveStory}
            setPopoutHistoryView={setHistoryPopoutView}
            popoutHistoryView={historyPopoutView}
            nextView={nextView}
          />
        </View>
      </Root>

    </Epic>
  );
};

CommonView.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};
CommonView.defaultProps = {};
export default CommonView;
