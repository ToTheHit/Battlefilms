import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QuizBlock from '../QuizBlock/QuizBlock';
import WorkGallerySubtitle from './WorkGallerySubtitle';

const WorkGalleryPanel = (props) => {
  const {
    id,
    questionIndex,
    data,
    totalQuestions,
    timeToAnswer,
    setResult,
    start,
    goToNextQuestion,
    lastQuestionInStorage,
  } = props;

  const panelRef = useRef(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [time, setTime] = useState(timeToAnswer);
  const [startInterval, setStartInterval] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    if (!isAnswered) {
      setStartInterval(start);
    }
  }, [start]);

  useEffect(() => {
    setTimeProgress(100 + (time / timeToAnswer) * -100);
  }, [time]);

  // Интервал
  useEffect(() => {
    let intervalId;
    if (startInterval) {
      let prevSystemTime = Date.now();
      intervalId = setInterval(() => {
        const seconds = ((Date.now() - prevSystemTime) / 1000).toFixed(1);
        prevSystemTime = Date.now();
        setTime((oldTime) => oldTime - seconds);
      }, 500);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [startInterval]);

  // Остановка интервала
  useEffect(() => {
    //
    if (time <= 0) {
      setStartInterval(false);
      setIsAnswered(true);
    }
  }, [time]);

  useEffect(() => {
    if (data._id === lastQuestionInStorage.id) {
      setIsAnswered(true);
    }
  }, [lastQuestionInStorage.id]);

  // Вызывается после окончания таймера, либо после выбранного ответа
  function onCompleteQuestion(
    questionId,
    question,
    selectedAnswer,
    correctAnswer,
    selectedAnswerNumber,
    correctAnswerNumber,
  ) {
    setStartInterval(false);
    setIsAnswered(true);

    if (questionIndex !== 0) {
      setResult((prevResult) => [...prevResult, {
        questionIndex,
        questionId,
        question,
        selectedAnswer,
        correctAnswer,
        selectedAnswerNumber,
        correctAnswerNumber,
      }]);
    }
  }

  return (
    <div id={id} className="WorkGalleryPanel" ref={panelRef}>
      <WorkGallerySubtitle
        time={time}
        isAnswered={isAnswered}
        questionIndex={questionIndex}
        questionID={data._id}
        category={data.theme}
        totalQuestions={totalQuestions}
        goToNextQuestion={goToNextQuestion}
        timeProgress={timeProgress}
      />
      <div className="WorkGalleryPanel--content">
        <QuizBlock
          data={{
            question: data.question,
            answers: data.answers,
            correctAnswer: data.correctAnswer,
            correctAnswerNumber: data.correctAnswerNumber,
            explanation: data.explanation,
            requestedBy: data.requestedBy,
            _id: data._id,
          }}
          time={time}
          onComplete={onCompleteQuestion}
          lastQuestionInStorage={lastQuestionInStorage}
          goToNextQuestion={goToNextQuestion}
        />

      </div>
    </div>
  );
};

WorkGalleryPanel.propTypes = {
  id: PropTypes.string.isRequired,
  questionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  data: PropTypes.shape({
    question: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.string,
    correctAnswerNumber: PropTypes.number,
    explanation: PropTypes.string,
    theme: PropTypes.string,
    requestedBy: PropTypes.oneOfType([PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      photo: PropTypes.string,
    }), PropTypes.number]),
    _id: PropTypes.string,
  }).isRequired,
  timeToAnswer: PropTypes.number,
  setResult: PropTypes.func.isRequired,
  start: PropTypes.bool.isRequired,
  goToNextQuestion: PropTypes.func.isRequired,
  lastQuestionInStorage: PropTypes.shape({
    id: PropTypes.string,
    selectedAnswerNumber: PropTypes.number,
  }),
};
WorkGalleryPanel.defaultProps = {
  timeToAnswer: 10,
  lastQuestionInStorage: {
    id: '',
    selectedAnswerNumber: -1,
  },
};
export default WorkGalleryPanel;
