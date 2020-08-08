import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  classNames, Panel, Text, Title,
} from '@vkontakte/vkui';

import { useSelector } from 'react-redux';
// import image from '../../../assets/StartPanel/images/opt_cherry-searching-1.png';
import logoLight from '../../../assets/StartPanel/images/Optimized/intro-logo-light.png';
import logoDark from '../../../assets/StartPanel/images/Optimized/intro-logo-dark.png';

const StartPanelPage1 = (props) => {
  const { id, readyToShow, setReadyToShow, popoutIsActive } = props;
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  return (
    <Panel id={id} className="StartPanel">
      <div className={classNames('StartPanel--content', { 'StartPanel--content-hidden': !readyToShow || popoutIsActive })}>
        <img
          src={(scheme === 'space_gray' ? logoDark : logoLight)}
          alt="Логотип Мозгополии"
          className="StartPanel--image_logo"
          onLoad={() => setReadyToShow(true)}
        />
        <Title level="1" weight="heavy" className="StartPanel--title">
          Мозгополия
        </Title>
        <Text weight="regular" className="StartPanel--text">
          Добро пожаловать в Мозгополию, образовательную мини-игру.
        </Text>

      </div>
    </Panel>
  );
};

StartPanelPage1.propTypes = {
  id: PropTypes.string.isRequired,
  readyToShow: PropTypes.bool.isRequired,
  setReadyToShow: PropTypes.func.isRequired,
  popoutIsActive: PropTypes.bool.isRequired,
};
StartPanelPage1.defaultProps = {};
export default StartPanelPage1;
