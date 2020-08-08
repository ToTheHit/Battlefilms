import React, { useState } from 'react';

import PropTypes from 'prop-types';
import {
  Epic, Tabbar, TabbarItem, View,
} from '@vkontakte/vkui';
import Icon28UserCircleOutline from '@vkontakte/icons/dist/28/user_circle_outline';
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';

import BrainLeaderboard from './Leaderboard/BrainLeaderboard';
import ShopView from '../../views/ShopView/ShopView';
import MainView from '../../views/MainView/MainView';

const Common = (props) => {
  const { id, setActiveCommonView } = props;
  const [activeStory, setActiveStory] = useState('Main');

  function changeStory(e) {
    setActiveStory(e.currentTarget.dataset.story);
  }

  return (
    <Epic
      activeStory={activeStory}
      tabbar={(
        <Tabbar>
          <TabbarItem
            onClick={changeStory}
            selected={activeStory === 'Main'}
            data-story="Main"
          >
            <Icon28UserCircleOutline height={28} width={28} />
          </TabbarItem>
          <TabbarItem
            onClick={changeStory}
            selected={activeStory === 'Shop'}
            data-story="Shop"
          >
            <Icon28MarketOutline height={28} width={28} />
          </TabbarItem>
          <TabbarItem
            onClick={changeStory}
            selected={activeStory === 'Leaderboard'}
            data-story="Leaderboard"
          >
            <Icon28ListOutline height={28} width={28} />
          </TabbarItem>
        </Tabbar>
      )}
    >
      <MainView id="Main" setActiveCommonView={setActiveCommonView} />

      <ShopView id="Shop" />


      <View activePanel="Leaderboard" id="Leaderboard">
        <BrainLeaderboard id="Leaderboard" />
      </View>

    </Epic>
  );
};

Common.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveCommonView: PropTypes.func.isRequired,
};
Common.defaultProps = {};
export default Common;
