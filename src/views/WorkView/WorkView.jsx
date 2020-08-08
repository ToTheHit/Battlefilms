import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PopoutWrapper, ScreenSpinner, View } from '@vkontakte/vkui';
import WorkGallery from '../../panels/Work/WorkGallery/WorkGallery';
import QuizResult from '../../panels/QuizResult/QuizResult';
import WorkViewModal from './WorkViewModal';
import './workView.css';

const WorkView = (props) => {
  const popout = (
    <ScreenSpinner />
  );

  const popoutShadow = (
    <PopoutWrapper alignY="center" alignX="center">
      <ScreenSpinner />
    </PopoutWrapper>
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const { id, nextView } = props;
  const [activePanel, setActivePanel] = useState('WorkGallery');
  const [popoutIsActive, setPopoutIsActive] = useState(true);
  const [popoutShadowIsActive, setPopoutShadowIsActive] = useState(false);

  return (
    <View
      id={id}
      activePanel={activePanel}
      className="WorkView"
      modal={(
        <WorkViewModal
          nextView={nextView}
          setPopoutIsActive={setPopoutIsActive}
        />
      )}
      popout={(popoutIsActive ? popout : (popoutShadowIsActive && popoutShadow))}
    >
      <WorkGallery
        id="WorkGallery"
        setActivePanel={setActivePanel}
        nextView={nextView}
        setPopoutIsActive={setPopoutIsActive}
      />
      <QuizResult
        id="QuizResultPanel"
        setActivePanel={setActivePanel}
        nextView={nextView}
        setPopoutShadowIsActive={setPopoutShadowIsActive}
      />
    </View>
  );
};

WorkView.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};
WorkView.defaultProps = {};
export default WorkView;
