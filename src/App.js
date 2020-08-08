import React, { useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { ConfigProvider, Root } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import './app.css';

import '@vkontakte/vkui/dist/vkui.css';
import StartView from './views/StartView/StartView';
import CommonView from './views/CommonView/CommonView';
import TestView from './views/TestView/TestView';
import globalVariables from './GlobalVariables';
import ConnectionLost from './views/ConnectionLost/ConnectionLost';
import AddFilmView from './views/AddFilmView/AddFilmView';

const App = () => {
  const [activeView, setActiveView] = useState(globalVariables.view.start);
  const dispatch = useDispatch();
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      switch (type) {
        case 'VKWebAppUpdateConfig': {
          const schemeAttribute = document.createAttribute('scheme');
          schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
          document.body.attributes.setNamedItem(schemeAttribute);

          dispatch({
            type: 'UPDATE_SCHEME',
            payload: schemeAttribute.value,
          });
          break;
        }
        case 'VKWebAppAllowNotificationsResult':
          dispatch({
            type: 'UPDATE_NOTIFICATIONS_ALLOW',
            payload: { isAllow: true },
          });
          break;
        case 'VKWebAppDenyNotificationsResult':
          dispatch({
            type: 'UPDATE_NOTIFICATIONS_ALLOW',
            payload: { isAllow: false },
          });
          break;
        case 'VKWebAppAllowNotificationsFailed':
          console.info('Notificatiom rejected');
          break;
        default:
          // console.info('UknownType:', type);
          break;
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    dispatch({
      type: 'UPDATE_NOTIFICATIONS_ALLOW',
      payload: { isAllow: (urlParams.get('vk_are_notifications_enabled') === '1') },
    });
  }, []);

  function changeStatusBarColor(schemeLocal) {
    return new Promise((resolve) => {
      if (schemeLocal === 'bright_light' || schemeLocal === 'client_light') {
        bridge.send('VKWebAppSetViewSettings', { status_bar_style: 'dark', action_bar_color: '#fff' })
          .then((res) => resolve(res))
          .catch((err) => {
            if (err.error_data.error_code === 9) {
              setTimeout(() => {
                changeStatusBarColor(schemeLocal);
              }, 500);
            }
          });
      } else if (schemeLocal === 'space_gray' || schemeLocal === 'client_dark') {
        bridge.send('VKWebAppSetViewSettings', { status_bar_style: 'light', action_bar_color: '#19191a' })
          .then((res) => resolve(res))
          .catch((err) => {
            if (err.error_data.error_code === 9) {
              setTimeout(() => {
                changeStatusBarColor(schemeLocal);
              }, 500);
            }
          });
      }
    });
  }
  useEffect(() => {
    changeStatusBarColor(scheme);
  }, [scheme]);

  return (
    <ConfigProvider
      webviewType="vkapps"
      isWebView
      scheme={(((scheme === 'light' || scheme === 'bright_light') || scheme === 'client_light') ? 'bright_light' : 'space_gray')}
      appearance={(((scheme === 'light' || scheme === 'bright_light') || scheme === 'client_light') ? 'light' : 'dark')}
    >
      <Root activeView={activeView}>
        <StartView id={globalVariables.view.start} nextView={setActiveView} />
        <CommonView id={globalVariables.view.main} nextView={setActiveView} />
        <AddFilmView id={globalVariables.view.addFilm} nextView={setActiveView} />
        <ConnectionLost id={globalVariables.view.connectionLost} nextView={setActiveView} />

        <TestView id={globalVariables.view.test} />
      </Root>
    </ConfigProvider>

  );
};

export default App;
