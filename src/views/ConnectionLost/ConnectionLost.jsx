import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Panel, Placeholder, ScreenSpinner, View,
} from '@vkontakte/vkui';
import globalVariables from '../../GlobalVariables';
import axios from "axios";
import { useSelector } from "react-redux";

const ConnectionLost = (props) => {
  const { id, nextView } = props;
  const [popoutIsActive, setPopoutIsActive] = useState(false);
  const userToken = useSelector((state) => state.userToken.token);

  function pingToServer() {
    setPopoutIsActive(true);
    const urlParams = new URLSearchParams(window.location.search);
    axios.get(`${globalVariables.serverURL}/api/serverState`, {
      params: {
        id: urlParams.get('vk_user_id'),
      },
      headers: {
        'X-Access-Token': userToken,
      },
    })
      .then((data) => {
        if (data.status) {
          setPopoutIsActive(false);
          nextView(globalVariables.view.start);
        }
      })
      .catch(error => {
        console.info(error);
        setTimeout(() => {
          setPopoutIsActive(false);
        }, 2000);

      })
  }

  return (
    <View
      id={id}
      activePanel="ConnectionLostPanel"
      className="ConnectionLost"
      popout={popoutIsActive && <ScreenSpinner />}
    >
      <Panel id="ConnectionLostPanel">
        <Placeholder
          icon={(
            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="icn56_connection_lost" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path d="M28.4837821,38.2558594 C29.6263602,38.2558594 30.4134696,37.5195312 30.4388602,36.3007812 C30.4896415,27.2363281 30.5658133,18.1464844 30.6165946,9.08203125 C30.6165946,7.8125 29.6263602,7 28.4583915,7 C27.2904227,7 26.3001883,7.8125 26.3001883,9.08203125 C26.3763602,18.1464844 26.4271415,27.2363281 26.528704,36.3007812 C26.528704,37.5195312 27.3158133,38.2558594 28.4837821,38.2558594 Z M6.90175084,26.5 C11.3705008,21.7519531 17.0072196,18.78125 23.3040946,17.7402344 L23.2279227,10.9355469 C14.6458915,12.2304688 6.82557896,16.5722656 2.22987584,22.0566406 C1.89979771,22.4375 1.92518834,22.9707031 2.30604771,23.3515625 L5.40370396,26.5253906 C5.83534459,26.9570312 6.47011021,26.9316406 6.90175084,26.5 Z M51.5384696,26.4492188 L54.6107352,23.3515625 C55.0169852,22.9707031 55.0169852,22.4375 54.6869071,22.0566406 C50.091204,16.5722656 42.2708915,12.2304688 33.6888602,10.9609375 L33.638079,17.765625 C39.9095633,18.8320312 45.5462821,21.828125 50.0658133,26.5 C50.4720633,26.9316406 51.0814383,26.9316406 51.5384696,26.4492188 Z M16.5247977,36.046875 C18.2767508,34.1171875 20.7142508,32.5429688 23.4310477,31.6542969 L23.3548758,24.5957031 C18.3529227,25.6621094 14.0619071,28.2519531 11.3958915,31.4003906 C11.0658133,31.78125 11.1165946,32.2636719 11.497454,32.6445312 L15.0013602,36.1484375 C15.4583915,36.6054688 16.0423758,36.5800781 16.5247977,36.046875 Z M41.966204,36.0976562 L45.419329,32.6445312 C45.8001883,32.2890625 45.8509696,31.78125 45.5208915,31.4003906 C42.8548758,28.2265625 38.5638602,25.6621094 33.5872977,24.5957031 L33.5365165,31.7050781 C36.2279227,32.6191406 38.6908133,34.21875 40.4681571,36.1230469 C40.8997977,36.5800781 41.4583915,36.5800781 41.966204,36.0976562 Z M28.4583915,49.3261719 C30.4134696,49.3261719 31.9876883,47.7519531 31.9876883,45.8222656 C31.9876883,43.8671875 30.4134696,42.2929688 28.4583915,42.2929688 C26.528704,42.2929688 24.9544852,43.8671875 24.9544852,45.8222656 C24.9544852,47.7519531 26.528704,49.3261719 28.4583915,49.3261719 Z" id="connection" fill="#EB4250" fillRule="nonzero" />
              </g>
            </svg>
          )}
          action={(
            <Button
              size="l"
              mode="tertiary"
              onClick={() => pingToServer()}
            >
              Обновить соединение
            </Button>
          )}
          stretched
        >
          Потеряно соединение с сервером.
          Проверьте доступность сети Интернет и обновите соединение.
        </Placeholder>
      </Panel>
    </View>
  );
};

ConnectionLost.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};
ConnectionLost.defaultProps = {};
export default ConnectionLost;
