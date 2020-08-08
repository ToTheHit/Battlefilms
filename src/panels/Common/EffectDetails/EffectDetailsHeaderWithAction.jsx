import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24DismissDark from '@vkontakte/icons/dist/24/dismiss_dark';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

import {
  ANDROID,
  IOS,
  ModalPageHeader,
  PanelHeaderButton,
  usePlatform,
  Button,
} from '@vkontakte/vkui';

const EffectDetailsHeaderWithAction = (props) => {
  const platform = usePlatform();
  const {
    setIsActive, text, action, actionTextInit, actionTextEnd,
  } = props;
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <ModalPageHeader
      left={(
        <>
          {platform === ANDROID
          && (
            <PanelHeaderButton onClick={() => setIsActive(false)}>
              <Icon24Cancel />
            </PanelHeaderButton>
          )}
          {platform === IOS
          && (
            <PanelHeaderButton onClick={() => setIsActive(false)}>
              <Icon24Dismiss />
            </PanelHeaderButton>
          )}
        </>
      )}
      right={(
        <PanelHeaderButton
          onClick={() => {
            action(!isEditMode);
            setIsEditMode(((prevState) => !prevState));
          }}
        >
          Изменить
        </PanelHeaderButton>
      )}
    >
      {text}
    </ModalPageHeader>
  );
};


/*<Button
  mode="tertiary"
  onClick={() => {
    action(!isEditMode);
    setIsEditMode(((prevState) => !prevState));
  }}
>
  {isEditMode ? actionTextEnd : actionTextInit}
</Button>*/
EffectDetailsHeaderWithAction.propTypes = {
  setIsActive: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  actionTextInit: PropTypes.string.isRequired,
  actionTextEnd: PropTypes.string,
};
EffectDetailsHeaderWithAction.defaultProps = {
  actionTextEnd: '',
};
export default EffectDetailsHeaderWithAction;
