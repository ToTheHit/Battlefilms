import React from 'react';
import PropTypes from 'prop-types';
import './effectMindopolistDetails.css';
import { useSelector } from 'react-redux';
import { Cell, Div, SimpleCell, withModalRootContext, } from '@vkontakte/vkui';
import Icon64Math from '../../../../assets/Icons/icn64_math.png';
import Icon64Russian from '../../../../assets/Icons/icn64_rus.png';
import Icon64Litra from '../../../../assets/Icons/icn64_litra.png';
import Icon64Physics from '../../../../assets/Icons/icn64_physics.png';
import Icon64Chemistry from '../../../../assets/Icons/icn64_chem.png';
import Icon64Astro from '../../../../assets/Icons/icn64_astro.png';
import Icon64Biology from '../../../../assets/Icons/icn64_bio.png';
import Icon64History from '../../../../assets/Icons/icn64_history.png';
import Icon64Art from '../../../../assets/Icons/icn64_art.png';
import Icon64Sport from '../../../../assets/Icons/icn64_sport.png';
import Icon64Other from '../../../../assets/Icons/icn64_other.png';
import Icon64Geography from '../../../../assets/Icons/icn64_geography.png';
import globalVariables from '../../../../GlobalVariables';

const EffectMindopolistDetails = (props) => {
  const { updateModalHeight } = props;

  const leadsCategories = useSelector((state) => state.userInfo.leads);

  function getIcon(category) {
    switch (category) {
      case 'Math':
        return Icon64Math;
      case 'Russian':
        return Icon64Russian;
      case 'Literature':
        return Icon64Litra;
      case 'Physics':
        return Icon64Physics;
      case 'Chemistry':
        return Icon64Chemistry;
      case 'Astronomy':
        return Icon64Astro;
      case 'Biology':
        return Icon64Biology;
      case 'History':
        return Icon64History;
      case 'Art':
        return Icon64Art;
      case 'Sport':
        return Icon64Sport;
      case 'Other':
        return Icon64Other;
      case 'Geography':
        return Icon64Geography;
      default:
        return '';
    }
  }

  function getWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    const word = ['вопрос', 'вопроса', 'вопросов'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
    return word;
  }

  return (
    <div className="EffectMindopolistDetails">
      <Cell
        multiline
        description="Поздравляем! Вы стали мозгополистом. Теперь доход за показ Ваших вопросов увеличен на 20%, в категориях, где Вы мозгополист."
      />
      <Div style={{ paddingTop: '0px' }}>
        {(leadsCategories.map((item) => (
          <SimpleCell
            key={`EffectMindopolistDetails__category-${item.category}`}
            disabled
            className="EffectMindopolistDetails--itemIncome"
            before={(
              <div
                className="EffectMindopolistDetails--icon"
                style={{ backgroundImage: `url(${getIcon(item.category)})` }}
              />
            )}
            indicator={`${item.questionsCount} ${getWord(item.questionsCount)}`}
          >
            {globalVariables.translateEnToRu(item.category)}
          </SimpleCell>
        )))}
      </Div>
    </div>
  );
};

EffectMindopolistDetails.propTypes = {
  updateModalHeight: PropTypes.func,
};
EffectMindopolistDetails.defaultProps = {
  updateModalHeight: () => {
  },
};
export default withModalRootContext(EffectMindopolistDetails);
