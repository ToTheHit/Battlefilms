import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './scalableButton.css';
import { classNames } from '@vkontakte/vkui';

const ScalableButton = (props) => {
  const { children, borderRadius, className } = props;
  const [pressed, setPressed] = useState(false);
  const [styleBorderRadius, setStyleBorderRadius] = useState(0);

  useEffect(() => {
    if (typeof borderRadius === 'number') {
      setStyleBorderRadius(borderRadius);
    } else {
      switch (borderRadius) {
        case 'Card':
          setStyleBorderRadius(10);
          break;
        default:
          setStyleBorderRadius(0);
      }
    }
  }, [borderRadius]);

  return (
    <div
      className={classNames('ScalableButton', className)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div
        className={classNames('ScalableButton__content', { 'ScalableButton__content--pressed': pressed })}
        style={{ borderRadius: `${styleBorderRadius}px` }}
      >
        {children}
      </div>
    </div>
  );
};

ScalableButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['Card'])]).isRequired,
};
ScalableButton.defaultProps = {
  className: '',
};
export default ScalableButton;
