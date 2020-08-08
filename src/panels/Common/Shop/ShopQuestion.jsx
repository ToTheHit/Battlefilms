import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import './shopQuestion.css';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';

import {
  Button,
  Div,
  FormLayout,
  FormLayoutGroup,
  Group,
  Input,
  IOS,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  ScreenSpinner,
  Snackbar,
  Textarea,
  usePlatform,
  View,
} from '@vkontakte/vkui';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import bridge from '@vkontakte/vk-bridge';
import globalVariables from '../../../GlobalVariables';

const ShopQuestion = (props) => {
  const resultTypeOptions = {
    accepted: 'accepted',
    rejected: 'rejected',
    alreadyExist: 'alreadyExist',
  };
  const { id, questionData, setActivePanel } = props;

  const dispatch = useDispatch();
  const userBalance = useSelector((state) => state.userInfo.coins.overall);
  const userToken = useSelector((state) => state.userToken.token);
  const storedQuestion = useSelector((state) => state.shopQuestion.question);
  const unapprovedQuestions = useSelector((state) => state.userQuestions.unapprovedQuestions);
  const scrollListener = useSelector((state) => state.scrollTo);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showSnackbar1, setShowSnackbar1] = useState({ state: false, msg: '' });
  const [isFirstRender, setIsFirstRender] = useState(true);

  const controlHardwareBackButton = useCallback(() => {
    setActivePanel(globalVariables.commonView.panels.shop);
  }, []);

  useEffect(() => {
    if (isFirstRender) setIsFirstRender(false);
    else if (scrollListener.scrollableElement === globalVariables.commonView.roots.shop) {
      setActivePanel(globalVariables.commonView.panels.shop);
    }
  }, [scrollListener]);

  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'ShopQuestion' }, 'ShopQuestion', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'ShopQuestion' }, 'ShopQuestion', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  const inputPlaceholders = {
    Math: {
      question: 'Что извлекают математики?',
      answers: [
        'Корень', 'Выгоду', 'Пулю', 'Диск',
      ],
    },
    Russian: {
      question: 'Какого падежа не существует?',
      answers: [
        'Склонительного', 'Дательного', 'Предложного', 'Иминительного',
      ],
    },
    Literature: {
      question: 'Кто был М. Булгаков?',
      answers: [
        'Писатель', 'Математика', 'Физик', 'Химик',
      ],
    },
    Physics: {
      question: 'В чем измеряют напряжение?',
      answers: [
        'Вольты', 'Амперы', 'Моли', 'Джоули',
      ],
    },
    Chemistry: {
      question: 'Что открыл Менделеев?',
      answers: [
        'Водку', 'Закон всемирного тяготения', 'Дверь', 'Окно',
      ],
    },
    Astronomy: {
      question: 'В какой системе находится Земля?',
      answers: [
        'Солнечная', 'Млечная', 'Мрачная', 'Яркая',
      ],
    },
    Biology: {
      question: 'На кого похож человек?',
      answers: [
        'Обезьяна', 'Слон', 'Жираф', 'Собака',
      ],
    },
    History: {
      question: 'Когда отмечают День Конституции РФ?',
      answers: [
        '12 декабря', '10 января', '11 апреля', '21 декабря',
      ],
    },
    Art: {
      question: 'Кто нарисовал чёрный квадрат?',
      answers: [
        'Малевич', 'Пикассо', 'Шишкин', 'Васнецов',
      ],
    },
    Sport: {
      question: 'Фамилия российского футбольного комментатора?',
      answers: [
        'Уткин', 'Коршунов', 'Голубев', 'Белкин',
      ],
    },
    Other: {
      question: 'Кем был Гарри Поттер?',
      answers: [
        'Волшебником', 'Учёным', 'Детективом', 'Космонавтом',
      ],
    },
    Geography: {
      question: 'Столица Канады?',
      answers: [
        'Оттава', 'Сингапур', 'Мехико', 'Рио-Де-Жанейро',
      ],
    },
  };
  const maxSymbolsInInput = {
    question: 150,
    answers: [52, 52, 52, 52],
    explanation: 300,
  };
  const [symbolCounter, setSymbolCounter] = useState({
    question: maxSymbolsInInput.question,
    answers: [
      maxSymbolsInInput.answers[0],
      maxSymbolsInInput.answers[1],
      maxSymbolsInInput.answers[2],
      maxSymbolsInInput.answers[3],
    ],
    explanation: maxSymbolsInInput.explanation,
  });

  const refQuestionText = useRef(null);
  const refQuestionCorrectAnswer = useRef(null);
  const refQuestionIncorrectAnswer1 = useRef(null);
  const refQuestionIncorrectAnswer2 = useRef(null);
  const refQuestionIncorrectAnswer3 = useRef(null);
  const refQuestionExplanation = useRef(null);

  const [emptyInput, setEmptyInput] = useState({
    input0: false,
    input1: false,
    input2: false,
    input3: false,
    input4: false,
  });

  const [checkingProgress, setCheckingProgress] = useState(false);
  const [activeSubviewPanel, setActiveSubviewPanel] = useState('ShopQuestionSubview-makeQuestion');
  const [resultType, setResultType] = useState(''); // accepted, rejected, alreadyExist
  const [questionValue, setQuestionValue] = useState('');
  const [explanationValue, setExplanationValue] = useState('');
  const [savedUserQuestion, setSavedUserQuestion] = useState({
    text: '',
    answers: ['', '', '', ''],
    explanation: '',
    category: questionData.category,
    correctAnswer: 0,
    cost: questionData.price,
  });
  const platform = usePlatform();

  /*  useEffect(() => {
    setSavedUserQuestion(
      (prevState) => ({
        ...prevState,
        ...{ text: questionValue, explanation: explanationValue },
      }),
    );
  }, [questionValue, explanationValue]); */

  useEffect(() => {
    setSymbolCounter({
      question: maxSymbolsInInput.question - savedUserQuestion.text.length,
      answers: [
        maxSymbolsInInput.answers[0] - savedUserQuestion.answers[0].length,
        maxSymbolsInInput.answers[1] - savedUserQuestion.answers[1].length,
        maxSymbolsInInput.answers[2] - savedUserQuestion.answers[2].length,
        maxSymbolsInInput.answers[3] - savedUserQuestion.answers[3].length,
      ],
      explanation: maxSymbolsInInput.explanation - savedUserQuestion.explanation.length,
    });
  }, [savedUserQuestion]);

  useEffect(() => {
    dispatch({
      type: 'UPDATE_SHOP_QUESTION',
      payload: { question: savedUserQuestion },
    });
  }, [savedUserQuestion]);

  useEffect(() => {
    if (storedQuestion.category === questionData.category) {
      setSavedUserQuestion(storedQuestion);
    } else {
      dispatch({
        type: 'UPDATE_SHOP_QUESTION',
        payload: { question: savedUserQuestion },
      });
    }
  }, []);

  useEffect(() => {
    if (resultType) {
      if (resultType === 'accepted') {
        bridge.send('VKWebAppTapticNotificationOccurred', { type: 'success' });
      } else bridge.send('VKWebAppTapticNotificationOccurred', { type: 'error' });
    }
  }, [resultType]);

  useEffect(() => {
    if (activeSubviewPanel === 'ShopQuestionSubview-makeQuestion') {
      setResultType('');
    }
  }, [activeSubviewPanel]);

  useEffect(() => {
    if (resultType) {
      setCheckingProgress(false);
      if (resultType !== resultTypeOptions.alreadyExist) {
        setActiveSubviewPanel('ShopQuestionSubview-result');
      }
    }
  }, [resultType, resultTypeOptions.alreadyExist]);

  function sendQuestion() {
    let canSend = true;
    refQuestionText.current.value = refQuestionText.current.value.trim();
    refQuestionCorrectAnswer.current.value = refQuestionCorrectAnswer.current.value.trim();
    refQuestionIncorrectAnswer1.current.value = refQuestionIncorrectAnswer1.current.value.trim();
    refQuestionIncorrectAnswer2.current.value = refQuestionIncorrectAnswer2.current.value.trim();
    refQuestionIncorrectAnswer3.current.value = refQuestionIncorrectAnswer3.current.value.trim();
    refQuestionExplanation.current.value = refQuestionExplanation.current.value.trim();
    setEmptyInput({
      input0: false,
      input1: false,
      input2: false,
      input3: false,
      input4: false,
    });
    setSavedUserQuestion((prevState) => ({
      ...prevState,
      ...{
        text: refQuestionText.current.value,
        answers: [
          refQuestionCorrectAnswer.current.value,
          refQuestionIncorrectAnswer1.current.value,
          refQuestionIncorrectAnswer2.current.value,
          refQuestionIncorrectAnswer3.current.value,
        ],
        explanation: refQuestionExplanation.current.value,
      },
    }));

    if (!refQuestionText.current.value) {
      canSend = false;
      setEmptyInput((prevState) => ({ ...prevState, ...{ input0: true } }));
    }
    if (refQuestionText.current.value.length > maxSymbolsInInput.question) canSend = false;

    if (!refQuestionCorrectAnswer.current.value) {
      canSend = false;
      setEmptyInput((prevState) => ({ ...prevState, ...{ input1: true } }));
    }
    if (refQuestionCorrectAnswer.current.value.length > maxSymbolsInInput.answers[0]) {
      canSend = false;
    }

    if (!refQuestionIncorrectAnswer1.current.value) {
      canSend = false;
      setEmptyInput((prevState) => ({ ...prevState, ...{ input2: true } }));
    }
    if (refQuestionIncorrectAnswer1.current.value.length > maxSymbolsInInput.answers[1]) {
      canSend = false;
    }

    if (!refQuestionIncorrectAnswer2.current.value) {
      canSend = false;
      setEmptyInput((prevState) => ({ ...prevState, ...{ input3: true } }));
    }
    if (refQuestionIncorrectAnswer2.current.value.length > maxSymbolsInInput.answers[2]) {
      canSend = false;
    }

    if (!refQuestionIncorrectAnswer3.current.value) {
      canSend = false;
      setEmptyInput((prevState) => ({ ...prevState, ...{ input4: true } }));
    }
    if (refQuestionIncorrectAnswer3.current.value.length > maxSymbolsInInput.answers[3]) {
      canSend = false;
    }
    if (refQuestionExplanation.current.value.length > maxSymbolsInInput.explanation) {
      canSend = false;
    }
    if (new Set([
      refQuestionIncorrectAnswer1.current.value,
      refQuestionIncorrectAnswer2.current.value,
      refQuestionIncorrectAnswer3.current.value,
      refQuestionCorrectAnswer.current.value,
    ]).size !== 4) {
      canSend = false;
      if (refQuestionCorrectAnswer.current.value === refQuestionIncorrectAnswer1.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input1: true, input2: true } }));
      }
      if (refQuestionCorrectAnswer.current.value === refQuestionIncorrectAnswer2.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input1: true, input3: true } }));
      }
      if (refQuestionCorrectAnswer.current.value === refQuestionIncorrectAnswer3.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input1: true, input4: true } }));
      }
      if (refQuestionIncorrectAnswer1.current.value === refQuestionIncorrectAnswer2.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input2: true, input3: true } }));
      }
      if (refQuestionIncorrectAnswer1.current.value === refQuestionIncorrectAnswer3.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input2: true, input4: true } }));
      }
      if (refQuestionIncorrectAnswer2.current.value === refQuestionIncorrectAnswer3.current.value) {
        setEmptyInput((prevState) => ({ ...prevState, ...{ input3: true, input4: true } }));
      }
    }

    if (!canSend) return;
    setCheckingProgress(true);
    // Отсылаем вопрос на сервер

    const urlParams = new URLSearchParams(window.location.search);

    if (userToken) {
      const data = {
        text: savedUserQuestion.text,
        answers: savedUserQuestion.answers,
        category: questionData.category,
      };
      if (savedUserQuestion.explanation) data.explanation = savedUserQuestion.explanation;
      axios.post(`${globalVariables.serverURL}/api/buy/question`, data, {
        params: {
          id: urlParams.get('vk_user_id'),
        },
        headers: {
          'X-Access-Token': userToken,
        },
      })
        .then(() => {
          setResultType(resultTypeOptions.accepted);
          dispatch({
            type: 'UPDATE_USER_INFO',
            payload: {
              coins: {
                overall: userBalance - questionData.price,
              },
            },
          });
          dispatch({
            type: 'UPDATE_USER_QUESTIONS',
            payload: {
              unapprovedQuestions: (unapprovedQuestions + 1),
            },
          });
          setSavedUserQuestion({
            text: '',
            answers: [
              '',
              '',
              '',
              '',
            ],
            category: questionData.category,
            correctAnswer: 0,
            explanation: '',
            cost: questionData.price,
          });
          setSymbolCounter({
            question: maxSymbolsInInput.question,
            answers: [
              maxSymbolsInInput.answers[0],
              maxSymbolsInInput.answers[1],
              maxSymbolsInInput.answers[2],
              maxSymbolsInInput.answers[3],
            ],
            explanation: maxSymbolsInInput.explanation,
          });
        })
        .catch((err) => {
          setCheckingProgress(false);

          console.info('Shop, /api/buy/question', err);
          if (err.response) {
            if (err.response.status === 403) {
              // Не хватает монет
            } else if (err.response.status === 500) {
              // Уже зарегистрирован
              setResultType('alreadyExist');
            } else {
              setResultType(resultTypeOptions.rejected);
            }
          } else {
            setShowSnackbar(true);
          }
        });
    } else {
      // Перемещение на стартовый экран
    }
  }

  return (
    <Panel
      id={id}
      className="ShopQuestion"
    >
      <View
        activePanel={activeSubviewPanel}
        popout={(checkingProgress && <ScreenSpinner />)}
      >
        <Panel
          id="ShopQuestionSubview-makeQuestion"
          className="ShopQuestion__Subview"
        >
          <PanelHeader
            left={(
              <PanelHeaderBack
                label={(platform === IOS && 'Назад')}
                onClick={() => setActivePanel('Shop')}
              />
            )}
          >
            {globalVariables.translateEnToRu(questionData.category)}
          </PanelHeader>
          {showSnackbar && (
            <Snackbar
              duration={2000}
              onClose={() => { setShowSnackbar(false); }}
              before={(
                <Icon28ErrorOutline height={24} width={24} style={{ color: 'var(--destructive)' }} />
              )}
            >
              Не удалось связаться с сервером
            </Snackbar>
          )}
          <Group
            description="Ваш вопрос будет проверен администрацией Мозгополии. Обычно проверка занимает не более одного дня."
          >
            <FormLayout className="ShopQuestion--form">
              <Textarea
                id="shopquestion-question"
                top="Вопрос"
                placeholder={(storedQuestion.text.length === 0 ? `Например, «${inputPlaceholders[questionData.category].question}»` : '')}
                getRef={refQuestionText}
                status={((resultType === resultTypeOptions.alreadyExist) || emptyInput.input0 || symbolCounter.question < 0) && 'error'}
                bottom={(resultType === resultTypeOptions.alreadyExist)
                  ? 'К сожалению, этот вопрос уже зарегистрирован кем-то другим.'
                  : (symbolCounter.question >= 0 ? `Осталось символов: ${symbolCounter.question}` : `Вопрос не может содержать более ${maxSymbolsInInput.question} символов`)}
                onChange={(e) => {
                  setQuestionValue(e.target.value);
                  setSavedUserQuestion({ ...savedUserQuestion, ...{ text: e.target.value } });
                  if (resultType === resultTypeOptions.alreadyExist) {
                    setResultType('');
                  }
                  setEmptyInput((prevState) => ({ ...prevState, ...{ input0: false } }));
                }}
                type="text"
                defaultValue={((storedQuestion.category === questionData.category) && (storedQuestion.text.length > 0) ? storedQuestion.text : '')}
              />

              <FormLayoutGroup
                top="Правильный ответ"
                className="ShopQuestion--correctAnswer"
                status={((symbolCounter.answers[0] < 0) || emptyInput.input1) && 'error'}
                bottom={(symbolCounter.answers[0] >= 0 ? `Осталось символов: ${symbolCounter.answers[0]}` : `Ответ не может содержать более ${maxSymbolsInInput.answers[0]} символов`)}
              >
                <Input
                  type="text"
                  placeholder={(symbolCounter.question === maxSymbolsInInput.question ? inputPlaceholders[questionData.category].answers[0] : '')}
                  getRef={refQuestionCorrectAnswer}
                  value={savedUserQuestion.answers[0]}
                  status={((symbolCounter.answers[0] < 0) || emptyInput.input1) && 'error'}
                  onChange={(e) => {
                    const answersTemp = savedUserQuestion.answers;
                    answersTemp[0] = e.target.value;
                    setSavedUserQuestion({ ...savedUserQuestion, ...{ answers: answersTemp } });
                    setEmptyInput((prevState) => ({ ...prevState, ...{ input1: false } }));
                  }}
                />
              </FormLayoutGroup>

              <Input
                top={(
                  <div className="ShopQuestion--incorrectAnswers_input-top">
                    Неправильные ответы
                  </div>
                )}
                type="text"
                placeholder={(symbolCounter.question === maxSymbolsInInput.question ? inputPlaceholders[questionData.category].answers[1] : '')}
                className="ShopQuestion--incorrectAnswers_input"
                status={((symbolCounter.answers[1] < 0) || emptyInput.input2) && 'error'}
                bottom={(symbolCounter.answers[1] < 0 && `Ответ не может содержать более ${maxSymbolsInInput.answers[1]} символов`)}

                getRef={refQuestionIncorrectAnswer1}
                value={savedUserQuestion.answers[1]}
                onChange={(e) => {
                  const answersTemp = savedUserQuestion.answers;
                  answersTemp[1] = e.target.value;
                  setSavedUserQuestion({ ...savedUserQuestion, ...{ answers: answersTemp } });
                  setEmptyInput((prevState) => ({ ...prevState, ...{ input2: false } }));
                }}
              />
              <Input
                type="text"
                placeholder={(symbolCounter.question === maxSymbolsInInput.question ? inputPlaceholders[questionData.category].answers[2] : '')}
                className="ShopQuestion--incorrectAnswers_input"
                getRef={refQuestionIncorrectAnswer2}
                value={savedUserQuestion.answers[2]}
                status={((symbolCounter.answers[2] < 0) || emptyInput.input3) && 'error'}
                bottom={(symbolCounter.answers[2] < 0 && `Ответ не может содержать более ${maxSymbolsInInput.answers[2]} символов`)}
                onChange={(e) => {
                  const answersTemp = savedUserQuestion.answers;
                  answersTemp[2] = e.target.value;
                  setSavedUserQuestion({ ...savedUserQuestion, ...{ answers: answersTemp } });
                  setEmptyInput((prevState) => ({ ...prevState, ...{ input3: false } }));
                }}
              />
              <Input
                type="text"
                placeholder={(symbolCounter.question === maxSymbolsInInput.question ? inputPlaceholders[questionData.category].answers[3] : '')}
                className="ShopQuestion--incorrectAnswers_input"
                getRef={refQuestionIncorrectAnswer3}
                value={savedUserQuestion.answers[3]}
                status={((symbolCounter.answers[3] < 0) || emptyInput.input4) && 'error'}
                bottom={(symbolCounter.answers[3] < 0 && `Ответ не может содержать более ${maxSymbolsInInput.answers[3]} символов`)}

                onChange={(e) => {
                  const answersTemp = savedUserQuestion.answers;
                  answersTemp[3] = e.target.value;
                  setSavedUserQuestion({ ...savedUserQuestion, ...{ answers: answersTemp } });
                  setEmptyInput((prevState) => ({ ...prevState, ...{ input4: false } }));
                }}
              />

              <Textarea
                top="Пояснение (+5 GP)"
                placeholder={(storedQuestion.explanation.length === 0 ? 'Введите текст пояснения для Вашего вопроса' : '')}
                id="shopquestion-explanation"
                status={(symbolCounter.explanation < 0) && 'error'}
                getRef={refQuestionExplanation}
                bottom={(symbolCounter.explanation >= 0 ? `Осталось символов: ${symbolCounter.explanation}` : `Пояснение не может содержать более ${maxSymbolsInInput.explanation} символов`)}
                onChange={(e) => {
                  setExplanationValue(e.target.value);
                  setSavedUserQuestion({ ...savedUserQuestion, ...{ explanation: e.target.value } });
                }}
                defaultValue={((storedQuestion.category === questionData.category) && (storedQuestion.explanation.length > 0) ? storedQuestion.explanation : '')}
              />
            </FormLayout>

            <Div>
              <Button
                mode="commerce"
                size="xl"
                onClick={() => {
                  sendQuestion();
                }}
              >
                {`Купить за ${questionData.price} монет`}
              </Button>
            </Div>
          </Group>
        </Panel>


        {/*= ================== */}

        <Panel id="ShopQuestionSubview-result">
          <PanelHeader
            left={(
              <PanelHeaderBack
                label={(platform === IOS && 'Назад')}
                onClick={() => setActiveSubviewPanel('ShopQuestionSubview-makeQuestion')}
              />
            )}
          >
            {globalVariables.translateEnToRu(questionData.category)}
          </PanelHeader>
          {showSnackbar1.state && (
            <Snackbar
              duration={2000}
              onClose={() => setShowSnackbar1({ state: false, msg: '' })}
              before={(
                <Icon28ErrorOutline height={24} width={24} style={{ color: 'var(--destructive)' }} />
              )}
            >
              {showSnackbar1.msg}
            </Snackbar>
          )}

          <Group>
            {(resultType === resultTypeOptions.accepted) && (
              <Placeholder
                className="ShopQuestion--placeholder"
                icon={(
                  <Icon56CheckCircleOutline
                    className="ShopQuestion--placeholder__icon-accepted"
                    height={64}
                    width={64}
                  />
                )}
                action={(
                  <div>
                    <Button
                      className="ShopQuestion--placeholder__button"
                      mode="secondary"
                      onClick={() => {
                        setActivePanel('Shop');
                      }}
                    >
                      В магазин
                    </Button>
                    <Button
                      className="ShopQuestion--placeholder__button"
                      mode="primary"
                      onClick={() => {
                        if (userBalance >= questionData.price) {
                          if (unapprovedQuestions < globalVariables.maxUnapprovedQuestionCount) {
                            setActiveSubviewPanel('ShopQuestionSubview-makeQuestion');
                            setResultType('');
                          } else {
                            setShowSnackbar1({ state: true, msg: 'У Вас слишком много вопросов на рассмотрении.' });
                          }
                        } else {
                          setShowSnackbar1({ state: true, msg: 'Вам не хватает монет для покупки еще одного вопроса.' });
                        }
                      }}
                    >
                      Купить еще
                    </Button>
                  </div>
                )}
              >
                Ваш вопрос успешно зарегистрирован и проходит модерацию.
              </Placeholder>
            )}

            {(resultType === resultTypeOptions.rejected) && (
              <Placeholder
                className="ShopQuestion--placeholder"
                icon={(
                  <Icon28CancelCircleOutline
                    className="ShopQuestion--placeholder__icon-rejected"
                    height={64}
                    width={64}
                  />
                )}
                action={(
                  <div>
                    <Button
                      className="ShopQuestion--placeholder__button"
                      mode="secondary"
                      onClick={() => {
                        setResultType('');
                        // sendQuestion(savedUserQuestion);
                        setActiveSubviewPanel('ShopQuestionSubview-makeQuestion');
                      }}
                    >
                      Повторить
                    </Button>
                  </div>
                )}
              >
                Не удалось зарегистрировать вопрос. Произошла непредвиденная ошибка.
              </Placeholder>
            )}
          </Group>
        </Panel>
      </View>

    </Panel>
  );
};

ShopQuestion.propTypes = {
  id: PropTypes.string.isRequired,
  questionData: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  setActivePanel: PropTypes.func.isRequired,
};
ShopQuestion.defaultProps = {};
export default ShopQuestion;
