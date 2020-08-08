import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './questionDetails.css';
import {
  Card,
  classNames,
  Div,
  Group,
  Header,
  HorizontalScroll,
  InfoRow,
  IOS,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Separator,
  Tabs,
  TabsItem,
  Title,
  usePlatform,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import Icon56RecentOutline from '@vkontakte/icons/dist/56/recent_outline';
import AnswerButton from '../../CustomComponents/AnswerButton/AnswerButton';
import globalVariables from '../../../GlobalVariables';

const QuestionDetails = (props) => {
  const { id, setActivePanel, selectedQuestion } = props;
  const platform = usePlatform();
  const [activeTab, setActiveTab] = useState('Today');
  const [isFirstRender, setIsFirstRender] = useState(true);

  const scheme = useSelector((state) => state.schemeChanger.scheme);
  const selectedCategory = useSelector((state) => state.userQuestions.category);
  const scrollListener = useSelector((state) => state.scrollTo);

  useEffect(() => {
    if (isFirstRender) setIsFirstRender(false);
    else if (scrollListener.scrollableElement === globalVariables.commonView.roots.main) {
      if (selectedCategory === 'All') {
        setActivePanel(globalVariables.commonView.panels.main);
      } else {
        setActivePanel(globalVariables.commonView.panels.questionsList);
      }
    }
  }, [scrollListener]);

  const controlHardwareBackButton = useCallback(() => {
    if (selectedCategory === 'All') {
      setActivePanel(globalVariables.commonView.panels.main);
    } else {
      setActivePanel(globalVariables.commonView.panels.questionsList);
    }
  }, []);

  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'QuestionDetails' }, 'QuestionDetails', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'QuestionDetails' }, 'QuestionDetails', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  return (
    <Panel id={id} className="QuestionDetails">
      <PanelHeader
        left={(
          <PanelHeaderBack
            label={(platform === IOS && 'Назад')}
            onClick={() => {
              if (selectedCategory === 'All') {
                setActivePanel(globalVariables.commonView.panels.main);
              } else {
                setActivePanel(globalVariables.commonView.panels.questionsList);
              }
            }}
          />
        )}
      >
        Вопрос
      </PanelHeader>
      <Group>
        <Div>
          <Title level="1" weight="bold">
            {selectedQuestion.text}
          </Title>

          <div className="QuestionDetails__answersGroup">
            <AnswerButton
              className="QuestionDetails__answer"
              label={selectedQuestion.answers[0]}
              answerNumber={0}
              type="correct"
            />
            <AnswerButton
              className="QuestionDetails__answer"
              label={selectedQuestion.answers[1]}
              answerNumber={1}
              type=""
            />
            <AnswerButton
              className="QuestionDetails__answer"
              label={selectedQuestion.answers[2]}
              answerNumber={2}
              type=""
            />
            <AnswerButton
              className="QuestionDetails__answer"
              label={selectedQuestion.answers[3]}
              answerNumber={3}
              type=""
            />
          </div>
          <div
            className="QuestionDetails__explanation"
            style={{display: (selectedQuestion.explanation ? 'block' : 'none')}}
          >
            <Header
              style={{ marginTop: '15px', padding: 0 }}
            >
              Пояснение
            </Header>
            <div>
              {selectedQuestion.explanation}
            </div>
          </div>

          <div className="QuestionDetails__generalInfo">
            <Header
              style={{ marginTop: '15px', padding: 0 }}
            >
              Общая информация
            </Header>

            <Card
              mode={scheme === 'space_gray' ? 'tint' : 'outline'}
              className={classNames('QuestionDetails__generalInfo--card', { 'QuestionDetails__generalInfo--card-dark': scheme === 'space_gray' })}
            >
              <Div>
                <InfoRow header="Категория вопроса">
                  {globalVariables.translateEnToRu(selectedQuestion.category)}
                </InfoRow>
                <Separator style={{ margin: '13px 0 11px 0' }} wide />
                <InfoRow header="GP за ошибку">
                  {selectedQuestion.bpForError}
                </InfoRow>
              </Div>
            </Card>
          </div>

          <div className="QuestionDetails__statistics">
            <Header
              style={{ marginTop: '15px', padding: 0 }}
            >
              Статистика
            </Header>

            {(selectedQuestion.approved && (
              <>
                <HorizontalScroll>
                  <Tabs>
                    <TabsItem
                      selected={activeTab === 'Today'}
                      onClick={() => setActiveTab('Today')}
                    >
                      За сегодня
                    </TabsItem>
                    <TabsItem
                      selected={activeTab === 'Yesterday'}
                      onClick={() => setActiveTab('Yesterday')}
                    >
                      За вчера
                    </TabsItem>
                    <TabsItem
                      selected={activeTab === 'Overall'}
                      onClick={() => setActiveTab('Overall')}
                    >
                      Все время
                    </TabsItem>
                  </Tabs>
                </HorizontalScroll>
                <Card
                  mode={scheme === 'space_gray' ? 'tint' : 'outline'}
                  className={classNames('QuestionDetails__generalInfo--card', { 'QuestionDetails__generalInfo--card-dark': scheme === 'space_gray' })}
                >
                  <Div>
                    <InfoRow header="Показов игрокам">
                      {(activeTab === 'Today') && (selectedQuestion.views.today)}
                      {(activeTab === 'Yesterday') && (selectedQuestion.views.yesterday)}
                      {(activeTab === 'Overall') && (selectedQuestion.views.overall)}
                    </InfoRow>
                    <Separator style={{ margin: '13px 0 11px 0' }} wide />
                    <InfoRow header="Правильных ответов">
                      {(activeTab === 'Today') && (selectedQuestion.views.today - selectedQuestion.error_count.today)}
                      {(activeTab === 'Yesterday') && (selectedQuestion.views.yesterday - selectedQuestion.error_count.yesterday)}
                      {(activeTab === 'Overall') && (selectedQuestion.views.overall - selectedQuestion.error_count.overall)}
                    </InfoRow>
                    <Separator style={{ margin: '13px 0 11px 0' }} wide />
                    <InfoRow header="Неправильных ответов">
                      {(activeTab === 'Today') && (selectedQuestion.error_count.today)}
                      {(activeTab === 'Yesterday') && (selectedQuestion.error_count.yesterday)}
                      {(activeTab === 'Overall') && (selectedQuestion.error_count.overall)}
                    </InfoRow>
                    <Separator style={{ margin: '13px 0 11px 0' }} wide />
                    <InfoRow header="Получено GP">
                      {(activeTab === 'Today') && (selectedQuestion.bpEarned.today)}
                      {(activeTab === 'Yesterday') && (selectedQuestion.bpEarned.yesterday)}
                      {(activeTab === 'Overall') && (selectedQuestion.bpEarned.overall)}
                    </InfoRow>
                    <Separator style={{ margin: '13px 0 11px 0' }} wide />
                    <InfoRow header="Получено монет">
                      {(activeTab === 'Today') && (selectedQuestion.coinsEarned.today)}
                      {(activeTab === 'Yesterday') && (selectedQuestion.coinsEarned.yesterday)}
                      {(activeTab === 'Overall') && (selectedQuestion.coinsEarned.overall)}
                    </InfoRow>
                  </Div>
                </Card>
              </>
            ))}
            {(!selectedQuestion.approved && (
              <Placeholder
                icon={(
                  <Icon56RecentOutline
                    height={48}
                    width={48}
                    style={{ color: 'var(--button_primary_background)' }}
                  />
                )}
              >
                Сейчас этот вопрос проверяется правительством Мозгополии.
                Статистика будет доступна после одобрения вопроса.
              </Placeholder>
            ))}

          </div>
        </Div>
      </Group>


    </Panel>
  );
};

QuestionDetails.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.shape({
    text: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.string),
    explanation: PropTypes.string,
    approved: PropTypes.bool,
    category: PropTypes.string,
    bpForError: PropTypes.number,
    coinsEarned: PropTypes.shape({
      overall: PropTypes.number,
      yesterday: PropTypes.number,
      today: PropTypes.number,
    }),
    bpEarned: PropTypes.shape({
      overall: PropTypes.number,
      yesterday: PropTypes.number,
      today: PropTypes.number,
    }),
    views: PropTypes.shape({
      overall: PropTypes.number,
      yesterday: PropTypes.number,
      today: PropTypes.number,
    }),
    error_count: PropTypes.shape({
      overall: PropTypes.number,
      yesterday: PropTypes.number,
      today: PropTypes.number,
    }),
  }).isRequired,
};
QuestionDetails.defaultProps = {};
export default QuestionDetails;
