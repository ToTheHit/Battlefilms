import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './shopResult.css';
import {
  Button,
  Group,
  IOS, Panel, PanelHeader, PanelHeaderBack, Placeholder, Snackbar, usePlatform,
} from '@vkontakte/vkui';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import { useSelector } from 'react-redux';
import globalVariables from '../../../GlobalVariables';
import bridge from "@vkontakte/vk-bridge";

const ShopResult = (props) => {
  const {
    id, resultType, questionData, setActivePanel, setShopResultType,
  } = props;
  const platform = usePlatform();
  const [showSnackbar, setShowSnackbar] = useState({ state: false, msg: '' });
  const userBalance = useSelector((state) => state.userInfo.coins.overall);
  const unapprovedQuestions = useSelector((state) => state.userQuestions.unapprovedQuestions);

  useEffect(() => {
    return () => setShopResultType('');
  }, []);
  useEffect(() => {
    if (resultType) {
      if (resultType === 'accepted') {
        bridge.send('VKWebAppTapticNotificationOccurred', { type: 'success' });
      } else bridge.send('VKWebAppTapticNotificationOccurred', { type: 'error' });
    }
  }, [resultType]);
  
  return (
    <Panel id={id}>
      <PanelHeader
        left={(
          <PanelHeaderBack
            label={(platform === IOS && 'Назад')}
            onClick={() => setActivePanel(globalVariables.commonView.panels.shopQuestion)}
          />
        )}
      >
        {globalVariables.translateEnToRu(questionData.category)}
      </PanelHeader>
      {showSnackbar.state && (
        <Snackbar
          duration={2000}
          onClose={() => setShowSnackbar({ state: false, msg: '' })}
          before={(
            <Icon28ErrorOutline height={24} width={24} style={{ color: 'var(--destructive)' }} />
          )}
        >
          {showSnackbar.msg}
        </Snackbar>
      )}

      <Group>
        {(resultType === 'accepted') && (
          <Placeholder
            className="ShopQuestion--placeholder"
            icon={(
              <Icon56CheckCircleOutline
                className="ShopQuestion--placeholder__icon-accepted"
                height={64}
                width={64}
              />
            )}
            action={(
              <div>
                <Button
                  className="ShopQuestion--placeholder__button"
                  mode="secondary"
                  onClick={() => {
                    setActivePanel('Shop');
                  }}
                >
                  В магазин
                </Button>
                <Button
                  className="ShopQuestion--placeholder__button"
                  mode="primary"
                  onClick={() => {
                    if (userBalance >= questionData.price) {
                      if (unapprovedQuestions < globalVariables.maxUnapprovedQuestionCount) {
                        setActivePanel(globalVariables.commonView.panels.shopQuestion);
                      } else {
                        setShowSnackbar({ state: true, msg: 'У Вас слишком много вопросов на рассмотрении.' });
                      }
                    } else {
                      setShowSnackbar({ state: true, msg: 'Вам не хватает монет для покупки еще одного вопроса.' });
                    }
                  }}
                >
                  Купить еще
                </Button>
              </div>
            )}
          >
            Ваш вопрос успешно зарегистрирован и проходит модерацию.
          </Placeholder>
        )}

        {(resultType === 'rejected') && (
          <Placeholder
            className="ShopQuestion--placeholder"
            icon={(
              <Icon28CancelCircleOutline
                className="ShopQuestion--placeholder__icon-rejected"
                height={64}
                width={64}
              />
            )}
            action={(
              <div>
                <Button
                  className="ShopQuestion--placeholder__button"
                  mode="secondary"
                  onClick={() => {
                    // sendQuestion(savedUserQuestion);
                    setActivePanel(globalVariables.commonView.panels.shopQuestion);
                  }}
                >
                  Повторить
                </Button>
              </div>
            )}
          >
            Не удалось зарегистрировать вопрос. Произошла непредвиденная ошибка.
          </Placeholder>
        )}
      </Group>
    </Panel>
  );
};

ShopResult.propTypes = {
  id: PropTypes.string.isRequired,
  resultType: PropTypes.oneOf(['accepted', 'rejected', '']).isRequired,
  questionData: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setShopResultType: PropTypes.func.isRequired,
};
ShopResult.defaultProps = {};
export default ShopResult;
