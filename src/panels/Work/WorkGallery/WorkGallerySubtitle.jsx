import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Cell, Div, Text, Title,
} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import Icon28ReportOutline from '@vkontakte/icons/dist/28/report_outline';
import ProgressRing from '../../CustomComponents/ProgressRing/ProgressRing';

const WorkGallerySubtitle = (props) => {
  const {
    questionIndex, category, isAnswered, time, totalQuestions, timeProgress, questionID,
  } = props;
  const dispatch = useDispatch();
  const [reportIsAvailable, setReportIsAvailable] = useState(true);
  const confirmReportByQuestionID = useSelector((state) => state.quiz.confirmReportByQuestionID);

  useEffect(() => {
    if (confirmReportByQuestionID === questionID) {
      setReportIsAvailable(false);
    }
  }, [confirmReportByQuestionID]);

  function openModalCard() {
    dispatch({
      type: 'UPDATE_QUIZ_RESULT',
      payload: {
        reportQuestionID: questionID,
      },
    });
    dispatch({
      type: 'UPDATE_WORK-VIEW-MODAL',
      payload: {
        modalIsActive: true,
      },
    });
  }

  return (
    <Div className="Work--subTitle">
      {(questionIndex === 0 ? (
        <Cell
          multiline
          description="Не учитывается"
        >
          <Text>
            Вопрос для разогрева
          </Text>
        </Cell>
      ) : (
        <Cell
          multiline
          description={category}
        >
          <Text>
            {`Вопрос ${questionIndex} из ${totalQuestions - 1}`}
          </Text>
          {/*            <Text>
              {`Storage last ID: ${lastQuestionInStorage.id}`}
            </Text>
            <Text>
              {`This quiz ID: ${data._id}`}
            </Text> */}
        </Cell>
      ))}

      {isAnswered ? (
        (reportIsAvailable && (
          <div className="Work--arrowNext">
            <Button
              mode="secondary"
              onClick={() => {
                openModalCard();
              }}
            >
              <Icon28ReportOutline style={{ color: 'var(--field_error_border)' }} />
            </Button>
          </div>
        ))
      ) : (
        <div className="Work--timer">
          <div className="Work--timer__gradient" />
          <ProgressRing
            className="Work--timer__circle"
            radius={34}
            stroke={5}
            initialStrokeDashoffest={151}
            progress={-1 * timeProgress}
            transitionDuration={500}
          />
          <div className="Work--timer__gradient-mask" />
          <div className="Work--timer__time">
            <Title level={2} weight="semibold">{(time > 0 ? time.toFixed(0) : 0)}</Title>
          </div>
        </div>
      )}
    </Div>
  );
};

WorkGallerySubtitle.propTypes = {
  time: PropTypes.number.isRequired,
  isAnswered: PropTypes.bool.isRequired,
  questionIndex: PropTypes.number.isRequired,
  questionID: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  timeProgress: PropTypes.number.isRequired,
};
WorkGallerySubtitle.defaultProps = {};
export default WorkGallerySubtitle;
