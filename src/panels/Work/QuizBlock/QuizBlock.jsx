import React, {
  useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import './quizBlock.css';
import {
  Avatar, Button, Div, Group, Headline, Text, Title,
} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import AnswerButton from '../../CustomComponents/AnswerButton/AnswerButton';

const QuizBlock = (props) => {
  const {
    data, time, onComplete, lastQuestionInStorage, goToNextQuestion,
  } = props;

  const refsButton = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);
  const [stop, setStop] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [correctButton, setcorrectButton] = useState(-1);
  const [timeIsOver, setTimeIsOver] = useState(false);
  const [isUsed, setIsUsed] = useState(false);

  useEffect(() => {
    switch (data.correctAnswerNumber) {
      case 0:
        setcorrectButton(refsButton.current[0]);
        break;
      case 1:
        setcorrectButton(refsButton.current[1]);
        break;
      case 2:
        setcorrectButton(refsButton.current[2]);
        break;
      case 3:
        setcorrectButton(refsButton.current[3]);
        break;
      default:
        break;
    }

    return () => {
      // setSelectedButton(null);
      // setcorrectButton(null);
      // setStop(false);
    };
  }, [data.question]);

  useEffect(() => {
    if (lastQuestionInStorage.selectedAnswerNumber > -1 && time > 0) {
      if (data._id === lastQuestionInStorage.id) {
        const arr = refsButton.current;
        setSelectedButton(arr[lastQuestionInStorage.selectedAnswerNumber]);
        setStop(true);
      }
    }
  }, [lastQuestionInStorage]);

  useEffect(() => {
    if (time <= 0) {
      setTimeIsOver(true);
      let incorrectAnswerNumber = -2;
      const arrayAnswersNumber = [0, 1, 2, 3];
      const rndNumber = Math.floor(Math.random() * 3);
      const arr = refsButton.current.slice(0);
      arrayAnswersNumber.splice(arr.indexOf(correctButton), 1);
      arr.splice(arr.indexOf(correctButton), 1);
      incorrectAnswerNumber = arrayAnswersNumber[rndNumber];
      setSelectedButton(arr[rndNumber]);
      bridge.send('VKWebAppTapticNotificationOccurred', { type: 'error' });
      onComplete(data._id, data.question, 'Нет ответа', data.answers[data.correctAnswerNumber], incorrectAnswerNumber, data.correctAnswerNumber);
    }
  }, [time]);

  useEffect(() => {
    if (selectedButton && selectedButton.current) {
      if (selectedButton === correctButton) bridge.send('VKWebAppTapticNotificationOccurred', { type: 'success' });
      else bridge.send('VKWebAppTapticNotificationOccurred', { type: 'error' });
    }
  }, [selectedButton]);

  function getType(ref) {
    if (time > 0 && !stop) {
      return '';
    }
    if (selectedButton === ref) {
      if (selectedButton === correctButton) return 'correct';
      return 'wrong';
    }
    if (ref === correctButton) return 'correct';
    return 'disabled';
  }

  const redirectToProfile = useCallback(() => {
    if (stop) return `https://vk.com/id${data.requestedBy.user_id}`;
    return null;
  }, [stop]);

  const renderedContent = useMemo(() => {
    let author = null;
    if (data.requestedBy !== 0) {
      author = (
        <a target="_blank" rel="noopener noreferrer" href={redirectToProfile()} className="Work--question__author">
          <Avatar size={24} src={data.requestedBy.photo} />
          <div className="Work--question__author-name">
            {`${data.requestedBy.first_name} ${data.requestedBy.last_name} - автор вопроса`}
          </div>
        </a>
      );

      /*      if (!stop) {
        author = (
          <div className="Work--question__author">
            <Avatar size={24} src={data.requestedBy.photo} />
            <div className="Work--question__author-name">
              {`${data.requestedBy.first_name} ${data.requestedBy.last_name} - автор вопроса`}
            </div>
          </div>
        );
      } else {
        author = (
          <a target="_blank" rel="noopener noreferrer" href={`https://vk.com/id${data.requestedBy.user_id}`} className="Work--question__author">
            <Avatar size={24} src={data.requestedBy.photo} />
            <div className="Work--question__author-name">
              {`${data.requestedBy.first_name} ${data.requestedBy.last_name} - автор вопроса`}
            </div>
          </a>
        );
      } */
    }
    return (
      <div style={{ paddingTop: 0 }}>
        <Div style={{ paddingBottom: 0 }}>
          <Title level={1} weight="bold" className="Work--title">
            {data.question}
          </Title>
        </Div>
        <Group
          className="Work--question"
          description={author}
        >
          <Div style={{ paddingTop: '2px' }}>
            <AnswerButton
              className="Work--button"
              ref={refsButton.current[0]}
              label={data.answers[0]}
              answerNumber={0}
              action={() => {
                if (time > 0 && !stop) {
                  setStop(true);
                  setSelectedButton(refsButton.current[0]);
                  onComplete(data._id, data.question, data.answers[refsButton.current[0].current.getAttribute('answernumber')], data.answers[data.correctAnswerNumber], parseInt(refsButton.current[0].current.getAttribute('answernumber'), 10), data.correctAnswerNumber);
                }
              }}
              type={getType(refsButton.current[0])}
            />
            <AnswerButton
              className="Work--button"
              ref={refsButton.current[1]}
              label={data.answers[1]}
              answerNumber={1}
              action={() => {
                if (time > 0 && !stop) {
                  setStop(true);
                  setSelectedButton(refsButton.current[1]);
                  onComplete(data._id, data.question, data.answers[refsButton.current[1].current.getAttribute('answernumber')], data.answers[data.correctAnswerNumber], parseInt(refsButton.current[1].current.getAttribute('answernumber'), 10), data.correctAnswerNumber);
                }
              }}
              type={getType(refsButton.current[1])}
            />
            <AnswerButton
              className="Work--button"
              ref={refsButton.current[2]}
              label={data.answers[2]}
              answerNumber={2}
              action={() => {
                if (time > 0 && !stop) {
                  setStop(true);
                  setSelectedButton(refsButton.current[2]);
                  onComplete(data._id, data.question, data.answers[refsButton.current[2].current.getAttribute('answernumber')], data.answers[data.correctAnswerNumber], parseInt(refsButton.current[2].current.getAttribute('answernumber'), 10), data.correctAnswerNumber);
                }
              }}
              type={getType(refsButton.current[2])}
            />
            <AnswerButton
              className="Work--button"
              ref={refsButton.current[3]}
              label={data.answers[3]}
              answerNumber={3}
              action={() => {
                if (time > 0 && !stop) {
                  setStop(true);
                  setSelectedButton(refsButton.current[3]);
                  onComplete(data._id, data.question, data.answers[refsButton.current[3].current.getAttribute('answernumber')], data.answers[data.correctAnswerNumber], parseInt(refsButton.current[3].current.getAttribute('answernumber'), 10), data.correctAnswerNumber);
                }
              }}
              type={getType(refsButton.current[3])}
            />
          </Div>
        </Group>

        {(selectedButton && data.explanation) && (
        <Group>
          <Div style={{ marginTop: 0 }}>
            <Headline
              level={2}
              weight="semibold"
              style={{ marginBottom: '7px' }}
            >
              Пояснение
            </Headline>
            <Text>
              {data.explanation}
            </Text>
          </Div>
        </Group>
        )}

        {(selectedButton && (
          <Div style={{ paddingTop: '8px' }}>
            <Button
              mode="secondary"
              size="xl"
              onClick={() => {
                if (!isUsed) {
                  setIsUsed(true);
                  goToNextQuestion();
                }
              }}
            >
              Продолжить
            </Button>
          </Div>
        ))}
      </div>
    );
  }, [timeIsOver, stop]);

  return (
    <div style={{ height: '100%' }}>
      {renderedContent}
    </div>
  );
};

QuizBlock.propTypes = {
  data: PropTypes.shape({
    question: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.string,
    correctAnswerNumber: PropTypes.number,
    explanation: PropTypes.string,
    requestedBy: PropTypes.oneOfType([PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      photo: PropTypes.string,
    }), PropTypes.number]),
    _id: PropTypes.string,
  }).isRequired,
  time: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  lastQuestionInStorage: PropTypes.shape({
    id: PropTypes.string,
    selectedAnswerNumber: PropTypes.number,
  }),
  goToNextQuestion: PropTypes.func.isRequired,
};
QuizBlock.defaultProps = {
  lastQuestionInStorage: {
    id: '',
    selectedAnswerNumber: -1,
  },
};
export default QuizBlock;
