import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button, classNames, Gallery, Panel, Snackbar,
} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';

import './startPanel.css';

import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';
import globalVariables from '../../GlobalVariables';
import StartPanelPage1 from './Components/StartPanelPage1';
import StartPanelPage2 from './Components/StartPanelPage2';
import StartPanelPage3 from './Components/StartPanelPage3';

const StartPanel = (props) => {
  const { id, nextView, popoutState } = props;
  const dispatch = useDispatch();

  const [slideIndex, setSlideIndex] = useState(0);
  const [readyToShow, setReadyToShow] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarError, setSnackbarError] = useState('');
  const scheme = useSelector((state) => state.schemeChanger.scheme);

  useEffect(() => {
    let requestIsCompleted = true;
    bridge.send('VKWebAppStorageGet', { keys: [globalVariables.tooltips, globalVariables.introductionComplete] })
      .then(((bridgeData) => {
        const urlParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash.substr(1);
        if (bridgeData.keys[0].value) {
          dispatch({
            type: 'TOOLTIP_UPDATE',
            payload: JSON.parse(bridgeData.keys[0].value),
          });
        }

        // TODO: убрать отрицание
        if (!bridgeData.keys[1].value) {
          dispatch({
            type: 'UPDATE_USER_INFO',
            payload: {
              isInvited: !!hash,
              participantBattleID: hash,
            },
          });
          nextView(globalVariables.view.main);


          /*          axios.get(`${globalVariables.serverURL}/api/serverState`, {
            params: {
              id: urlParams.get('vk_user_id'),
            },
          })
            .then((data) => {
              if (data.status) {
                nextView(globalVariables.view.main);
              }
            })
            .catch((error) => {
              console.info(error);
              nextView(globalVariables.view.connectionLost);
            }); */
        } else {
          setReadyToShow(true);
          popoutState.setPopoutIsActive(false);
        }
      }))
      .catch((error) => {
        setTimeout(() => {
          console.info(error);
          nextView(globalVariables.view.connectionLost);
        }, 1000);
        requestIsCompleted = false;
        setReadyToShow(true);
        popoutState.setPopoutIsActive(false);
        setShowSnackbar(true);
      });

    const timer = setTimeout(() => {
      if (!requestIsCompleted) {
        setReadyToShow(true);
        popoutState.setPopoutIsActive(false);
        setShowSnackbar(true);
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  function Registration() {
    popoutState.setPopoutIsActive(true);

    axios.get(`${globalVariables.serverURL}/test${window.location.search}`)
      .then((data) => console.info('ok', data))
      .catch((error) => {
        console.error(error);
        console.info(error);

      })
      .finally(() => {
        popoutState.setPopoutIsActive(false);
      })
    /*    axios.get(`${globalVariables.serverURL}/api/registerUser${window.location.search}`)
      .then((data) => {
        console.info('Server: registration success', data);
        dispatch({
          type: 'UPDATE_TOKEN',
          payload: {
            token: data.data.attachment.token,
          },
        });

        bridge.send('VKWebAppStorageSet', {
          key: globalVariables.authToken,
          value: data.data.attachment.token,
        })
          .then(() => {
            nextView(globalVariables.view.main);
          });
      })
      .catch((err) => {
        // Сервер не отвечает
        console.info((err));
        if (err.status) {
          setSnackbarError(err.status);
        }
        setShowSnackbar(true);
        popoutState.setPopoutIsActive(false);
      }); */
  }

  return (
    <Panel id={id} className="StartPanel">
      {showSnackbar && (
        <Snackbar
          duration={2000}
          onClose={() => { setShowSnackbar(false); setSnackbarError(''); }}
          before={(
            <Icon28ErrorOutline height={24} width={24} style={{ color: 'var(--destructive)' }} />
          )}
        >
          {(snackbarError && (
          <>
            {`Ошибка при запросе к серверу. Номер ошибки: ${snackbarError}`}
          </>
          ))}
          {(!snackbarError && (
            <>
              Не удалось связаться с сервером
            </>
          ))}
        </Snackbar>
      )}

      <Gallery
        slideWidth="100%"
        style={{ height: '100vh' }}
        bullets={(readyToShow ? (((scheme === 'bright_light') || (scheme === 'client_light') ? 'dark' : 'light')) : false)}
        className="Start1--gallery"
        slideIndex={slideIndex}
        onChange={(index) => setSlideIndex(index)}
      >
        <StartPanelPage1
          id="StartPanel-page-1"
          goToNextSlide={setSlideIndex}
          readyToShow={readyToShow}
          setReadyToShow={setReadyToShow}
          popoutIsActive={popoutState.popoutIsActive}
        />
        <StartPanelPage2 id="StartPanel-page-2" goToNextSlide={setSlideIndex} />
        <StartPanelPage3 id="StartPanel-page-3" nextView={nextView} />
      </Gallery>

      <div className="StartPanel--button">
        <div className="StartPanel--button_inner">
          {(slideIndex === 2 ? (
            <Button
              size="xl"
              stretched
              mode="commerce"
              onClick={() => {
                Registration();
              }}
            >
              Начать
            </Button>
          )
            : (
              <Button
                className={classNames({ 'StartPanel--content-hidden': (!readyToShow || popoutState.popoutIsActive) })}
                size="xl"
                stretched
                onClick={() => {
                  setSlideIndex(slideIndex + 1);
                }}
                style={{ backgroundColor: (scheme === 'space_gray' ? '#FFFFFF' : '#000000') }}
              >
                Дальше
              </Button>
            ))}
        </div>
      </div>


    </Panel>
  );
};

StartPanel.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
  popoutState: PropTypes.shape({
    popoutIsActive: PropTypes.bool,
    setPopoutIsActive: PropTypes.func,
  }).isRequired,
};

export default StartPanel;
