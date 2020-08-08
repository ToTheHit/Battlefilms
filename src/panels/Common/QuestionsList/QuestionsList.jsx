import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './questionsList.css';
import {
  Div,
  IOS, Panel, PanelHeader, PanelHeaderBack, usePlatform,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import globalVariables from '../../../GlobalVariables';
// import RenderedQuestionCard from '../Main/Components/Mindbrakers/RenderedQuestionCard';

const QuestionsList = (props) => {
  const { id, setActivePanel, setSelectedQuestion } = props;
  const platform = usePlatform();
  const selectedQuestionsList = useSelector((state) => state.userQuestions.selectedQuestionsCategory);
  const selectedCategory = useSelector((state) => state.userQuestions.category);
  const scrollListener = useSelector((state) => state.scrollTo);

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) setIsFirstRender(false);
    else if (scrollListener.scrollableElement === globalVariables.commonView.roots.main) {
      setActivePanel(globalVariables.commonView.panels.main);
    }
  }, [scrollListener]);

  const controlHardwareBackButton = useCallback(() => {
    setActivePanel(globalVariables.commonView.panels.main);
  }, []);

  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'QuestionsList' }, 'QuestionsList', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'QuestionsList' }, 'QuestionsList', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  return (
    <Panel id={id} className="QuestionsList">
      <PanelHeader
        left={(
          <PanelHeaderBack
            label={(platform === IOS && 'Назад')}
            onClick={() => setActivePanel(globalVariables.commonView.panels.main)}
          />
        )}
      >
        {globalVariables.translateEnToRu(selectedCategory)}
      </PanelHeader>

      <Div>
{/*        <RenderedQuestionCard
          setActivePanel={setActivePanel}
          setSelectedQuestion={setSelectedQuestion}
          questions={selectedQuestionsList}
        />*/}
      </Div>

    </Panel>
  );
};

QuestionsList.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setSelectedQuestion: PropTypes.func.isRequired,
};
QuestionsList.defaultProps = {};
export default QuestionsList;
