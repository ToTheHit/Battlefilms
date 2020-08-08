import React from 'react';
import PropTypes from 'prop-types';
import './leaderboardBadge.css';
import globalVariables from '../../../../../GlobalVariables';

const LeaderboardBadge = (props) => {
  const { type } = props;
  switch (type) {
    case globalVariables.leaderboardBadgeType.master:
      return (
        <div
          className="LeaderboardBadge"
          style={{
            backgroundColor: '#5856D6',
          }}
        >
          <svg
            width="12px"
            height="10px"
            viewBox="0 0 12 10"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Leaderboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                id="Leaderboard:-All"
                transform="translate(-51.000000, -170.000000)"
                fill="#FFFFFF"
              >
                <g id="Card" transform="translate(12.000000, 133.000000)">
                  <g id="Rating-Table">
                    <g id="icon_mag_leaderboard" transform="translate(35.000000, 32.000000)">
                      <path
                        d="M10.4006591,5.09798359 L15.5671992,7.80249454 C15.8721349,7.96211818 16.0310098,8.2772259 15.9949605,8.58790581 L16,8.59130859 L16,11.5 C16,11.7761424 15.7761424,12 15.5,12 C15.2238576,12 15,11.7761424 15,11.5 L15,9.494 L14,10.017 L14,12.0212766 C14,13.6896433 12.1886246,15 10,15 C7.81137545,15 6,13.6896433 6,12.0212766 L6,10.018 L4.4328008,9.19750546 C4.02926702,8.98626903 3.88151945,8.50274423 4.10279736,8.1175226 C4.17912106,7.98465103 4.29361296,7.87535472 4.4328008,7.80249454 L9.59934091,5.09798359 C9.84891709,4.9673388 10.1510829,4.9673388 10.4006591,5.09798359 Z M13,10.541 L10.4006591,11.9020164 C10.1510829,12.0326612 9.84891709,12.0326612 9.59934091,11.9020164 L7,10.541 L7,12 C7,13.0822558 8.3226313,14 10,14 C11.6773687,14 13,13.0822558 13,12 L13,10.541 Z M10,6 L5,8.5 L10,11 L15,8.5 L10,6 Z"
                        id="icn12_magleader"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      );
    default:
      return null;
  }
};

LeaderboardBadge.propTypes = {
  type: PropTypes.string.isRequired,
};
LeaderboardBadge.defaultProps = {};
export default LeaderboardBadge;
