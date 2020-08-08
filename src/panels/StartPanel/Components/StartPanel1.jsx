import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Panel, Text, Title,
} from '@vkontakte/vkui';

import icon11 from '../../../assets/StartPanel/blueIcons/icn32_sigma.png';
import icon21 from '../../../assets/StartPanel/blueIcons/icn32_russian.png';
import icon31 from '../../../assets/StartPanel/blueIcons/icn32_litra.png';
import icon41 from '../../../assets/StartPanel/blueIcons/icn32_genius.png';
import icon51 from '../../../assets/StartPanel/blueIcons/icn32_chemistry.png';
import icon61 from '../../../assets/StartPanel/blueIcons/icn32_moon.png';
import icon71 from '../../../assets/StartPanel/blueIcons/icn32_history.png';
import icon81 from '../../../assets/StartPanel/blueIcons/icn32_art.png';
import icon91 from '../../../assets/StartPanel/blueIcons/icn32_other.png';
import icon101 from '../../../assets/StartPanel/blueIcons/icn32_sport.png';

const StartPanel1 = (props) => {
  const { goToNextSlide, id } = props;

  return (
    <Panel id={id} className="StartPanel">
      <div className="StartPanel--content">

        <Title level="1" weight="heavy" className="StartPanel--title">
          Мозгополия
          <div className="StartPanel--iconGroup">
            <div className="StartPanel--iconGroup__line">
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon11})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon21})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon31})` }} />
            </div>
            <div className="StartPanel--iconGroup__line">
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon41})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon51})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon61})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon71})` }} />
            </div>
            <div className="StartPanel--iconGroup__line">
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon81})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon91})` }} />
              <div className="StartPanel--iconGroup__icon" style={{ backgroundImage: `url(${icon101})` }} />
            </div>
          </div>

        </Title>
        <Text weight="regular" className="StartPanel--text">
          {`Добро пожаловать в Мозгополию.\nПишите ежедневные мозговые отчёты, зарабатывайте очки гения
          и станьте настоящим мозгополистом!`}
        </Text>
      </div>
      <Button
        size="xl"
        stretched
        onClick={() => {
          goToNextSlide(1);
        }}
      >
        Продолжить
      </Button>
    </Panel>
  );
};

StartPanel1.propTypes = {
  goToNextSlide: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default StartPanel1;
