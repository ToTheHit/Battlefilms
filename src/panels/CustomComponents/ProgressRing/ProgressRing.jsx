import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './progressRing.css';
import { classNames } from "@vkontakte/vkui";

const ProgressRing = (props) => {
  const {
    radius, stroke, progress, initialStrokeDashoffest, stokeColor, transitionDuration, className
  } = props;
  // const [normalizedRadius, setNormalizedRadius] = useState(0);
  // const [circumference, setCircumference] = useState(0);
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const [strokeDashoffset, setStrokeDashoffset] = useState(initialStrokeDashoffest);

  useEffect(() => {
    setStrokeDashoffset(circumference - progress / 100 * circumference);
  }, [progress]);

  return (
    <svg
      className={classNames('ProgressRing', className)}
      height={radius * 2}
      width={radius * 2}
    >
      <circle
        stroke={stokeColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transitionDuration: `${transitionDuration}ms` }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

ProgressRing.propTypes = {
  radius: PropTypes.number.isRequired,
  stroke: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  initialStrokeDashoffest: PropTypes.number,
  stokeColor: PropTypes.string,
  transitionDuration: PropTypes.number,
  className: PropTypes.string,
};
ProgressRing.defaultProps = {
  initialStrokeDashoffest: 0,
  stokeColor: 'var(--background_content)',
  transitionDuration: 350,
  className: ''
};
export default ProgressRing;
