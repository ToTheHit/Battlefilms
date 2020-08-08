import React, {
  useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import './homework.css';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import Icon28CheckSquareOutline from '@vkontakte/icons/dist/28/check_square_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import {
  Button, Card, classNames, Div, Panel, PanelHeader, Placeholder, Subhead, Text, Title,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import axios from 'axios';
import globalVariables from '../../../GlobalVariables';

const Homework = (props) => {
  const {
    id, nextView, setPopoutHomeworkView, setActiveStory,
  } = props;
  const scrollListener = useSelector((state) => state.scrollTo);
  const userToken = useSelector((state) => state.userToken.token);

  const [tasks, setTasks] = useState([]);
  const [renderedTasks, setRenderedTasks] = useState([]);
  const [showContent, setShowContent] = useState(false);

  const controlHardwareBackButton = useCallback(() => {
    setActiveStory(globalVariables.commonView.roots.main);
  }, []);
  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'Homework' }, 'Homework', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'Homework' }, 'Homework', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  useEffect(() => {
    if (renderedTasks.length > 0) {
      setShowContent(true);
      setPopoutHomeworkView(false);
      window.scroll({ top: document.body.scrollHeight, left: 0 });
    }
  }, [renderedTasks.length]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (!userToken) {
      // Перемещение на стартовый экран
      console.info('Main, Get /api/, Token not found');
      setTimeout(() => {
        nextView(globalVariables.view.start);
      }, 1500);
    } else {
      axios.get(`${globalVariables.serverURL}/api/userWrongQuestions`, {
        params: {
          id: urlParams.get('vk_user_id'),
        },
        headers: {
          'X-Access-Token': userToken,
        },
      })
        .then((data) => {
          if (data.data.attachment.length === 0) {
            setPopoutHomeworkView(false);
            setShowContent(true);
          }
          setTasks(data.data.attachment);
        })
        .catch((error) => {
          console.info('Homework error', error);
          nextView(globalVariables.view.connectionLost);
        });
    }
    return () => {
      setPopoutHomeworkView(true);
    };
  }, []);

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.homework) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollListener]);

  function confirmAllTasks() {
    const urlParams = new URLSearchParams(window.location.search);
    setPopoutHomeworkView(true);
    if (!userToken) {
      // Перемещение на стартовый экран
      console.info('Main, Get /api/, Token not found');
      setTimeout(() => {
        nextView(globalVariables.view.start);
      }, 1500);
    } else {
      axios.delete(`${globalVariables.serverURL}/api/clearAllWrongQuestions`, {
        params: {
          id: urlParams.get('vk_user_id'),
        },
        headers: {
          'X-Access-Token': userToken,
        },
      })
        .then(() => {
          setPopoutHomeworkView(false);
          setTasks([]);
        })
        .catch((error) => {
          console.info('Erorr: /api/wrongQuestion', error);
          nextView(globalVariables.view.connectionLost);
        });
    }
  }
  function confirmTask(questionID) {
    const urlParams = new URLSearchParams(window.location.search);
    if (!userToken) {
      // Перемещение на стартовый экран
      console.info('Main, Get /api/, Token not found');
      setTimeout(() => {
        nextView(globalVariables.view.start);
      }, 1500);
    } else {
      axios.delete(`${globalVariables.serverURL}/api/wrongQuestion`, {
        params: {
          id: urlParams.get('vk_user_id'),
        },
        headers: {
          'X-Access-Token': userToken,
        },
        data: {
          questionID,
        },
      })
        .catch((error) => {
          console.info('Erorr: /api/wrongQuestion', error);
          nextView(globalVariables.view.connectionLost);
        });
    }
  }

  useEffect(() => {
    const rendered = tasks.map((task, index) => (
      <Div
        className="Homework__card"
        key={`HomeworkCard__${task._id}`}
        style={{ paddingTop: '10px', paddingBottom: 0 }}
      >
        <Card>
          <Div>
            <Subhead
              weight="regular"
              className={classNames('Homework__preview', { 'Homework__preview--hidden': index === (tasks.length - 1) })}
            >
              {task.text}
            </Subhead>
            <div className={classNames('Homework__card--content', { 'Homework__card--content-hidden': index !== (tasks.length - 1) })}>
              <Title level="2" weight="semibold" className="Homework__question">
                {task.text}
              </Title>
              <Text weight="regular" className="Homework__answer">
                {task.answers[0]}
              </Text>
              <div style={{ display: (task.explanation ? 'block' : 'none') }}>
                <Subhead weight="regular" className="Homework__explanation">
                  {task.explanation}
                </Subhead>
              </div>

              <Button
                className="Homework__button"
                mode="secondary"
                before={<Icon28CheckSquareOutline height={28} width={28} />}
                size="xl"
                onClick={() => {
                  confirmTask(task._id);
                  setTasks(tasks.slice(0, tasks.length - 1));
                }}
              >
                Выучено
              </Button>
            </div>
          </Div>

        </Card>
      </Div>
    ));
    setRenderedTasks(rendered);
  }, [tasks.length]);

  return (
    <Panel className="Homework" id={id}>
      <PanelHeader onClick={() => setShowContent(false)}>
        Домашка
      </PanelHeader>
      <div style={{ opacity: ((showContent) ? 1 : 0) }}>
        {(renderedTasks.length > 0
          ? (
            <div className="Homework__list">
              <Button
                mode="tertiary"
                size="xl"
                before={<Icon28DeleteOutline width={24} height={24} />}
                style={{ marginTop: '10px' }}
                onClick={() => confirmAllTasks()}
              >
                Очистить список
              </Button>
              {renderedTasks}
            </div>
          )
          : (
            <Placeholder
              stretched
              icon={(
                <Icon56InboxOutline
                  width={56}
                  height={56}
                  style={{ color: 'var(--button_primary_background)' }}
                />
            )}
            >
              В этом разделе записываются вопросы, в&nbsp;которых Вы допустили ошибки.
            </Placeholder>
          )
        )}
      </div>
    </Panel>
  );
};

Homework.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
  setPopoutHomeworkView: PropTypes.func.isRequired,
  setActiveStory: PropTypes.func.isRequired,
};
Homework.defaultProps = {};
export default Homework;
