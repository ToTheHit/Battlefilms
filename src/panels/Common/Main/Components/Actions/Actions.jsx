import React from 'react';
import PropTypes from 'prop-types';
import './actions.css';
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import { classNames, TabbarItem } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch, useSelector } from 'react-redux';
import globalVariables from '../../../../../GlobalVariables';

const Actions = (props) => {
  const { setActivePanel, isOwner } = props;
  const dispatch = useDispatch();
  const notificationsAllow = useSelector((state) => state.notificationsAllow);

  function openModal(name) {
    bridge.send('VKWebAppTapticImpactOccurred', { style: 'light' });
    dispatch({
      type: 'OPEN_MODAL',
      payload: globalVariables.mainViewModal(name),
    });
  }

  function updateNotificationsStatus(status) {
    if (status) {
      bridge.send('VKWebAppAllowNotifications', {})
        .then(() => {
          dispatch({
            type: 'UPDATE_NOTIFICATIONS_ALLOW',
            payload: { isAllow: status },
          });
        })
        .catch(() => {
          dispatch({
            type: 'UPDATE_NOTIFICATIONS_ALLOW',
            payload: { isAllow: false },
          });
        });
    } else {
      bridge.send('VKWebAppDenyNotifications', {});
      dispatch({
        type: 'UPDATE_NOTIFICATIONS_ALLOW',
        payload: { isALlow: false },
      });
    }
  }

  function share() {
    bridge.send('VKWebAppShare', { link: 'https://vk.com/app7556795#hello' });
  }

  return (
    <div className="Actions">
      <TabbarItem
        className="Actions__item"
        text="Поделиться"
        onClick={share}
      >
        <Icon28ShareOutline style={{ color: 'var(--content_placeholder_text)' }} height={28} width={28} />
      </TabbarItem>
      <TabbarItem
        className="Actions__item"
        text="Участники"
        onClick={() => openModal('Members')}
      >
        <Icon28UsersOutline style={{ color: 'var(--content_placeholder_text)' }} height={28} width={28} />
      </TabbarItem>
      {isOwner && (
        <TabbarItem
          className="Actions__item"
          text="Настройки"
          onClick={() => setActivePanel(globalVariables.commonView.panels.settings)}
        >
          <Icon28SettingsOutline style={{ color: 'var(--content_placeholder_text)' }} height={28} width={28} />
        </TabbarItem>
      )}
      {!isOwner && (
        <TabbarItem
          className={classNames('Actions__item', notificationsAllow.isAllow && 'Actions__notifications')}
          text="Уведомления"
          onClick={() => updateNotificationsStatus(!notificationsAllow.isAllow)}
        >
          <Icon28Notifications
            style={{
              // color: (notificationsAllow.isAllow ? 'var(--writebar_icon)' : 'var(--content_placeholder_text)'),
            }}
            height={28}
            width={28}
          />
        </TabbarItem>
      )}
    </div>
  );
};

Actions.propTypes = {
  setActivePanel: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
Actions.defaultProps = {};
export default Actions;
