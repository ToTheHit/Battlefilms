import React, { useEffect, useState } from 'react';
import './effectCoinsDetailsContent.css';
import { useSelector } from 'react-redux';
import {
  Cell, Div, Header, Separator, SimpleCell, withModalRootContext,
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import Icon64Math from '../../../../assets/Icons/icn64_math.png';
import Icon64Russian from '../../../../assets/Icons/icn64_rus.png';
import Icon64Litra from '../../../../assets/Icons/icn64_litra.png';
import Icon64Physics from '../../../../assets/Icons/icn64_physics.png';
import Icon64Chemistry from '../../../../assets/Icons/icn64_chem.png';
import Icon64Astro from '../../../../assets/Icons/icn64_astro.png';
import Icon64Biology from '../../../../assets/Icons/icn64_bio.png';
import Icon64History from '../../../../assets/Icons/icn64_history.png';
import Icon64Art from '../../../../assets/Icons/icn64_art.png';
import Icon64Sport from '../../../../assets/Icons/icn64_sport.png';
import Icon64Other from '../../../../assets/Icons/icn64_other.png';
import Icon64Geography from '../../../../assets/Icons/icn64_geography.png';
import globalVariables from '../../../../GlobalVariables';
import Icon48Bubble from '../../../../assets/Icons/icn48_bubble_plus.png';
import Icon48Brain from '../../../../assets/Icons/icn48_brain.png';
import Icon48Story from '../../../../assets/Icons/icn48_story.png';

const EffectCoinsDetailsContent = (props) => {
  const { updateModalHeight } = props;

  const questions = useSelector((state) => state.userQuestions.questions.All);
  const isExamAvailable = useSelector((state) => state.userInfo.isExamAvailable);
  // const isExamAvailable = false;

  const coinsToday = useSelector((state) => state.userInfo.coins.today);
  // const coinsToday = 999;
  const confirmReward = useSelector((state) => state.userInfo.confirmReward.coins);
  // const confirmReward = 999;
  const quizIncome = useSelector((state) => state.userInfo.lastExamReward.coins);
  // const quizIncome = 999;
  // const storiesCount = useSelector((state) => state.userInfo.storiesCount);
  // const storiesCount = {today: 999};

  const [questionsIncome, setQuestionIncome] = useState(0);
  const [categoryIncome, setCategoryIncome] = useState([]);

  function getIcon(category) {
    switch (category) {
      case 'Math':
        return Icon64Math;
      case 'Russian':
        return Icon64Russian;
      case 'Literature':
        return Icon64Litra;
      case 'Physics':
        return Icon64Physics;
      case 'Chemistry':
        return Icon64Chemistry;
      case 'Astronomy':
        return Icon64Astro;
      case 'Biology':
        return Icon64Biology;
      case 'History':
        return Icon64History;
      case 'Art':
        return Icon64Art;
      case 'Sport':
        return Icon64Sport;
      case 'Other':
        return Icon64Other;
      case 'Geography':
        return Icon64Geography;
      default:
        return '';
    }
  }

  function getCorrectWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['монета', 'монеты', 'монет'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  const [description, setDescription] = useState(
    (coinsToday === 0
      ? 'Ваш доход на сегодня равен нулю. Купите вопросы в магазине, чтобы начать зарабатывать на их показах другим игрокам.'
      : (questionsIncome === 0 ? `Ваш доход за сегодня составил ${coinsToday} ${getCorrectWord(coinsToday)}. Купите вопросы в магазине, чтобы начать зарабатывать на их показах другим игрокам.`
        : `Ваш доход за сегодня составил ${coinsToday} ${getCorrectWord(coinsToday)}. Доход с вопросов составил ${questionsIncome} ${getCorrectWord(questionsIncome)}.`)),
  );


  // const [description1, setDescription1] = useState();

  useEffect(() => {
    // if (categoryIncome.length || quizIncome > 0 || confirmReward > 0) {
    updateModalHeight();
    // }
  }, [categoryIncome, questionsIncome, confirmReward, quizIncome]);

  useEffect(() => {
    if (coinsToday === 0) {
      setDescription('Ваш доход на сегодня равен нулю. Купите вопросы в магазине, чтобы начать зарабатывать на их показах другим игрокам.');
    } else if (questionsIncome === 0) {
      setDescription(`Ваш доход за сегодня составил ${coinsToday} ${getCorrectWord(coinsToday)}. Купите вопросы в магазине, чтобы начать зарабатывать на их показах другим игрокам.`);
    } else {
      setDescription(`Ваш доход за сегодня составил ${coinsToday} ${getCorrectWord(coinsToday)}. Доход с вопросов составил ${questionsIncome} ${getCorrectWord(questionsIncome)}.`);
    }
  }, [coinsToday, categoryIncome.length, questionsIncome]);

  useEffect(() => {
    const sortedQuestions = {};
    for (let i = 0; i < questions.length; i += 1) {
      if (!sortedQuestions[questions[i].category]) {
        sortedQuestions[questions[i].category] = 0;
      }
      sortedQuestions[questions[i].category] += questions[i].coinsEarned.today;
    }
    // sortedQuestions.Math = 999;
    // sortedQuestions.Russian = 999;
    // sortedQuestions.Literature = 999;
    // sortedQuestions.Physics = 999;
    // sortedQuestions.Chemistry = 999;
    // sortedQuestions.Astronomy = 999;
    // sortedQuestions.Biology = 999;
    // sortedQuestions.History = 999;
    // sortedQuestions.Art = 999;
    // sortedQuestions.Sport = 999;
    // sortedQuestions.Geography = 999;
    // sortedQuestions.Other = 999;

    Object.keys(sortedQuestions).map((item) => {
      if (sortedQuestions[item] === 0) delete sortedQuestions[item];
    });

    let tempQuestionsIncome = 0;
    Object.keys(sortedQuestions).map((item) => {
      tempQuestionsIncome += sortedQuestions[item];
    });

    setQuestionIncome(tempQuestionsIncome);

    const rendered = Object.keys(sortedQuestions).map((item) => (
      <SimpleCell
        key={`EffectCoinsDetails__category-${item}`}
        disabled
        className="EffectCoinsDetails--itemIncome"
        before={(
          <div
            className="EffectCoinsDetails--icon"
            style={{ backgroundImage: `url(${getIcon(item)})` }}
          />
        )}
        indicator={`+${sortedQuestions[item]} ${getCorrectWord(sortedQuestions[item])}`}
      >
        {globalVariables.translateEnToRu(item)}
      </SimpleCell>
    ));
    setCategoryIncome(rendered);
  }, [questions]);

  return (
    <div className="EffectCoinsDetailsContent">
      <Cell
        multiline
        description={description}
      />
      <Div style={{ paddingTop: '0px' }}>
        {((quizIncome > 0) && (
          <SimpleCell
            className="EffectCoinsDetails--itemIncome"
            disabled
            before={(
              <div
                className="EffectCoinsDetails--icon"
                style={{ backgroundImage: `url(${Icon48Brain})` }}
              />
            )}
            indicator={`+${quizIncome} монет`}
          >
            Мозговой отчёт
          </SimpleCell>
        ))}

        {(confirmReward > 0 && (
          <SimpleCell
            disabled
            className="EffectCoinsDetails--itemIncome"
            before={(
              <div
                className="EffectGPDetails--icon"
                style={{ backgroundImage: `url(${Icon48Bubble})` }}
              />
            )}
            indicator={`+${confirmReward} монет`}
          >
            Одобрены вопросы
          </SimpleCell>
        ))}

        {/*        {(storiesCount.today > 0 && (
          <SimpleCell
            disabled
            className={'EffectGPDetails--itemIncome'}
            before={(
              <div
                className="EffectGPDetails--icon"
                style={{ backgroundImage: `url(${Icon48Story})` }}
              />
            )}
            indicator={`+${storiesCount.today} монет`}
          >
            Публикация истории
          </SimpleCell>
        ))} */}

        {(((confirmReward > 0 || quizIncome > 0) && (categoryIncome.length > 0)) && (
          <Separator style={{ marginTop: '16px' }} wide />
        ))}

        {(categoryIncome.length > 0 ? (
          <div>
            <Header
              style={{ padding: 0 }}
            >
              Прибыль с вопросов
            </Header>

            {categoryIncome}
          </div>
        ) : null)}
      </Div>
    </div>
  );
};

EffectCoinsDetailsContent.propTypes = {
  updateModalHeight: PropTypes.func,

};
EffectCoinsDetailsContent.defaultProps = {
  updateModalHeight: () => {},
};
export default withModalRootContext(EffectCoinsDetailsContent);
