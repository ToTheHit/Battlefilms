import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './quizResultMain.css';
import {
  Div, Footer, Group, Headline, Text, Title,
} from '@vkontakte/vkui';

const QuizResultMain = (props) => {
  const { quizResult, correctQuestionCount } = props;
  const [endOfWord, setEndOfWord] = useState('');

  useEffect(() => {
    if ((quizResult.length - correctQuestionCount) === 1) setEndOfWord('ка');
    else if ((quizResult.length - correctQuestionCount) === 5 || (quizResult.length - correctQuestionCount) === 0) setEndOfWord('ок');
    else setEndOfWord('ки');
  }, quizResult);

  return (
    <div>
      <Group className="QuizResult--header" separator="hide">
        <div className="QuizResult--awards" style={{ marginTop: '25px' }}>
          <div className="QuizResult--awards_item">
            <Title
              level={1}
              weight="semibold"
              className="QuizResult--GPcounter"
            >
              {`+${correctQuestionCount * 10}`}
            </Title>
            <Title
              level={1}
              mode="secondary"
              weight="semibold"
              className="QuizResult--counterName QuizResult--counterName_default"
            >
              монет
            </Title>
          </div>
          <div className="QuizResult--awards_item--divider" />
          <div className="QuizResult--awards_item">
            <Title
              level={1}

              weight="semibold"
              className="QuizResult--counterName_green"
            >
              {`+${correctQuestionCount}`}
            </Title>
            <Title
              level={1}
              mode="secondary"
              weight="semibold"
              className="QuizResult--counterName QuizResult--counterName_default"
            >
              BR
            </Title>
          </div>
        </div>
        <Text>
          {`${correctQuestionCount} из ${quizResult.length} правильных ответа`}
        </Text>
      </Group>

      <div className="divider" />
      <Group>
        <Div style={{ paddingTop: 0 }}>
          <Headline weight="semibold" style={{ paddingBottom: '5px' }}>
            Работа над ошибками
          </Headline>

          {quizResult && quizResult.map((item) => (
            item.correctAnswerNumber !== item.selectedAnswerNumber ? (
              <div key={item.question}>
                <Text className="QuizResult--question">{item.question}</Text>
                <div className="QuizResult--answersBlock">
                  <Text>
                    <span className="QuizResult--answer">Верный ответ:</span>
                    <span className="QuizResult--answer-right">{item.correctAnswer}</span>
                  </Text>
                </div>
              </div>
            ) : <div key={item.question} />
          ))}
          <Footer>
            {`${quizResult.length - correctQuestionCount} ошиб${endOfWord}`}
            {' '}
          </Footer>
        </Div>
      </Group>
    </div>

  );
};

QuizResultMain.propTypes = {
  quizResult: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string,
    selectedAnswer: PropTypes.string,
    selectedAnswerNumber: PropTypes.number,
    correctAnswer: PropTypes.string,
    correctAnswerNumber: PropTypes.number,
  })).isRequired,
  correctQuestionCount: PropTypes.number.isRequired,
};
QuizResultMain.defaultProps = {};
export default QuizResultMain;
