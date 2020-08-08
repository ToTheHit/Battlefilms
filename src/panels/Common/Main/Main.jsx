import React, { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import {
  ANDROID,
  Avatar,
  Panel,
  PanelHeader,
  PullToRefresh,
  Separator,
  SimpleCell,
  Snackbar,
  usePlatform,
} from '@vkontakte/vkui';
import axios from 'axios';

import './main.css';
import { useDispatch, useSelector } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';

import Icon16Done from '@vkontakte/icons/dist/16/done';
import globalVariables from '../../../GlobalVariables';
import Films from './Components/Films/Films';
import Actions from './Components/Actions/Actions';

const { CronJob } = require('cron');

const Main = (props) => {
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.userToken.token);
  const snackbarInfo = useSelector((state) => state.mainSnackbar);
  const userInfo = useSelector((state) => state.userInfo);
  const userQuestions = useSelector((state) => state.userQuestions);
  const tooltipsState = useSelector((state) => state.tooltip.mainScreenComplete);
  const mainViewModalName = useSelector((state) => state.mainViewModal.modalName);
  const scrollListener = useSelector((state) => state.scrollTo);
  const myBattle = useSelector((state) => state.myBattle);
  let appIsClosed = false;
  const platform = usePlatform();

  const CancelToken1 = axios.CancelToken;
  const source = CancelToken1.source();

  const cancelSource = React.useRef(null);

  const {
    id, setActivePanel,
    setSelectedQuestion, nextView,
    setActiveStory, setPopoutMainView,
    popoutMainView,
  } = props;

  const [effects, setEffects] = useState(userInfo.effects);
  const [questions, setQuestions] = useState(userQuestions.questions);
  const [VKuser, setVKuser] = useState(userInfo);
  const [updatingView, setUpdatingView] = useState(false);
  // const [networkErrorCount, setNetworkErrorCount] = useState(0);
  const networkErrorCount = 0;

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.main) {
      // scroll.top(document.body, 0);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollListener]);

  function updateView() {
    const urlParams = new URLSearchParams(window.location.search);
    // console.info(window.location.hash.substr(1));
    // console.info(urlParams.get('vk_user_id'));
    let user = {
      first_name: '',
      last_name: '',
      photo_100: '',
    };
    bridge.send('VKWebAppGetUserInfo', {})
      .then((data) => {
        user = {
          first_name: data.first_name,
          last_name: data.last_name,
          photo_100: data.photo_100,
          /*          allFilms: [{
                      name: 'Назад в будущее',
                      year: '1995',
                      score: '8.9',
                      imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
                      authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
                    },
                    {
                      name: 'Назад в будущее1',
                      year: '1995',
                      score: '8.9',
                      imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
                      authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
                    },
                    {
                      name: '1+1',
                      year: '2011',
                      score: '8.8',
                      imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/4c78b2e3-ffed-4985-bbc2-642952c92f5e/52',
                      authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
                    },
                    ],
                    myFilms: [{
                      name: 'Назад в будущее',
                      year: '1995',
                      score: '8.9',
                      imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
                      authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
                    },
                    {
                      name: '1+1',
                      year: '2011',
                      score: '8.8',
                      imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/4c78b2e3-ffed-4985-bbc2-642952c92f5e/52',
                      authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
                    },
                    ], */
        };
        dispatch({
          type: 'UPDATE_MY_BATTLE',
          payload: {
            pid: '',
            allFilms: [{
              mid: 0,
              name: 'Назад в будущее',
              year: '1995',
              score: '8.9',
              imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
              authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
            },
            {
              mid: 0,
              name: 'Назад в будущее1',
              year: '1995',
              score: '8.9',
              imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
              authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
            },
            {
              mid: 0,
              name: '1+1',
              year: '2011',
              score: '8.8',
              imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/4c78b2e3-ffed-4985-bbc2-642952c92f5e/52',
              authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
            },
            ],
            myFilms: [{
              mid: 0,
              name: 'Назад в будущее',
              year: '1995',
              score: '8.9',
              imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/73cf2ed0-fd52-47a2-9e26-74104360786a/52',
              authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
            },
            {
              mid: 0,
              name: '1+1',
              year: '2011',
              score: '8.8',
              imageURL: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/4c78b2e3-ffed-4985-bbc2-642952c92f5e/52',
              authorPhoto: 'https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1',
            },
            ],
            members: [],
            settings: {
              limit: 3,
              type: 0,
              numberOfWinners: 1,
              allowRepetitions: false,
            },
          },
        });
        setVKuser({ ...VKuser, ...user });
        setUpdatingView(false);
        setPopoutMainView(false);
      });

    /*    if (!userToken) {
      // Перемещение на стартовый экран
      console.info('Main, Get /api/, Token not found');
      setTimeout(() => {
        // nextView(globalVariables.view.start);
      }, 1500);
    } else {
      // console.info(urlParams.get('vk_user_id'), userToken)
      cancelSource.current = axios.CancelToken.source();
      /!*      axios.all([
              axios.get(`${globalVariables.serverURL}/api/userInfo`, {
                cancelToken: source.token,
                timeout: 10000,
                timeoutErrorMessage: 'Timeout',
                params: {
                  id: urlParams.get('vk_user_id'),
                },
                headers: {
                  'X-Access-Token': userToken,
                },
              }),
              axios.get(`${globalVariables.serverURL}/api/allUserQuestions`, {
                cancelToken: source.token,
                timeout: 10000,
                timeoutErrorMessage: 'Timeout',
                params: {
                  id: urlParams.get('vk_user_id'),
                },
                headers: {
                  'X-Access-Token': userToken,
                },
              }),
            ])
              .then((data) => {
                // setNetworkErrorCount(0);
                networkErrorCount = 0;
                const srvData = data[0].data.attachment;
                // console.info('user', srvData);
                // console.info('questions', data[1].data.attachment);
                // console.info('token', userToken);
                const tax = (Math.round(srvData.coins.overall * srvData.tax) >= 10 ? Math.round(srvData.coins.overall * srvData.tax) : 10);
                bridge.send('VKWebAppGetUserInfo', {})
                  .then((bridgeData) => {
                    const user = {
                      first_name: bridgeData.first_name,
                      last_name: bridgeData.last_name,
                      photo_100: bridgeData.photo_100,
                      GP: srvData.bp,
                      GPgrowth: srvData.bp.today,
                      coins: srvData.coins,
                      tax,
                      isExamAvailable: srvData.isExamAvailable,
                      isExamSuccess: srvData.isExamSuccess,
                      isStoryConfirmed: srvData.isStoryConfirmed,
                      lastExamReward: srvData.lastExamReward,
                      confirmReward: srvData.confirmReward,
                      leads: srvData.leads,
                      isPioneer: srvData.isPioneer,
                      isMaster: srvData.isMaster,
                      storiesCount: srvData.storiesCount,
                      effects: [],
                      msToNextExam: {
                        value: srvData.msToNextExam.value,
                        isUpdating: srvData.msToNextExam.isUpdating,
                      },
                      notifications: srvData.notifications.reverse(),
                    };
                    if (!tooltipsState && !user.isExamAvailable) {
                      dispatch({
                        type: 'TOOLTIP_UPDATE_STORY2',
                        payload: {
                          GPeffect: true,
                        },
                      });
                    }

                    const effectsArray = [];
                    if (!srvData.isExamSuccess) {
                      effectsArray.push(
                        {
                          name: 'Tax',
                          count: user.tax,
                          currency: 'М',
                          description: 'Мозговой налог',
                          icon: (
                            <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
                              <g
                                id="icn32_tax"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <path
                                  d="M16.072,28.1875 C22.4352812,28.1875 27.7087187,22.9023438 27.7087187,16.5390625 C27.7087187,10.8203125 23.4430937,5.98046875 17.9704375,5.06640625 L17.9704375,3.859375 C17.9704375,3.02734375 17.197,2.74609375 16.54075,3.23828125 L13.400125,5.58203125 C12.97825,5.8984375 12.97825,6.49609375 13.400125,6.82421875 L16.54075,9.15625 C17.1852812,9.63671875 17.9704375,9.35546875 17.9704375,8.546875 L17.9704375,7.08203125 C22.400125,7.9609375 25.7165312,11.8398438 25.7165312,16.5390625 C25.7165312,21.8945312 21.41575,26.171875 16.072,26.1835938 C10.7165312,26.1953125 6.41575,21.90625 6.41575,16.5507812 C6.41575,13.3515625 7.962625,10.5507812 10.3298125,8.79296875 C10.9040312,8.34765625 10.9274687,7.73828125 10.6462187,7.33984375 C10.35325,6.953125 9.7673125,6.77734375 9.1345,7.2578125 C6.2985625,9.296875 4.43528125,12.7421875 4.43528125,16.5507812 C4.43528125,22.796875 10.072,28.1875 16.072,28.1875 Z M20.0798125,17.7226562 C20.6423125,17.7226562 21.0290312,17.4179688 21.0290312,16.890625 C21.0290312,16.3515625 20.6774687,16.0351562 20.0798125,16.0351562 L12.0524687,16.0351562 C11.47825,16.0351562 11.10325,16.3515625 11.10325,16.890625 C11.10325,17.4179688 11.5016875,17.7226562 12.0524687,17.7226562 L20.0798125,17.7226562 Z"
                                  id="-tax"
                                  fill="#EB4250"
                                  fillRule="nonzero"
                                />
                              </g>
                            </svg>),
                        },
                      );
                    }
                    effectsArray.push(
                      {
                        name: 'GPtoday',
                        count: user.GP.today,
                        currency: 'GP',
                        description: 'Прирост гения',
                        icon: (
                          <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
                            <g
                              id="icn32_genius_plus"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <path
                                d="M23.2753906,21.7890625 C26.0976562,21.7890625 28.4023438,19.6503906 28.6855469,16.9257812 L29.8476562,16.9257812 C30.2871094,16.9257812 30.4628906,16.6621094 30.4628906,16.3007812 L30.4628906,15.9296875 C30.4628906,15.5585938 30.2871094,15.3046875 29.8476562,15.3046875 L28.6171875,15.3046875 C28.1191406,12.8242188 25.921875,10.9296875 23.2753906,10.9296875 C20.7363281,10.9296875 18.6074219,12.6777344 18.0117188,15.03125 C17.5625,14.8554688 17.0351562,14.796875 16.6054688,14.796875 C16.1757812,14.796875 15.6484375,14.8554688 15.1992188,15.03125 C14.59375,12.6777344 12.4648438,10.9296875 9.93554688,10.9296875 C7.2890625,10.9296875 5.09179688,12.8242188 4.59375,15.3046875 L3.36328125,15.3046875 C2.9140625,15.3046875 2.74804688,15.5585938 2.74804688,15.9296875 L2.74804688,16.3007812 C2.74804688,16.6621094 2.9140625,16.9257812 3.36328125,16.9257812 L4.52539062,16.9257812 C4.80859375,19.6503906 7.11328125,21.7890625 9.93554688,21.7890625 C12.9140625,21.7890625 15.3164062,19.3671875 15.3652344,16.4472656 C15.7851562,16.2910156 16.234375,16.2324219 16.6054688,16.2324219 C16.9765625,16.2324219 17.4257812,16.2910156 17.8457031,16.4472656 C17.8945312,19.3964844 20.296875,21.7890625 23.2753906,21.7890625 Z M9.93554688,20.3242188 C7.74804688,20.3242188 5.97070312,18.5566406 5.97070312,16.359375 C5.97070312,14.171875 7.74804688,12.3945312 9.93554688,12.3945312 C12.1132812,12.3945312 13.9003906,14.171875 13.9003906,16.359375 C13.9003906,18.5566406 12.1425781,20.3242188 9.93554688,20.3242188 Z M23.2753906,20.3242188 C21.0683594,20.3242188 19.3105469,18.5566406 19.3105469,16.359375 C19.3105469,14.171875 21.0683594,12.3945312 23.2753906,12.3945312 C25.4628906,12.3945312 27.2402344,14.171875 27.2402344,16.359375 C27.2402344,18.5566406 25.4628906,20.3242188 23.2753906,20.3242188 Z"
                                id="glasses"
                                fill="var(--button_primary_background)"
                                fillRule="nonzero"
                              />
                            </g>
                          </svg>),
                      },
                    );
                    effectsArray.push(
                      {
                        name: 'CoinsToday',
                        count: user.coins.today,
                        currency: 'M',
                        description: 'Дневной доход',
                        icon: (
                          <svg
                            width="32px"
                            height="32px"
                            viewBox="0 0 32 32"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              id="icn32_income"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <g
                                id="Icons-28/money_request_outline_28"
                                transform="translate(2.000000, 2.000000)"
                              >
                                <g id="money_request_outline_28">
                                  <polygon points="0 0 28 0 28 28 0 28" />
                                  <path
                                    d="M19.2928932,19.2928932 C19.6834175,18.9023689 20.3165825,18.9023689 20.7071068,19.2928932 C21.0976311,19.6834175 21.0976311,20.3165825 20.7071068,20.7071068 L20.7071068,20.7071068 L19.413,22 L27,22 C27.5128358,22 27.9355072,22.3860402 27.9932723,22.8833789 L28,23 C28,23.5522847 27.5522847,24 27,24 L27,24 L19.415,24 L20.7071068,25.2928932 C21.0675907,25.6533772 21.0953203,26.2206082 20.7902954,26.6128994 L20.7071068,26.7071068 C20.3165825,27.0976311 19.6834175,27.0976311 19.2928932,26.7071068 L19.2928932,26.7071068 L16.2928932,23.7071068 C15.9023689,23.3165825 15.9023689,22.6834175 16.2928932,22.2928932 L16.2928932,22.2928932 Z M24,12.8458278 C24,11.7775676 23.9265592,11.39726 23.7174877,11.0063303 C23.5492269,10.6917099 23.3082901,10.4507731 22.9936697,10.2825123 C22.60274,10.0734408 22.2224324,10 21.1541722,10 L4,10 L4,19.1541722 C4,20.2224324 4.07344079,20.60274 4.28251225,20.9936697 C4.45077309,21.3082901 4.69170989,21.5492269 5.0063303,21.7174877 C5.39725995,21.9265592 5.77756757,22 6.8458278,22 L13,22 L13,22 C13.5522847,22 14,22.4477153 14,23 C14,23.5522847 13.5522847,24 13,24 L6.8458278,24 C5.47563815,24 4.78341544,23.8663256 4.06313259,23.4811141 C3.39997522,23.1264537 2.8735463,22.6000248 2.51888586,21.9368674 C2.13367437,21.2165846 2,20.5243618 2,19.1541722 L2,8 L2.002,8 L2.00211335,7.9452984 C2.01920744,6.94497863 2.14223692,6.38674261 2.45210268,5.80734401 C2.76318635,5.22566813 3.22566813,4.76318635 3.80734401,4.45210268 C4.43502582,4.11641478 5.03787101,4 6.2048565,4 L17.7951435,4 C18.962129,4 19.5649742,4.11641478 20.192656,4.45210268 C20.7743319,4.76318635 21.2368137,5.22566813 21.5478973,5.80734401 C21.8654399,6.40109708 21.9867739,6.97262599 21.9989633,8.02046757 C22.8440347,8.0747324 23.382129,8.22220852 23.9368674,8.51888586 C24.6000248,8.8735463 25.1264537,9.39997522 25.4811141,10.0631326 C25.8663256,10.7834154 26,11.4756382 26,12.8458278 L26,19 L26,19 C26,19.5522847 25.5522847,20 25,20 C24.4477153,20 24,19.5522847 24,19 L24,12.8458278 Z M20,15 C20.5522847,15 21,15.4477153 21,16 C21,16.5522847 20.5522847,17 20,17 L18,17 C17.4477153,17 17,16.5522847 17,16 C17,15.4477153 17.4477153,15 18,15 L20,15 Z M17.7951435,6 L6.2048565,6 C5.33980043,6 5.04887034,6.05618119 4.75054173,6.21572908 C4.5174028,6.34041314 4.34041314,6.5174028 4.21572908,6.75054173 C4.06949177,7.02398173 4.01009347,7.29120619 4.00120047,8 L19.9987995,8 C19.9899065,7.29120619 19.9305082,7.02398173 19.7842709,6.75054173 C19.6595869,6.5174028 19.4825972,6.34041314 19.2494583,6.21572908 C18.9511297,6.05618119 18.6601996,6 17.7951435,6 Z"
                                    id="↳-Icon-Color"
                                    fill="#AB9871"
                                    fillRule="nonzero"
                                  />
                                </g>
                              </g>
                            </g>
                          </svg>),
                      },
                    );
                    if (user.leads.length > 0) {
                      effectsArray.push(
                        {
                          name: 'Mindopolist',
                          count: 'Мозгополист',
                          currency: '',
                          description: '+20% к доходу',
                          icon: (
                            <svg
                              width="32px"
                              height="32px"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="icn32_mindopoly"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <path
                                  d="M15.7303914,4.42399454 C16.4183865,4.57877305 16.8506439,5.26197607 16.6957976,5.9502722 C16.62435,6.26736717 16.5266806,6.53124781 16.3840382,6.75150517 C14.3778188,9.8493541 14.7004944,11.8928348 16.0389464,12.0908125 C17.3474793,12.2843647 18.0789168,11.4477304 17.8681063,9.49997127 C17.8186179,9.04272832 17.7772323,8.6572662 17.7439423,8.34351467 C17.7134017,8.0556752 17.7837928,7.76616481 17.9430811,7.52448004 C18.3226468,6.94857306 19.0972103,6.78940696 19.6730664,7.16893902 C20.365162,7.62501644 21.1404247,8.40141172 22.0261604,9.50612281 C24.5420512,12.6440032 25.3196592,15.3874149 25.2844441,18.1966647 C25.218837,23.430386 21.3167444,27.1428329 15.9994014,27.1428329 C10.6596158,27.1428329 6.71430172,23.4081931 6.71430172,18.1795735 C6.74145217,13.5554994 9.25910571,8.53162499 13.9676113,5.17176973 C14.1499658,5.04164675 14.3909185,4.86555157 14.6896014,4.6440721 C14.9879991,4.42280415 15.3679652,4.3424594 15.7303914,4.42399454 Z M13.8000783,7.66320619 C10.3915583,10.6113522 8.59266254,14.571048 8.57142857,18.1850256 C8.57142857,22.3590378 11.6631884,25.2856901 15.9994014,25.2856901 C20.3152499,25.2856901 23.3747798,22.3748565 23.4274471,18.1733864 C23.4576405,15.7647445 22.798049,13.4376968 20.5772346,10.667843 C20.2819533,10.299561 20.0046737,9.9769516 19.7468965,9.70045098 C19.8981786,12.5493818 18.2487163,14.2950207 15.767203,13.9279666 C13.253919,13.556213 12.4407952,10.9083174 13.8000783,7.66320619 Z"
                                  id="↳-Icon-Color"
                                  fill="#FF6C43"
                                />
                              </g>
                            </svg>
                          ),
                        },
                      );
                    }
                    if (user.isMaster) {
                      effectsArray.push(
                        {
                          name: 'Master',
                          count: 'Магистр',
                          currency: '',
                          description: 'Достижение',
                          icon: (
                            <svg
                              width="32px"
                              height="32px"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="icn32_edu"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <g
                                  id="Icons-20/education_outline_20"
                                  transform="translate(3.000000, 3.000000)"
                                >
                                  <g id="education_outline_20">
                                    <rect x="0" y="0" width="26" height="26" />
                                    <path
                                      d="M13.7813128,2.80046795 L23.8564215,8.32515779 C24.3948726,8.62041767 24.6997844,9.17610164 24.7004118,9.74968051 L24.7,9.75 L24.7,16.8 C24.7,17.2142136 24.3642136,17.55 23.95,17.55 L23.5,17.55 C23.0857864,17.55 22.75,17.2142136 22.75,16.8 L22.7495872,11.7813102 L20.7995872,12.8503102 L20.8,16.9 C20.8,20.5406145 17.2678179,23.4 13,23.4 C8.73218212,23.4 5.2,20.5406145 5.2,16.9 L5.19958722,12.8503102 L2.14357855,11.1748422 C1.35665993,10.7433351 1.06854199,9.75560583 1.50004913,8.96868721 C1.64888561,8.69726134 1.87215269,8.47399427 2.14357855,8.32515779 L12.2186872,2.80046795 C12.7053779,2.53359089 13.2946221,2.53359089 13.7813128,2.80046795 Z M18.8495872,13.9193102 L13.7813128,16.6995321 C13.2946221,16.9664091 12.7053779,16.9664091 12.2186872,16.6995321 L7.14958722,13.9203102 L7.15,16.9 C7.15,19.362132 9.72913104,21.45 13,21.45 C16.270869,21.45 18.85,19.362132 18.85,16.9 L18.8495872,13.9193102 Z M13,4.59596523 L3.60083701,9.75 L13,14.9040348 L22.399163,9.75 L13,4.59596523 Z"
                                      id="↳-Icon-Color"
                                      fill="#5856D6"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          ),
                        },
                      );
                    }
                    if (user.isPioneer) {
                      effectsArray.push(
                        {
                          name: 'Pioneer',
                          count: 'Первопроходец',
                          currency: '',
                          description: 'Достижение',
                          icon: (
                            <svg
                              width="32px"
                              height="32px"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="icn32_pioneer"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                              >
                                <g
                                  id="Icons-28/compass_outline_28-@-explore"
                                  transform="translate(2.000000, 2.000000)"
                                >
                                  <g id="compass_outline_28">
                                    <polygon points="0 0 28 0 28 28 0 28" />
                                    <path
                                      d="M14,2 C20.627417,2 26,7.372583 26,14 C26,20.627417 20.627417,26 14,26 C7.372583,26 2,20.627417 2,14 C2,7.372583 7.372583,2 14,2 Z M14,4 C8.4771525,4 4,8.4771525 4,14 C4,19.5228475 8.4771525,24 14,24 C19.5228475,24 24,19.5228475 24,14 C24,8.4771525 19.5228475,4 14,4 Z M18.9486833,10.3162278 L16.9486833,16.3162278 C16.8491483,16.6148328 16.6148328,16.8491483 16.3162278,16.9486833 L10.3162278,18.9486833 C9.53446974,19.2092693 8.79073069,18.4655303 9.0513167,17.6837722 L11.0513167,11.6837722 C11.1508517,11.3851672 11.3851672,11.1508517 11.6837722,11.0513167 L17.6837722,9.0513167 C18.4655303,8.79073069 19.2092693,9.53446974 18.9486833,10.3162278 Z M16.4188612,11.5811388 L12.7905694,12.7905694 L11.5811388,16.4188612 L15.2094306,15.2094306 L16.4188612,11.5811388 Z"
                                      id="↳-Icon-Color"
                                      fill="#D1D10B"
                                      fillRule="nonzero"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          ),
                        },
                      );
                    }
                    user.effects = effectsArray;
                    setVKuser({ ...VKuser, ...user });
                    setEffects(effectsArray);
                    setQuestions(data[1].data.attachment);

                    setPopoutMainView(false);
                    setUpdatingView(false);
                  });
              })
              .catch((err) => {
                setPopoutMainView(true);
                // setNetworkErrorCount(((prevState) => prevState + 1));
                networkErrorCount += 1;
                console.info('Main, Get /api/, Server response Error');
                console.info('Main, Get /api/', err);
                if (err.message === 'Unmount panel') {
                  // nextView(globalVariables.view.connectionLost);
                  setPopoutMainView(false);
                } else if (appIsClosed) {
                  console.info('Main, Get /api/, Error was in hidden app');
                } else {
                  if (networkErrorCount === 2) {
                    setTimeout(() => {
                      nextView(globalVariables.view.connectionLost);
                    }, 1000);
                  } else updateView();
                  // nextView(globalVariables.view.connectionLost);
                }
                // Сервер не нашёл токен в БД.
                // Перемещение на стартовый экран
              }); *!/
    } */
  }

  function onCloseSnackbar() {
    dispatch({
      type: 'UPDATE_MAIN_SNACKBAR',
      payload: {
        showSnackbar: false,
        text: '',
      },
    });
  }

  useEffect(() => {
    if (updatingView) {
      bridge.send('VKWebAppTapticImpactOccurred', { style: 'light' });
      updateView();
    }
  }, [updatingView]);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: { ...VKuser, ...{ date: Date.now() } },
    });
  }, [VKuser]);

  useEffect(() => {
    if (Array.isArray(questions)) {
      // Вопросы с сервера
      const questionsCategories = {
        All: [],
        Math: [],
        Russian: [],
        Literature: [],
        Physics: [],
        Chemistry: [],
        Astronomy: [],
        Biology: [],
        History: [],
        Art: [],
        Sport: [],
        Geography: [],
        Other: [],
      };
      let unapprovedQuestions = 0;
      for (let i = 0; i < questions.length; i += 1) {
        questionsCategories.All.push(questions[i]);
        questionsCategories[questions[i].category].push(questions[i]);
        if (!questions[i].approved) unapprovedQuestions += 1;
      }
      dispatch({
        type: 'UPDATE_USER_QUESTIONS',
        payload: {
          category: (userQuestions.category === 'All' ? 'All' : userQuestions.category),
          questions: questionsCategories,
          selectedQuestionsCategory: (userQuestions.category === 'All' ? questionsCategories.All : questionsCategories[userQuestions.category]),
          unapprovedQuestions,
        },
      });
    }
  }, [questions]);

  const bridgeOnRestore = useCallback((e) => {
    switch (e.detail.type) {
      case 'VKWebAppViewRestore': {
        setTimeout(() => {
          updateView();
        }, 1000);
        break;
      }
      case 'VKWebAppViewHide': {
        appIsClosed = true;
        break;
      }
      default:
        break;
    }
  }, []);

  const onRestore = useCallback(() => {
    if (appIsClosed) {
      appIsClosed = false;
      setTimeout(() => {
        updateView();
      }, 1000);
    }
  }, []);
  const controlHardwareBackButton = useCallback(() => {
    // setActivePanel(globalVariables.commonView.panels.main);
  }, []);
  const [closeApp, setCloseApp] = useState(false);
  useEffect(() => {
    if (!mainViewModalName && closeApp) {
      bridge.send('VKWebAppClose', { status: 'success' });
    } else {
      setCloseApp(false);
    }
  }, [closeApp]);

  useEffect(() => {
    const job = new CronJob('0 */1 * * * *', (() => {
      setTimeout(() => {
        updateView();
      }, 1000);
    }));
    job.start();
    return () => {
      job.stop();
    };
  }, []);

  useEffect(() => {
    if ((platform === ANDROID) && (window.history.length > 1)) {
      window.history.back();
    }

    if (userInfo.date === 0) {
      // setPopoutMainView(true);
    } else {
      // setPopoutMainView(false);
      setTimeout(() => {
        setPopoutMainView(false);
      }, 1);
      setEffects(userInfo.effects);
      setVKuser({ ...VKuser, ...userInfo });
      setUpdatingView(false);
    }
    updateView();
    dispatch({
      type: 'CLEAR_QUIZ_RESULT',
    });

    bridge.subscribe(bridgeOnRestore);
    window.addEventListener('focus', onRestore);
    // window.history.pushState({page: 'Main'}, 'Main', `${window.location.search}`);
    // window.history.go(-1);
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      bridge.unsubscribe(bridgeOnRestore);
      window.removeEventListener('popstate', controlHardwareBackButton);
      window.removeEventListener('focus', onRestore);
      // cancelSource.current.cancel('Unmount panel');
      source.cancel('Unmount panel');
      onCloseSnackbar();
    };
  }, []);

  useEffect(() => {

  }, []);

  return (
    <Panel id={id} className="Main" style={{ opacity: (popoutMainView ? '0' : '1') }}>
      <PanelHeader
        className="Main__header"
      >
        Ваша битва
      </PanelHeader>
      <PullToRefresh
        onRefresh={() => setUpdatingView(true)}
        isFetching={updatingView}
      >
        <SimpleCell
          disabled
          before={<Avatar size={48} src={userInfo.photo_100} />}
          description={`${userInfo.first_name} ${userInfo.last_name}`}
        >
          {`[Название]`}
        </SimpleCell>
        <Separator />
        <Actions
          setActivePanel={setActivePanel}
          isOwner
        />

        <div className="divider" />

        <Films
          nextView={nextView}
          allFilms={myBattle.allFilms}
          myFilms={myBattle.myFilms}
          isOwner
          settings={myBattle.settings}
        />

        {snackbarInfo.showSnackbar && (
          <Snackbar
            before={(
              <Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}>
                <Icon16Done
                  fill="#fff"
                  width={14}
                  height={14}
                />
              </Avatar>
            )}
            onClose={onCloseSnackbar}
            duration={3000}
          />
        )}
      </PullToRefresh>
    </Panel>
  );
};

Main.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  nextView: PropTypes.func.isRequired,
  setActiveStory: PropTypes.func.isRequired,
  setPopoutMainView: PropTypes.func.isRequired,
  popoutMainView: PropTypes.bool.isRequired,
};
Main.defaultProps = {};
export default Main;
