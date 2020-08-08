import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Text, Title } from '@vkontakte/vkui';

import { useSelector } from 'react-redux';
// import image from '../../../assets/StartPanel/images/opt_cherry-check.png';
import imageLight from '../../../assets/StartPanel/images/Optimized/intro-poll-light.png';
import imageDark from '../../../assets/StartPanel/images/Optimized/intro-poll-dark.png';

const StartPanelPage2 = (props) => {
  const { id } = props;
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  return (
    <Panel id={id} className="StartPanel">
      <div className="StartPanel--content">
        <Title level="3" weight="semibold">Ежедневные тесты</Title>
        <Text weight="regular" className="StartPanel--text">
          Зарабатывайте очки и монеты, отвечая на вопросы других игроков.
        </Text>
        <img src={(scheme === 'space_gray' ? imageDark : imageLight)} alt="Пример квиза в приложении" className="StartPanel--image_poll" />

      </div>
    </Panel>
  );
};

StartPanelPage2.propTypes = {
  id: PropTypes.string.isRequired,
};
StartPanelPage2.defaultProps = {};
export default StartPanelPage2;
