import React, { useCallback, useEffect, useRef, useState, } from 'react';
import {
  Button,
  Card,
  Div,
  Group,
  IOS,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Separator,
  SimpleCell,
  Snackbar,
  Text,
  Title,
  usePlatform,
} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import './quizResult.css';
import htmlToImage from 'html-to-image';

import { useSelector } from 'react-redux';
import axios from 'axios';

import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import SimpleCrypto from 'simple-crypto-js';
import { background, logo } from './Components/StorySticker/stickers.json';
import globalVariables from '../../GlobalVariables';
import StorySticker from './Components/StorySticker/StorySticker';

const reader = new FileReader();

const QuizResult = (props) => {
  const { id, nextView, setPopoutShadowIsActive } = props;
  const platform = usePlatform();
  const userToken = useSelector((state) => state.userToken.token);
  const quizResult = useSelector((state) => state.quiz.quizResult);
  const questions = useSelector((state) => state.quiz.questions);

  const stickerRef = useRef(null);
  const [stickerBase64, setStickerBase64] = useState('');
  const [stickerAnswersData, setStickerAnswersData] = useState([null, null, null, null]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [resultGP, setResultGP] = useState(0);
  const [resultCoins, setResultCoins] = useState(0);
  const [storyReward, setStoryReward] = useState(0);

  const [phrase, setPhrase] = useState('-');
  const [wordScore, setWordScore] = useState('');
  const [storyQuestion, setStoryQuestion] = useState({
    question: '',
    _id: '',
    isCorrectAnswer: false,
  });
  const [storySent, setStorySent] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    isShow: false,
    content: '',
  });

  const sourceAxios = axios.CancelToken.source();

  const controlHardwareBackButton = useCallback(() => {
    nextView(globalVariables.view.main);
  }, []);
  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'QuizResult' }, 'QuizResult', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'QuizResult' }, 'QuizResult', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  useEffect(() => {
    const cases = [2, 0, 1, 1, 1, 2];
    const word = ['очко', 'очка', 'очков'][(correctAnswers % 100 > 4 && correctAnswers % 100 < 20) ? 2 : cases[(correctAnswers % 10 < 5) ? correctAnswers % 10 : 5]];
    setWordScore(word);
  }, [resultGP]);

  const bridgeOnRestore = useCallback((e) => {
    switch (e.detail.type) {
      case 'VKWebAppViewRestore': {
        // updateView();
        break;
      }
      case 'VKWebAppViewHide': {
        sourceAxios.cancel();
        break;
      }
      default:
        break;
    }
  }, []);

  useEffect(() => {
    bridge.subscribe(bridgeOnRestore);

    bridge.send('VKWebAppStorageGet', {
      keys: ['secret'],
    })
      .then((storedQuiz) => {
        const simpleCrypto = new SimpleCrypto(storedQuiz.keys[0].value);

        // eslint-disable-next-line
        const answers = quizResult.map((item) => simpleCrypto.encrypt({
          _id: item.questionId,
          text: item.selectedAnswer,
        }));
        const correctQuestions = [];
        for (let i = 0; i < quizResult.length; i += 1) {
          if (quizResult[i].selectedAnswerNumber === quizResult[i].correctAnswerNumber) {
            correctQuestions.push(questions[i + 1]);
          }
        }

        if (correctQuestions.length > 0) {
          const tempQuestion = correctQuestions[
            Math.round(Math.random() * (correctQuestions.length - 1))
          ];
          setStoryQuestion({
            question: tempQuestion.question,
            answers: tempQuestion.answers,
            name: '',
            photo: '',
            _id: tempQuestion._id,
            isCorrectAnswer: true,
          });
        } else {
          const tempQuestion = questions[
            Math.round(Math.random() * (questions.length - 1))
          ];

          setStoryQuestion({
            question: tempQuestion.question,
            answers: tempQuestion.answers,
            name: '',
            photo: '',
            _id: tempQuestion._id,
            isCorrectAnswer: false,
          });
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (userToken) {
          axios.post(`${globalVariables.serverURL}/api/examResults`, {
            answers,
          }, {
            timeout: 5000,
            timeoutErrorMessage: 'timeout',
            cancelToken: sourceAxios.token,
            params: {
              id: urlParams.get('vk_user_id'),
            },
            headers: {
              'X-Access-Token': userToken,
            },
          })
            .then(() => {
              bridge.send('VKWebAppStorageSet', { key: globalVariables.quizResult, value: '[]' })
                .catch((err) => {
                  console.info('BridgeError_quizResult_StorageSet#1', err);
/*                  setShowSnackbar({
                    isShow: true,
                    content: 'Ошибка: нет доступа к VK Storage',
                  });*/
                  nextView(globalVariables.view.connectionLost);
                });
              bridge.send('VKWebAppStorageSet', { key: globalVariables.quizQuestions, value: '[]' })
                .catch((err) => {
                  console.info('BridgeError_quizResult_StorageSet#2', err);
/*                  setShowSnackbar({
                    isShow: true,
                    content: 'Ошибка: нет доступа к VK Storage',
                  });*/
                  nextView(globalVariables.view.connectionLost);
                });
            })
            .catch((err) => {
              console.info('QuizResult, post/examResults', err);
              setShowSnackbar({
                isShow: true,
                content: 'Ошибка: нет связи с сервером',
              });
              if (err.response) {
                console.info(err.response.status);
              } else {
                console.info('Error 404');
              }
            });
        } else {
          // Перемещение на стартовый экран
/*          setShowSnackbar({
            isShow: true,
            content: 'Ошибка: нет доступа к токену',
          });*/
          nextView(globalVariables.view.start);
        }
      })
      .catch((err) => {
        console.info('BridgeError_quizResult_StorageGetSecret', err);
/*        setShowSnackbar({
          isShow: true,
          content: 'Ошибка: нет доступа к секретному ключу',
        });*/
        nextView(globalVariables.view.connectionLost);
      });

    return () => {
      bridge.unsubscribe(bridgeOnRestore);
    };
  }, []);

  useEffect(() => {
    let counter = 0;
    for (let i = 0; i < quizResult.length; i += 1) {
      if (quizResult[i].selectedAnswerNumber === quizResult[i].correctAnswerNumber) {
        counter += 1;
      }
    }
    setCorrectAnswers(counter);

    setResultCoins(counter * 10);
    setResultGP(counter);

    if (counter < quizResult.length) {
      const percentageCompleted = counter / quizResult.length;
      if (percentageCompleted <= 0.5) setPhrase('Тяжело в учении - легко в бою!');
      else if (percentageCompleted <= 0.75) setPhrase('Неплохой результат!');
      else setPhrase('Хороший результат!');
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  function sendStory() {
    setPopoutShadowIsActive(true);
    htmlToImage.toBlob(stickerRef.current)
      .then((blob) => {
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          setStickerBase64(reader.result);
          const i = new Image();
          i.onload = function () {
            const scaleCoef = i.height / stickerAnswersData[5].height;
            bridge.send('VKWebAppShowStoryBox', {
              background_type: 'image',
              locked: true,
              blob: background,
              attachment: {
                text: 'vote',
                type: 'url',
                url: 'https://vk.com/app7441788',
              },
              stickers: [
                {
                  sticker_type: 'renderable',
                  sticker: {
                    can_delete: false,
                    content_type: 'image',
                    blob: logo,
                    transform: {
                      gravity: 'center_top',
                      relation_width: 0.7,
                    },
                  },
                },
                {
                  sticker_type: 'renderable',
                  sticker: {
                    can_delete: false,
                    content_type: 'image',
                    blob: reader.result,
                    transform: {
                      gravity: 'center_bottom',
                      relation_width: 0.99,
                      translation_y: -0.03,
                    },
                    clickable_zones: [
                      {
                        action_type: 'link',
                        action: {
                          link: 'https://vk.com/app7441788',
                        },
                        clickable_area: [
                          {
                            x: 16,
                            y: stickerAnswersData[4].offset * scaleCoef,
                          },
                          {
                            x: 550 * 2 - 16,
                            y: stickerAnswersData[4].offset * scaleCoef,
                          },
                          {
                            x: 550 * 2 - 16,
                            y: (stickerAnswersData[4].offset + stickerAnswersData[4].height) * scaleCoef,
                          },
                          {
                            x: 16,
                            y: (stickerAnswersData[4].offset + stickerAnswersData[4].height) * scaleCoef,
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            })
              .then((storyData) => {
                if (storyData.result) {
                  setStoryReward(50);
                  setPopoutShadowIsActive(false);
                  setStorySent(true);
                } else {
                  setPopoutShadowIsActive(false);
                }
              })
              .catch((err) => {
                console.info('storyError', err);
                setPopoutShadowIsActive(false);
              });
          };
          i.src = reader.result;
        };
      })
      .catch((err) => {
        console.info('ConvertStickerError', err);
        setPopoutShadowIsActive(false);
      });
  }

  return (
    <Panel className="QuizResult" id={id}>
      <PanelHeader
        left={(
          <PanelHeaderBack
            label={(platform === IOS && 'Домой')}
            onClick={() => nextView(globalVariables.view.main)}
          />
        )}
      >
        Результат
      </PanelHeader>

      {(storyQuestion.question && (
        <div className="QuizResult__stickerContainer">

          <StorySticker
            ref={stickerRef}
            question={storyQuestion.question}
            answer0={storyQuestion.answers[0]}
            answer1={storyQuestion.answers[1]}
            answer2={storyQuestion.answers[2]}
            answer3={storyQuestion.answers[3]}
            name={storyQuestion.name}
            photo={storyQuestion.photo}
            setStickerAnswersData={setStickerAnswersData}
          />
        </div>

      ))}

      {showSnackbar.isShow && (
        <Snackbar
          duration={2000}
          onClose={() => {
            setShowSnackbar({
              isShow: false,
              content: '',
            });
          }}
          before={(
            <Icon28ErrorOutline height={24} width={24} style={{ color: 'var(--destructive)' }} />
          )}
        >
          {showSnackbar.content}
        </Snackbar>
      )}

      {correctAnswers === quizResult.length ? (
        <Group className="QuizResult--header">
          <Text>
            Вы не допустили ни одной ошибки!
            <br />
            Поздравляем!
          </Text>
        </Group>
      ) : (
        <Group className="QuizResult--header">
          <Text>
            {`${correctAnswers} из ${quizResult.length} правильных ответов`}
            <br />
            {`${phrase}`}
          </Text>
        </Group>
      )}

      <Div
        style={{ marginTop: '6px' }}
      >
        <Card
          mode="outline"
        >
          <Div className="QuizResult--rowContainer" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <SimpleCell
              disabled
              before={(
                <svg
                  width="32px"
                  height="32px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  className="QuizResult--icon"
                >
                  <g id="icn32_income" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <path
                      d="M16.0507812,28.4921875 C22.578125,28.4921875 28.0039062,23.078125 28.0039062,16.5390625 C28.0039062,10.0117188 22.5664062,4.5859375 16.0390625,4.5859375 C9.5,4.5859375 4.09765625,10.0117188 4.09765625,16.5390625 C4.09765625,23.078125 9.51171875,28.4921875 16.0507812,28.4921875 Z M16.0507812,26.5 C10.5195312,26.5 6.1015625,22.0703125 6.1015625,16.5390625 C6.1015625,11.0195312 10.5078125,6.578125 16.0390625,6.578125 C21.5585938,6.578125 26,11.0195312 26.0117418,16.5390625 C26.0234375,22.0703125 21.5703125,26.5 16.0507812,26.5 Z M16.109375,22.2929688 C16.4375,22.2929688 16.6953125,22.046875 16.6953125,21.7070312 L16.6953125,20.8398438 C18.171875,20.6640625 19.2265625,19.8203125 19.578125,18.7773438 C19.6015625,18.6601562 19.6484375,18.5195312 19.6484375,18.3671875 C19.6484375,17.9570312 19.34375,17.6757812 18.9335938,17.6757812 C18.6171875,17.6757812 18.3945312,17.875 18.265625,18.1796875 C17.9960938,18.8359375 17.46875,19.3164062 16.6953125,19.4570312 L16.6953125,13.6328125 C17.4570312,13.7734375 17.984375,14.2539062 18.2421875,14.9101562 C18.3828125,15.2382812 18.6171875,15.4140625 18.9453125,15.4140625 C19.3554688,15.4140625 19.6367188,15.1328125 19.6367188,14.7226562 C19.6367188,14.5820312 19.5898438,14.4414062 19.5664062,14.3242188 C19.2148438,13.2929688 18.1601562,12.4375 16.6953125,12.2617188 L16.6953125,11.3828125 C16.6953125,11.0429688 16.4375,10.8085938 16.109375,10.8085938 C15.78125,10.8085938 15.5351562,11.0429688 15.5351562,11.3828125 L15.5351562,12.2734375 C13.5078125,12.5429688 12.2070312,14.1484375 12.2070312,16.5390625 C12.2070312,18.9648438 13.5078125,20.5585938 15.5351562,20.828125 L15.5351562,21.7070312 C15.5351562,22.046875 15.78125,22.2929688 16.109375,22.2929688 Z M15.5351562,19.4335938 C14.3984375,19.1757812 13.6953125,18.15625 13.6953125,16.5507812 C13.6953125,14.96875 14.4101562,13.9375 15.5351562,13.65625 L15.5351562,19.4335938 Z"
                      id="icon"
                      fill="#FFA000"
                      fillRule="nonzero"
                    />
                  </g>
                </svg>
              )}
            >
              {`+${resultCoins} монет`}
            </SimpleCell>
            <Separator wide />
            <SimpleCell
              disabled
              before={(
                <svg
                  width="32px"
                  height="32px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  className="QuizResult--icon"
                >
                  <g
                    id="icn32_geniusBalance"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Icons-28/brain_outline_28Balance"
                      transform="translate(3.000000, 3.000000)"
                    >
                      <g id="brain_outline_28Balance">
                        <rect id="RectangleBalance" x="0" y="0" width="27" height="27" />
                        <path
                          d="M13.4810579,2.33617874 L13.691483,2.27255339 C16.4299675,1.47707805 18.7341631,2.34024854 20.1835473,4.45803683 L20.2792272,4.60210904 L20.4590858,4.67663602 C24.2626607,6.30310943 24.8864721,10.3196518 23.1680714,13.3831886 C24.0914261,14.6264906 24.2863495,15.8607187 23.8157484,17.0023621 C23.5111827,17.741216 23.0092102,18.3167763 22.320782,18.8588009 L22.2839772,18.8860733 L22.2887162,19.0737116 C22.3096849,21.5698012 20.9918238,22.8520952 19.0528303,22.8765246 C18.5167292,23.9831113 17.5940437,24.6940608 16.3402575,24.9521932 C15.2236518,25.1820826 14.2415768,24.9652665 13.4630241,24.3254442 C11.9537003,25.4870158 9.32705279,25.0253116 7.99540602,23.1229217 L7.86694153,22.9273948 L7.83242951,22.926481 C5.5775318,22.8268958 4.39657909,21.310896 4.60454649,19.1891897 L4.62404867,19.0172162 L4.56554326,18.9873086 C3.15126286,18.1942774 2.49175262,16.3877753 2.93620528,14.6729396 L2.99014971,14.4828356 C3.12632733,14.0416202 3.32352664,13.6417824 3.57610699,13.2889136 C1.92277909,10.5796883 2.7000141,6.00013231 6.39781513,4.79838793 L6.54297724,4.7535019 L6.72954712,4.51500497 C6.88553289,4.31642437 7.02414785,4.14668213 7.16628006,3.98246988 C8.85479137,2.03165072 10.8185743,1.29092321 13.4810579,2.33617874 Z M14.32009,3.89870799 L14.3189871,22.7386577 C14.7415335,23.2451819 15.2589176,23.4027032 15.9902456,23.2521356 C16.5437091,23.1381873 16.9576951,22.8976947 17.2566407,22.5056533 C16.3332408,22.0146329 15.8092064,21.02497 15.7093164,19.6598078 C15.6743389,19.1817815 16.0335009,18.7659098 16.5115272,18.7309322 C16.9895535,18.6959547 17.4054253,19.0551167 17.4404028,19.533143 C17.5157843,20.5633562 17.8349003,20.9951014 18.453885,21.0949377 C19.9704549,21.3395457 20.7322317,20.7060682 20.5239331,18.5536488 C20.4937879,18.2421488 20.6336884,17.938545 20.8900713,17.7590769 C21.555567,17.2932299 22.0036509,16.8439479 22.2110252,16.3408732 C22.3975404,15.8884011 22.3711672,15.3978994 22.0433124,14.8186377 C20.7986295,15.9325894 19.0097616,16.5294785 17.978916,16.0954383 C17.5371722,15.9094409 17.3298488,15.4005562 17.5158462,14.9588124 C17.7018436,14.5170687 18.2107283,14.3097452 18.6524721,14.4957426 C19.0788368,14.6752646 20.6869212,13.9874104 21.3883201,12.9622891 C23.0304641,10.5622324 22.6245233,7.26190194 19.4098842,6.12998677 C19.2170747,6.06209612 19.0544175,5.92832594 18.9505788,5.75225167 C17.9479155,4.05208345 16.384536,3.34793146 14.32009,3.89870799 Z M8.47867217,5.11839727 L8.22934449,5.41760164 L7.73651649,6.04901004 C7.61481309,6.20548582 7.44320851,6.31558114 7.25024495,6.36098433 C4.67002918,6.96809392 3.96308963,10.0785785 4.87035095,12.0378734 L4.91002462,12.1182915 C6.01720423,11.5168472 7.50148027,11.3475756 9.23731674,11.734911 C9.70511622,11.839296 9.99972185,12.3031432 9.89533685,12.7709426 C9.79095184,13.2387421 9.32710467,13.5333477 8.85930519,13.4289627 C6.50323565,12.9032282 5.0728314,13.6204262 4.64866565,14.9947233 C4.2976899,16.1318847 4.78264188,17.2961944 5.683601,17.5890595 L5.80899818,17.6235097 C6.28982314,17.7320831 6.58378928,18.218846 6.45605681,18.6949397 C5.99479436,20.4141907 6.59850154,21.2938783 8.32966302,21.1878888 C8.69008728,21.165822 9.02651471,21.3692383 9.17441745,21.698658 C9.89393137,23.3012117 11.9063595,23.6202894 12.5852067,22.7713689 L12.5830022,3.85445175 C10.8351077,3.25327794 9.66501452,3.7477583 8.47867217,5.11839727 Z M8.08837075,15.3022067 C9.05342595,15.6641024 9.83475986,16.2192607 10.4143292,16.9644212 C11.0078774,17.7275546 11.3236324,18.6537695 11.3645153,19.716724 C11.3829365,20.1956741 11.009604,20.5988732 10.5306538,20.6172944 C10.0517037,20.6357156 9.64850458,20.2623831 9.63008342,19.7834329 C9.60269827,19.071419 9.40644323,18.4957376 9.04423923,18.0300467 C8.66805632,17.5463829 8.15229793,17.179923 7.47892078,16.9274066 C7.03013421,16.7591116 6.80275083,16.2588682 6.9710458,15.8100817 C7.13934076,15.3612951 7.63958418,15.1339117 8.08837075,15.3022067 Z M17.3809956,7.6806774 C17.6407321,8.57532537 17.9917466,9.16934998 18.4059585,9.48610021 C18.802658,9.78945867 19.380524,9.92764403 20.1743147,9.87289984 C20.6524831,9.83992271 21.0668485,10.2008216 21.0998257,10.6789901 C21.1328028,11.1571585 20.7719039,11.5715239 20.2937355,11.6045011 C19.1077537,11.6862929 18.1154554,11.4490042 17.3515986,10.8648784 C16.6052542,10.2941445 16.0687845,9.38627275 15.7141089,8.16461224 C15.580474,7.7043142 15.8452868,7.22283641 16.3055848,7.08920149 C16.7658829,6.95556658 17.2473607,7.22037936 17.3809956,7.6806774 Z M10.9544037,6.35193866 C11.4193971,6.46818702 11.7021109,6.9393766 11.5858625,7.40437003 C11.3617073,8.30099102 10.885563,8.99140028 10.166406,9.42289445 C9.51848514,9.81164698 8.80079982,10.0073793 8.03026382,10.0073793 C7.55095956,10.0073793 7.16240668,9.61882646 7.16240668,9.13952219 C7.16240668,8.66021793 7.55095956,8.27166505 8.03026382,8.27166505 C8.4885521,8.27166505 8.89728903,8.16019134 9.27338838,7.93453173 C9.57825166,7.75161376 9.7847875,7.4521368 9.90197233,6.98339748 C10.0182207,6.51840405 10.4894103,6.2356903 10.9544037,6.35193866 Z"
                          id="↳-Icon-Color"
                          fill="#F65F5F"
                          fillRule="nonzero"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              )}
            >
              {`+${resultGP} ${wordScore} гения`}
            </SimpleCell>
          </Div>
        </Card>
        <div className="QuizResult--buttonColumn">
          {(!storySent && (
            <>
              <Div style={{ paddingRight: 0, paddingLeft: 0 }}>
                <Title level="3" weight="semibold" className="QuizResult--buttonColumn__title">
                  {(storyQuestion.isCorrectAnswer && 'Вы ответили верно.')}
                </Title>
                <Title level="3" weight="semibold" className="QuizResult--buttonColumn__title">
                  {(storyQuestion.isCorrectAnswer ? 'Смогут ли Ваши друзья?' : 'Возможно, друзья знают ответ?')}
                </Title>
                <Card mode="shadow" style={{ marginTop: '20px' }}>
                  <Div style={{ paddingTop: '20px', paddingBottom: '10px' }}>
                    <Title
                      level="2"
                      weight="semibold"
                      className="QuizResult--buttonColumn__card--title"
                    >
                      {storyQuestion.question}
                    </Title>
                    <Button
                      mode="primary"
                      size="xl"
                      className="QuizResult--buttonColumn__card--button"
                      onClick={() => {
                        if (storyQuestion.question) sendStory();
                      }}
                    >
                      Создать историю
                    </Button>
                  </Div>
                </Card>
              </Div>
              <Button
                mode="secondary"
                onClick={() => nextView(globalVariables.view.main)}
                style={{ marginTop: '8px' }}
              >
                Пропустить
              </Button>
            </>
          ))}
          {(storySent && (
            <Button
              mode="secondary"
              onClick={() => nextView(globalVariables.view.main)}
              style={{ marginTop: '8px' }}
            >
              Завершить
            </Button>
          ))}

        </div>

      </Div>
    </Panel>
  );
};

QuizResult.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
  setPopoutShadowIsActive: PropTypes.func.isRequired,
};
QuizResult.defaultProps = {};
export default QuizResult;
