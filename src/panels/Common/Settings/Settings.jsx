import React from 'react';
import PropTypes from 'prop-types';
import './settings.css';
import {
  Button,
  Caption,
  Checkbox,
  FormLayout, Input, Panel, PanelHeader, PanelHeaderBack, Select,
} from '@vkontakte/vkui';
import globalVariables from '../../../GlobalVariables';

const Settings = (props) => {
  const { id, setActivePanel } = props;
  return (
    <Panel
      id={id}
      className="Settings"
    >
      <PanelHeader
        left={(
          <PanelHeaderBack
            label="Назад"
            onClick={() => setActivePanel(globalVariables.commonView.panels.main)}
          />
        )}
      >
        Настройки битвы
      </PanelHeader>
      <FormLayout>
        <Input type="text" top="Название" />

        <Select top="Ограничение по фильмам">
          <option value={1}>1 фильм / человек</option>
          <option value={2}>2 фильма / человек</option>
          <option value={3}>3 фильма / человек</option>
          <option value={4}>4 фильма / человек</option>
          <option value={5}>5 фильмов / человек</option>
        </Select>

        <Select top="Тип битвы">
          <option value={1}>Обычная</option>
          <option value={2}>Быстрая</option>
        </Select>

        <Select top="Количество победителей">
          <option value={1}>1 фильм</option>
          <option value={2}>2 фильма</option>
          <option value={3}>3 фильма</option>
          <option value={4}>4 фильма</option>
          <option value={5}>5 фильмов</option>
        </Select>

        <Checkbox
          bottom={(
            <Caption
              level="1"
              weight="regular"
            >
              Позволить пользователям добавлять одинаковые фильмы,
              чтобы увеличивать шанс их победы в битве.
            </Caption>
          )}
        >
          Разрешить повторения
        </Checkbox>
      </FormLayout>
      <Button className="Settings__delete" mode="tertiary">Очистить битву</Button>
    </Panel>
  );
};

Settings.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
};
Settings.defaultProps = {};
export default Settings;
