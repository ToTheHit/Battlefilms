import React from 'react';
import PropTypes from 'prop-types';
import './history.css';
import { Button, Panel, PanelHeader } from '@vkontakte/vkui';
import globalVariables from "../../../GlobalVariables";

const History = (props) => {
  const { id, setActivePanel, popoutHistoryView, setPopoutHistoryView } = props;
  return (
    <Panel id={id} className="History">
      <PanelHeader>
        История
      </PanelHeader>
      <Button
        onClick={() => setActivePanel(globalVariables.commonView.panels.battleParticipant)}
      >
        To battle
      </Button>
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
