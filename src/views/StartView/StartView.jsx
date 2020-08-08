import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, ScreenSpinner, PopoutWrapper } from '@vkontakte/vkui';
import StartPanel from '../../panels/StartPanel/StartPanel';

const StartView = (props) => {
  const { id, nextView } = props;
  const popout = (
    <PopoutWrapper alignY="center" alignX="center">
      <ScreenSpinner />
    </PopoutWrapper>
  );
  const [popoutIsActive, setPopoutIsActive] = useState(true);

  return (
    <View
      id={id}
      activePanel="StartPanel"
      popout={(popoutIsActive && popout)}
      header={false}
      style={{ position: 'fixed', top: '-2px' }}
    >
      <StartPanel id="StartPanel" nextView={nextView} popoutState={{ popoutIsActive, setPopoutIsActive }} />
    </View>
  );
};

StartView.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};
StartView.defaultProps = {};
export default StartView;
