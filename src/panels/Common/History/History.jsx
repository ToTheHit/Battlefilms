import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './history.css';
import { Button, Panel, PanelHeader, Separator, Tabs, TabsItem } from '@vkontakte/vkui';
import globalVariables from "../../../GlobalVariables";
import MyBattles from "./Components/MyBattles/MyBattles";
import MyFilms from "./Components/MyFilms/MyFilms";

const History = (props) => {
  const { id, setActivePanel, popoutHistoryView, setPopoutHistoryView } = props;
  const [selectedTab, setSelectedTab] = useState('Battles');
  return (
    <Panel id={id} className="History">
      <PanelHeader
        separator={false}
      >
        История
      </PanelHeader>
      <Tabs>
        <TabsItem
          onClick={() => setSelectedTab('Battles')}
          selected={selectedTab === 'Battles'}
        >
          Битвы
        </TabsItem>
        <TabsItem
          onClick={() => setSelectedTab('Films')}
          selected={selectedTab === 'Films'}
        >
          Фильмы
        </TabsItem>
      </Tabs>
      <Separator />
      {(selectedTab === 'Battles' && <MyBattles setActivePanel={setActivePanel}/>)}
      {(selectedTab === 'Films' && <MyFilms />)}

    </Panel>
  );
};

History.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setPopoutHistoryView: PropTypes.func.isRequired,
  popoutHistoryView: PropTypes.bool.isRequired,
};
History.defaultProps = {};
export default History;
