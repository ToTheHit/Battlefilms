import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, SimpleCell } from '@vkontakte/vkui';
import axios from 'axios';
import SimpleCrypto from "simple-crypto-js"

const TestPanel2 = (props) => {
  const { setActivePanel, id } = props;


  return (
    <Panel id={id}>
      <PanelHeader>
        Development View #2
      </PanelHeader>
      <SimpleCell
        onClick={() => {
          setActivePanel('1');
        }}
      >
        Go to View #1
      </SimpleCell>
    </Panel>
  );
};

TestPanel2.propTypes = {
  setActivePanel: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,

};
TestPanel2.defaultProps = {};
export default TestPanel2;
