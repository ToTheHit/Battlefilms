import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  Button, classNames, Panel, ScreenSpinner, Text, Title,
} from '@vkontakte/vkui';
import axios from 'axios';
import PropTypes from 'prop-types';
import globalVariables from '../../../GlobalVariables';

const StartPanel2 = (props) => {
  const { id, nextView } = props;
  const [time, setTime] = useState('20:00');
  const [showScreen, setShowScreen] = useState(true);

  function Registration() {
    // nextView(globalVariables.view.main);

    setShowScreen(false);
    axios.get(`${globalVariables.serverURL}/api/registerUser${window.location.search}`)
      .then((data) => {
        bridge.send('VKWebAppStorageSet', {
          key: globalVariables.authToken,
          value: data.data.attachment.token,
        })
          .then(() => {
            nextView(globalVariables.view.main);
          });
      })
      .catch((err) => {
        if (!err.status) {
          // Сервер не отвечает
          setShowScreen(true);
          // nextView(globalVariables.view.page404);
        }
      });
  }

  return (
    <Panel
      id={id}
      className={classNames('StartPanel', { StartPanel_dark: document.body.getAttribute('scheme') !== 'bright_light' })}
      centered={!showScreen}
    >
      {!showScreen && <ScreenSpinner />}
      {showScreen && (
        <div className="StartPanel--content">
          <Title level="1" weight="bold" className="StartPanel--title">Уведомления</Title>
          <Text className="StartPanel--text">
            Приложение может напоминать Вам о ежедневных тестах.
            Уведомления отправлятся в 10:00 по МСК.
          </Text>
          {/*          <div className="StartPanel--time">
            <Text weight="regular" className="StartPanel--time_counter">
              {time.split(':')[0]}
            </Text>
            <Text weight="regular" className="StartPanel--time_colon">:</Text>
            <Text weight="regular" className="StartPanel--time_counter">
              {time.split(':')[1]}
            </Text>
            <input
              type="time"
              min="00:00"
              max="24:00"
              step="5"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div> */}

          <Button
            size="l"
            mode="primary"
            onClick={() => {
              bridge.send('VKWebAppAllowNotifications', {})
                .then(() => {
                  Registration();
                })
                .catch(() => {
                });
            }}
            className="StartPanel--time__buttonAllow"
          >
            Включить уведомления
          </Button>

          <Button
            mode="tertiary"
            className="StartPanel--time__buttonReject"
            onClick={() => {
              Registration();
            }}
          >
            Пропустить
          </Button>
        </div>
      )}


    </Panel>
  );
};

StartPanel2.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};

export default StartPanel2;
