import React, {
  useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import '../work.css';
import { Gallery, Panel, PanelHeader } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import bridge from '@vkontakte/vk-bridge';
import SimpleCrypto from 'simple-crypto-js';
import WorkGalleryPanel from './WorkGalleryPanel';
import globalVariables from '../../../GlobalVariables';

const WorkGallery = (props) => {
  const {
    id, setActivePanel, nextView, setPopoutIsActive,
  } = props;
  const timeToAnswer = 20;
  const dispatch = useDispatch();
  const modalStatus = useSelector((state) => state.workViewModal);
  const userToken = useSelector((state) => state.userToken.token);
  const reportQuestionID = useSelector((state) => state.quiz.reportQuestionID);

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [lastQuestionInStorage, setLastQuestionInStorage] = useState({
    id: '',
    selectedAnswerNumber: -1,
  });
  const [result, setResult] = useState([]);
  const cancelSource = React.useRef(null);

  const controlHardwareBackButton = useCallback(() => {
    dispatch({
      type: 'UPDATE_WORK-VIEW-MODAL',
      payload: {
        modalIsActive: false,
      },
    });
    if (reportQuestionID.length === 0) {
      nextView(globalVariables.view.main);
    } else {
      dispatch({
        type: 'UPDATE_QUIZ_RESULT',
        payload: {
          reportQuestionID: '',
        },
      });
      if (window.history.state) {
        window.history.replaceState({ page: 'WorkViewGallery' }, 'WorkViewGallery', `${window.location.search}`);
      } else {
        window.history.pushState({ page: 'WorkViewGallery' }, 'WorkViewGallery', `${window.location.search}`);
      }
    }
  }, [reportQuestionID]);

  useEffect(() => {
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, [reportQuestionID]);

  useEffect(() => {
    if (window.history.state) {
      window.history.replaceState({ page: 'WorkViewGallery' }, 'WorkViewGallery', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'WorkViewGallery' }, 'WorkViewGallery', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);
  const disableSwipe = useCallback((event) => {
    event.stopPropagation();
  }, []);
  function getIncorrectAnswerNumber(correctAnswerNumber) {
    const rndInt = Math.floor(Math.random() * 4);
    if (rndInt === correctAnswerNumber) return getIncorrectAnswerNumber(correctAnswerNumber);
    return rndInt;
  }

  function shuffle(array, prevIndex) {
    const copy = [];
    let n = array.length;
    let i;
    const correctAnswer = array[prevIndex];

    // While there remain elements to shuffle…
    while (n) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * array.length);

      // If not already shuffled, move it to the new array.
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n -= 1;
      }
    }
    if (prevIndex !== -1) {
      const correctIndex = copy.indexOf(correctAnswer);
      if ((prevIndex === correctIndex) && (Math.random() >= 0.3)) {
        return shuffle(copy, prevIndex);
      }
      return copy;
    }
    return copy;
  }

  function shuffleQuestions(questionsArray) {
    return new Promise((resolve) => {
      const shuffledArray = questionsArray.sort(() => Math.random() - 0.5);
      if (questionsArray[0].requestedBy !== 0) resolve(shuffleQuestions(questionsArray));
      else resolve(shuffledArray);
    });
  }

  useEffect(() => {
    if (!modalStatus.modalIsActive && modalStatus.start && lastQuestionInStorage.selectedAnswerNumber !== -1) {
      if (result.length >= questions.length - 1) {
        setActivePanel('QuizResultPanel');
      } else if (modalStatus.start && modalStatus.isStartModal) {
        bridge.send('VKWebAppStorageGet', { keys: [globalVariables.quizResult] })
          .then(((data) => {
            let storedQuestions;

            try {
              storedQuestions = JSON.parse(data.keys[0].value);
            } catch (e) {
              console.info('WorkGallery, get questions', e);
              storedQuestions = [];
            }
            if (!storedQuestions || !Array.isArray(storedQuestions)) storedQuestions = [];
            const rndInt = getIncorrectAnswerNumber(questions[questionIndex + 1].correctAnswerNumber);

            storedQuestions.push({
              correctAnswerNumber: questions[questionIndex + 1].correctAnswerNumber,
              questionId: questions[questionIndex + 1]._id,
              selectedAnswerNumber: rndInt,
              selectedAnswer: questions[questionIndex + 1].answers[rndInt],
            });
            bridge.send('VKWebAppStorageSet', {
              key: globalVariables.quizResult,
              value: JSON.stringify(storedQuestions),
            });

            setQuestionIndex(questionIndex + 1);
          }))
          .catch((bridgeError) => {
            console.info('bridgeError_WorkGallery', bridgeError);
            setTimeout(() => {
              nextView(globalVariables.view.start);
            }, 1000);
          });
      }
    }
  }, [modalStatus]);

  const bridgeOnRestore = useCallback((e) => {
    switch (e.detail.type) {
      case 'VKWebAppViewHide': {
        cancelSource.current.cancel('Hide view');
        break;
      }
      case 'VKWebAppViewRestore': {
        if (questions.length === 0) {
          cancelSource.current.cancel('Hide view');
          setPopoutIsActive(false);
          nextView(globalVariables.view.main);
        }
        break;
      }
      default:
        break;
    }
  }, []);

  // Первое получение всех вопросов
  useEffect(() => {
    cancelSource.current = axios.CancelToken.source();
    const urlParams = new URLSearchParams(window.location.search);
    bridge.subscribe(bridgeOnRestore);
    if (userToken) {
      bridge.send('VKWebAppStorageGet', {
        keys: [globalVariables.quizQuestions, globalVariables.quizResult, 'secret'],
      })
        .then((storedQuiz) => {
          // console.info('questions', storedQuiz.keys[0]);
          // console.info('questions', storedQuiz.keys[0]);
          const simpleCrypto = new SimpleCrypto(storedQuiz.keys[2].value);
          let storedQuestions = [];
          let storedAnswers = [];
          if (storedQuiz.keys[0].value) {
            if (JSON.parse(storedQuiz.keys[0].value).length > 0) {
              storedQuestions = JSON.parse(storedQuiz.keys[0].value);
              if (storedQuiz.keys[1].value) storedAnswers = JSON.parse(storedQuiz.keys[1].value);
            }
          }
          // console.info('storedQuestions', storedQuestions)
          // console.info('storedAnswers', storedAnswers)
          axios.get(`${globalVariables.serverURL}/api/exam`, {
            cancelToken: cancelSource.current.token,
            timeout: 10000,
            timeoutErrorMessage: 'Timeout',
            params: {
              id: urlParams.get('vk_user_id'),
            },
            headers: {
              'X-Access-Token': userToken,
            },
          })
            .then((data) => {
              // Сервер нашёл токен в БД. Рендерим информацию
              // nextView(globalVariables.view.main)
              let resultFromServer = data.data.attachment.map((item) => {
                const decryptData = simpleCrypto.decrypt(item.data);
                const correctAnswerNumber = item.answers.indexOf(decryptData.answer);
                return ({
                  question: decryptData.question,
                  answers: item.answers,
                  correctAnswerNumber,
                  explanation: decryptData.explanation || '',
                  theme: globalVariables.translateEnToRu(item.category),
                  requestedBy: item.requestedBy,
                  _id: item._id,
                });
              });

              if (storedQuestions.length > 0) {
                const resultFromServerIDs = resultFromServer.map((item) => item._id);
                if (resultFromServerIDs.filter((item) => !storedQuestions.includes(item)).length > 0) {
                  bridge.send('VKWebAppStorageSet', {
                    key: globalVariables.quizResult,
                    value: '[]',
                  });
                  bridge.send('VKWebAppStorageSet', {
                    key: globalVariables.quizQuestions,
                    value: '[]',
                  });
                  storedQuestions = [];
                  storedAnswers = [];
                  dispatch({
                    type: 'CLEAR_QUIZ_RESULT',
                  });
                } else {
                  resultFromServer = resultFromServer.sort((a, b) => storedQuestions.indexOf(a._id) - storedQuestions.indexOf(b._id));
                  for (let i = 0; i < resultFromServer.length; i += 1) {
                    const correctAnswer = resultFromServer[i].answers[resultFromServer[i].correctAnswerNumber];
                    resultFromServer[i].answers = shuffle(
                      resultFromServer[i].answers, (i > 0
                        ? resultFromServer[i - 1].correctAnswerNumber
                        : -1),
                    );
                    resultFromServer[i].correctAnswerNumber = resultFromServer[i].answers.indexOf(correctAnswer);
                  }
                  if (storedAnswers.length > 0) {
                    setResult(storedAnswers);
                    setQuestionIndex(storedAnswers.length);
                    const selectedAnswerNumber = (storedAnswers.slice(-1)[0].correctAnswerNumber === storedAnswers.slice(-1)[0].selectedAnswerNumber ? resultFromServer[storedAnswers.length].correctAnswerNumber : getIncorrectAnswerNumber(resultFromServer[storedAnswers.length].correctAnswerNumber));
                    const lastQuestionInfo = {
                      id: storedAnswers[storedAnswers.length - 1].questionId,
                      selectedAnswerNumber,
                    };
                    setLastQuestionInStorage(lastQuestionInfo);
                  }
                }
                setPopoutIsActive(false);
                setQuestions(resultFromServer);
                // console.info('resultFromServer', resultFromServer);
                dispatch({
                  type: 'UPDATE_QUIZ_RESULT',
                  payload: {
                    questions: resultFromServer,
                  },
                });
              }
              if (storedQuestions.length === 0) {
                shuffleQuestions(resultFromServer)
                  .then((res) => {
                    resultFromServer = res;
                    for (let i = 0; i < resultFromServer.length; i += 1) {
                      const correctAnswer = resultFromServer[i].answers[resultFromServer[i].correctAnswerNumber];
                      resultFromServer[i].answers = shuffle(
                        resultFromServer[i].answers, (i > 0
                          ? resultFromServer[i - 1].correctAnswerNumber
                          : -1),
                      );
                      resultFromServer[i].correctAnswerNumber = resultFromServer[i].answers.indexOf(correctAnswer);
                    }
                    const storedQuestionsID = resultFromServer.map((item) => item._id);
                    bridge.send('VKWebAppStorageSet', {
                      key: globalVariables.quizQuestions,
                      value: JSON.stringify(storedQuestionsID),
                    });
                    setPopoutIsActive(false);
                    setQuestions(resultFromServer);
                    // console.info('resultFromServer', resultFromServer);
                    dispatch({
                      type: 'UPDATE_QUIZ_RESULT',
                      payload: {
                        questions: resultFromServer,
                      },
                    });
                  });
              }
            })
            .catch((err) => {
              console.info('Work, Get /api/exam', err);
              console.info(err);
              // Сервер не нашёл токен в БД.
              // Перемещение на стартовый экран
              // nextView(globalVariables.view.main);
              setTimeout(() => {
                nextView(globalVariables.view.connectionLost);
              }, 1000);
            });
        })
        .catch((bridgeError) => {
          console.info('bridgeError_WorkGallery', bridgeError);
          // nextView(globalVariables.view.start);
          setTimeout(() => {
            nextView(globalVariables.view.connectionLost);
          }, 1000);
        });
    } else {
      // Перемещение на стартовый экран
      nextView(globalVariables.view.main);
    }

    // Выключаем возможность свайпать галерею
    window.addEventListener('touchmove', disableSwipe, { passive: false, capture: true });
    return () => {
      cancelSource.current.cancel();
      window.removeEventListener('touchmove', disableSwipe, { passive: false, capture: true });
      bridge.unsubscribe(bridgeOnRestore);
      setPopoutIsActive(false);
    };
  }, []);

  // Отправка результата квиза в Redux и VK storage
  useEffect(() => {
    if (result.length > 0) {
      dispatch({
        type: 'UPDATE_QUIZ_RESULT',
        payload: {
          quizResult: result,
        },
      });
      const answersToStore = result.map((item) => ({
        questionId: item.questionId,
        selectedAnswerNumber: item.selectedAnswerNumber,
        correctAnswerNumber: item.correctAnswerNumber,
        selectedAnswer: (item.selectedAnswer ? item.selectedAnswer : item.selectedText),
      }));
      bridge.send('VKWebAppStorageSet', {
        key: globalVariables.quizResult,
        value: JSON.stringify(answersToStore),
      })
        .catch((bridgeError) => {
          console.info('bridgeError_WorkGallery', bridgeError);
          // nextView(globalVariables.view.start);
          nextView(globalVariables.view.connectionLost);
        });
    }
  }, [result]);

  useEffect(() => {
    if (questions.length > 0) {
      dispatch({
        type: 'UPDATE_WORK-VIEW-MODAL',
        payload: {
          questionsLength: questions.length,
          modalIsActive: true,
          start: false,
        },
      });
    }
  }, [questions]);

  // Нажатие на стрелку, переход к следующему вопросу
  function goToNextQuestion() {
    if ((result.length === questions.length - 1) && modalStatus.start) {
      setActivePanel('QuizResultPanel');
    } else {
      bridge.send('VKWebAppStorageGet', { keys: [globalVariables.quizResult] })
        .then(((data) => {
          let storedQuestions;
          if (data.keys[0].value) storedQuestions = JSON.parse(data.keys[0].value);
          else storedQuestions = [];
          const rndInt = getIncorrectAnswerNumber(questions[questionIndex + 1].correctAnswerNumber);
          storedQuestions.push({
            questionId: questions[questionIndex + 1]._id,
            correctAnswerNumber: questions[questionIndex + 1].correctAnswerNumber,
            selectedAnswerNumber: rndInt,
            selectedAnswer: questions[questionIndex + 1].answers[rndInt],
          });
          bridge.send('VKWebAppStorageSet', {
            key: globalVariables.quizResult,
            value: JSON.stringify(storedQuestions),
          });

          setQuestionIndex(questionIndex + 1);
        }))
        .catch((bridgeError) => {
          console.info('bridgeError_WorkGallery', bridgeError);
          nextView(globalVariables.view.connectionLost);
          // nextView(globalVariables.view.start);
        });
    }
  }

  return (
    <Panel id={id} className="Work" centered={!questions.length}>
      <PanelHeader
        style={{ zIndex: 1 }}
      >
        Мозговой отчёт
      </PanelHeader>

      <Gallery
        slideWidth="100%"
        slideIndex={questionIndex}
        align="center"
        onChange={(i) => setQuestionIndex(i)}
      >
        {questions.length > 0 && questions.map((item, index) => (
          <WorkGalleryPanel
            key={`WorkGalleryPanel_${index}`}
            id={`WorkGalleryPanel-${index}`}
            questionIndex={index}
            totalQuestions={questions.length}
            data={{
              question: item.question,
              answers: item.answers,
              correctAnswer: item.correctAnswer,
              correctAnswerNumber: item.correctAnswerNumber,
              explanation: item.explanation,
              theme: item.theme,
              requestedBy: item.requestedBy,
              _id: item._id,
            }}
            setResult={setResult}
            start={(questionIndex === index) && modalStatus.start && !modalStatus.modalIsActive}
            goToNextQuestion={goToNextQuestion}
            timeToAnswer={timeToAnswer}
            lastQuestionInStorage={lastQuestionInStorage}
          />
        ))}
      </Gallery>

    </Panel>
  );
};

WorkGallery.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  nextView: PropTypes.func.isRequired,
  setPopoutIsActive: PropTypes.func.isRequired,
};
WorkGallery.defaultProps = {};
export default WorkGallery;
