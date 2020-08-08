import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './answerButton.css';
import { classNames } from '@vkontakte/vkui';

const AnswerButton = React.forwardRef((props, ref) => {
  const {
    disabled, type, label, action, answerNumber, className,
  } = props;
  const [pressed, setPressed] = useState(false);

  function touchStart() {
    if (!disabled && !type) {
      setPressed(true);
    }
  }

  function touchEnd() {
    setPressed(false);
  }

  return (
    <button
      type="button"
      ref={ref}
      className={classNames('AnswerButton', { 'AnswerButton--disabled': disabled || (type === 'disabled') }, className)}
      onClick={action}
      onTouchStart={touchStart}
      onTouchEnd={touchEnd}
      answernumber={answerNumber}
    >
      <div
        className={classNames('AnswerButton--button', {
          'AnswerButton--button--pressed': pressed,
          'AnswerButton--button--correct': type === 'correct',
          'AnswerButton--button--wrong': type === 'wrong',
        })}
      >
        <p className="AnswerButton--label">
          {label}
        </p>
      </div>
    </button>
  );
});

AnswerButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['correct', 'wrong', 'pressed', 'disabled', '']),
  label: PropTypes.string.isRequired,
  action: PropTypes.func,
  answerNumber: PropTypes.number.isRequired,
};
AnswerButton.defaultProps = {
  className: '',
  disabled: false,
  type: '',
  action: () => {},
};

export default AnswerButton;
