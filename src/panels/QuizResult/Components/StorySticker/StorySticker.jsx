import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './storySticker.css';

const StorySticker = React.forwardRef((props, ref) => {
  const {
    question, answer0, answer1, answer2, answer3, name, photo, setStickerAnswersData,
  } = props;
  const refAnswer0 = useRef(null);
  const refAnswer1 = useRef(null);
  const refAnswer2 = useRef(null);
  const refAnswer3 = useRef(null);
  const refAnswersContainer = useRef(null);

  useEffect(() => {
    setStickerAnswersData([
      {
        offset: refAnswer0.current.offsetTop,
        height: refAnswer0.current.getBoundingClientRect().height,
      },
      {
        offset: refAnswer1.current.offsetTop,
        height: refAnswer1.current.getBoundingClientRect().height,
      },
      {
        offset: refAnswer2.current.offsetTop,
        height: refAnswer2.current.getBoundingClientRect().height,
      },
      {
        offset: refAnswer3.current.offsetTop,
        height: refAnswer3.current.getBoundingClientRect().height,
      },
      {
        offset: refAnswersContainer.current.offsetTop,
        height: refAnswersContainer.current.getBoundingClientRect().height,
      },
      {
        height: document.getElementById('story-sticker').getBoundingClientRect().height,
      },
    ]);
  }, []);

  return (
    <div ref={ref} className="StorySticker" id="story-sticker">
      <div className="sticker-container" id="sticker-container">
        <div className="sticker-title">{question}</div>
        <div ref={refAnswersContainer} className="sticker-questions-container">
          <div ref={refAnswer0} className="sticker-question">
            <span>{answer0}</span>
          </div>
          <div ref={refAnswer1} className="sticker-question">
            <span>{answer1}</span>
          </div>
          <div ref={refAnswer2} className="sticker-question">
            <span>{answer2}</span>
          </div>
          <div ref={refAnswer3} className="sticker-question">
            <span>{answer3}</span>
          </div>
        </div>
        {/*        <div className="author-container">
          <div className="sticker-avatar-container">
            <img
              src={ photo }
              className="sticker-avatar"
            />
          </div>
          <span className="author-name">{ name }</span>
        </div> */}
      </div>
      <div className="sticker-footer">
        Найдите ответ на этот и другие вопросы
        <br />
        в мини-приложении.
      </div>
    </div>
  );
});

StorySticker.propTypes = {
  question: PropTypes.string.isRequired,
  answer0: PropTypes.string.isRequired,
  answer1: PropTypes.string.isRequired,
  answer2: PropTypes.string.isRequired,
  answer3: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  setStickerAnswersData: PropTypes.func.isRequired,
};
StorySticker.defaultProps = {};
export default StorySticker;
