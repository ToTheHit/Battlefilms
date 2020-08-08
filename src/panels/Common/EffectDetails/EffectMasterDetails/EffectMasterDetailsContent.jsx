import React from 'react';
import { Div, Text } from '@vkontakte/vkui';
import Icon56LikeOutline from '@vkontakte/icons/dist/56/like_outline';

const EffectMasterDetailsContent = () => (
  <Div className="EffectMasterDetailsContent">
    <Text weight="regular">
      Главная цель Мозгополии — позволить людям обмениваться знаниями.
      Вы загружаете интересные вопросы и мы решили это отметить.
      Теперь в таблице лидеров рядом с Вашим фото будет выводиться маркер Магистра.
      Спасибо за Ваши старания!
    </Text>
    <Icon56LikeOutline
      width={56}
      height={56}
      style={{
        color: '#FF0000', margin: 'auto', marginBottom: '20px', marginTop: '10px',
      }}
    />
  </Div>
);

EffectMasterDetailsContent.propTypes = {};
EffectMasterDetailsContent.defaultProps = {};
export default EffectMasterDetailsContent;
