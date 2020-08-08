import React from 'react';
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
} from '@vkontakte/vkui';

const EffectDetailsHeader = (props) => {
  const platform = usePlatform();
  const { setIsActive, text } = props;

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
        </>
      )}
      right={(
        <>
          {platform === IOS
          && (
            <PanelHeaderButton onClick={() => setIsActive(false)}>
              <Icon24Dismiss />
            </PanelHeaderButton>
          )}
        </>
      )}
    >
      {text}
    </ModalPageHeader>
  );
};

EffectDetailsHeader.propTypes = {
  setIsActive: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
EffectDetailsHeader.defaultProps = {};
export default EffectDetailsHeader;
