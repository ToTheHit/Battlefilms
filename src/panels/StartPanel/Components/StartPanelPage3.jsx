import React from 'react';
import PropTypes from 'prop-types';
import {
  classNames, Panel, Text, Title,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import image from '../../../assets/StartPanel/images/opt_cherry-fail.png';
import imageLight from '../../../assets/StartPanel/images/Optimized/intro-market-light_new.png';
import imageDark from '../../../assets/StartPanel/images/Optimized/intro-market-dark_new.png';

const StartPanelPage3 = (props) => {
  const { id } = props;
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  return (
    <Panel
      id={id}
      className={classNames('StartPanel', { StartPanel_dark: document.body.getAttribute('scheme') !== 'bright_light' })}
    >
      <div className="StartPanel--content">
        <Title level="3" weight="semibold" style={{ marginTop: '10px' }}>Магазин вопросов</Title>
        <Text weight="regular" className="StartPanel--text">
          Добавляйте свои вопросы и зарабатывайте на чужих ошибках.
        </Text>
        <img src={(scheme === 'space_gray' ? imageDark : imageLight)} alt="Пример магазина в приложении" className="StartPanel--image_market" />

      </div>

    </Panel>
  );
};

StartPanelPage3.propTypes = {
  id: PropTypes.string.isRequired,
};
StartPanelPage3.defaultProps = {};
export default StartPanelPage3;
