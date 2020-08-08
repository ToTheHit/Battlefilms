import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './testView.css';
import { View } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';
import TestPanel from './TestPanel';
import TestPanel2 from './TestPanel2';
import globalVariables from '../../GlobalVariables';
import WorkViewModal from '../WorkView/WorkViewModal';
// import { StatusBar } from 'react-native';

const TestView = (props) => {
  const { id } = props;
  const [result, setResult] = useState({});
  const [error, setError] = useState({});
  const { VK } = window;
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    /*    bridge.send('VKWebAppAllowNotifications', {})
      .then(data => setResult(data))
      .catch(err => setError(err)); */

    /*    axios.post('https://81542c99.ngrok.io/api/registerUser', {}, {
      params: {
        vk_access_token_settings: urlParams.get('vk_access_token_settings'),
        vk_app_id: urlParams.get('vk_app_id'),
        vk_are_notifications_enabled: urlParams.get('vk_are_notifications_enabled'),
        vk_is_app_user: urlParams.get('vk_is_app_user'),
        vk_is_favorite: urlParams.get('vk_is_favorite'),
        vk_language: urlParams.get('vk_language'),
        vk_platform: urlParams.get('vk_platform'),
        vk_ref: urlParams.get('vk_ref'),
        vk_user_id: urlParams.get('vk_user_id'),
        sign: urlParams.get('sign'),
      },
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []); */

    /*    axios.get(`https://81542c99.ngrok.io/api/registerUser${window.location.search}`)
      .then((data) => {
        console.info(data);
        bridge.send('VKWebAppStorageSet', { key: 'authToken', value: data.data.attachment.token });
      })
      .catch((err) => console.info(err)); */

    /*    bridge.send('VKWebAppStorageGet', { keys: ['authToken'] })
      .then(((data) => {
        const urlParams = new URLSearchParams(window.location.search);
        setTimeout(() => {
          console.info({
            token: data.keys[0].value,
            id: urlParams.get('vk_user_id'),
          });
        }, 1000);

        axios.get('https://81542c99.ngrok.io/api/getTest', {
          params: {
            token: data.keys[0].value,
            id: urlParams.get('vk_user_id'),
          }
        })
          .then((data1) => console.info(data1))
          .catch((err) => console.info(err));

      })); */

    // bridge.send("VKWebAppStorageSet", {"key": globalVariables.authToken, "value": '12321321'});
    /*
    bridge.send('VKWebAppStorageGet', { keys: [globalVariables.authToken] })
      .then(((data) => {
        setTimeout(() => {
          console.info(data);

        }, 1000)

      })); */

    // bridge.send('VKWebAppShare', { link: 'https://vk.com/app7441788' });

    /*    bridge.send('VKWebAppGetAuthToken', { app_id: 7441788, scope: 'friends' })
      .then((data) => {
        console.info(data.access_token);
        const urlParams = new URLSearchParams(window.location.search);

        axios.get(`${globalVariables.serverURL}/api/leaderBoard?id=${urlParams.get('vk_user_id')}&userToken=${data.access_token}`)
          .then((srvData) => {
            console.info(srvData);
          })
          .catch((err) => console.info(err));
      }); */
    // bridge.send('VKWebAppStorageSet', { key: globalVariables.friendsAccessToken, value: null });

    /*    bridge.send("VKWebAppShowStoryBox", { "background_type" : "image", "url" : "https://sun9-65.userapi.com/c850136/v850136098/1b77eb/0YK6suXkY24.jpg" })
      .then((data) => {
        setTimeout(() => {
          console.info('Вай красавец какой', data);
        }, 1000)
      })
      .catch((err) => {
        setTimeout(() => {
          console.info('Ээээ... Так нельзя', err);
        }, 1000)
      }) */
    /*    bridge.send('VKWebAppStorageGet', { keys: [globalVariables.friendsAccessToken] })
      .then(((data) => {
        setTimeout(() => {
            console.info('token', data.keys[0].value)
        }, 5000);
      })); */

/*    bridge.send('VKWebAppStorageSet', {
      key: globalVariables.quizResult,
      value: '',
    });
    bridge.send('VKWebAppStorageSet', {
      key: globalVariables.quizQuestions,
      value: '',
    });
    dispatch({
      type: 'CLEAR_QUIZ_RESULT',
    });*/

/*    bridge.send('VKWebAppStorageSet', {
      key: globalVariables.tooltips,
/!*      value: JSON.stringify({
        mainScreenComplete: false,
        story1: {
          balance: false,
          quizBlock: false,
          taxEffect: false,
        },
        story2: {
          GPeffect: true,
          notifications: false,
        },
        shop: true,
      }),*!/
      value: '',
    });*/

    /*    bridge.send('VKWebAppGetAuthToken', { app_id: 7441788, scope: 'stories' })
          .then((data) => {
            setTimeout(() => console.info(data), 1000)

            bridge.send('VKWebAppCallAPIMethod', {
              method: 'stories.getPhotoUploadServer',
              request_id: 'test123321test',
              params: {
                v: '5.103',
                access_token: data.access_token,
                add_to_news: 1,
                link_url: 'https://vk.com/app7441788',
              }
            })
              .then((data) => setTimeout(() => console.info(data), 1000))
              .catch((error) => setTimeout(() => console.info(error), 1000));

    /!*        bridge.send('stories.getPhotoUploadServer', {
              access_token: data.access_token,
              add_to_news: 1,
              link_url: 'https://vk.com/app7441788',
            })*!/

          }) */

/*    bridge.send('VKWebAppGetAuthToken', { app_id: 7441788, scope: 'stats, friends' })
      .then((data) => {
        setTimeout(() => console.info(data), 1000)
        bridge.send('VKWebAppCallAPIMethod', {
          method: 'stats.get',
          params: {
            v: '5.103',
            access_token: data.access_token,
            app_id: 7441788,
            interval: 'all',
            extended: 1
          }
        })
          .then((data) => setTimeout(() => console.info(data), 1000))
          .catch((error) => setTimeout(() => console.info(error), 1000));
      });*/
  }, []);

  const [activePanel, setAcitvePanel] = useState('1');
  return (
    <View
      id={id}
      activePanel={activePanel}
      className="TestView"
      modal={(
        <WorkViewModal
          nextView={() => {}}
          setPopoutIsActive={() => {}}
          isPreviousQuiz={false}
        />
      )}
    >
      <TestPanel setActivePanel={setAcitvePanel} id="1" />
      <TestPanel2 setActivePanel={setAcitvePanel} id="2" />

    </View>
  );
};

TestView.propTypes = {
  id: PropTypes.string.isRequired,
};
TestView.defaultProps = {};
export default TestView;
