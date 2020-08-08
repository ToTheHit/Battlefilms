import React from 'react';
import './effectTaxDetailsContent.css';
import { Cell } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';

const EffectTaxDetailsContent = () => {
  const tax = useSelector((state) => state.userInfo.tax);
  return (
    <div className="EffectTaxDetailsContent">
      <Cell
        multiline
        description={(`Мозговой налог списывается с Вашего счета в размере ${tax} монет, каждые два часа. Прохождение мозгового отчета позволяет Вам не платить налог. Включите напоминания об отчётах в главном меню.`)}
      />
    </div>
  );
};

EffectTaxDetailsContent.propTypes = {};
EffectTaxDetailsContent.defaultProps = {};
export default EffectTaxDetailsContent;
