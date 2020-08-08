import React from 'react';
import PropTypes from 'prop-types';
import { Button, SimpleCell, Tooltip } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import globalVariables from '../../../../GlobalVariables';
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

const RenderedCategories = (props) => {
  const { categories, checkBalance } = props;
  const dispatch = useDispatch();
  const tooltipState = useSelector((state) => state.tooltip.shop);

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


  function onCloseTooltipBalance() {
    dispatch({
      type: 'TOOLTIP_UPDATE',
      payload: {
        shop: false,
      },
    });
  }

  return (
    categories.map((item, index) => (
      <SimpleCell
        key={`ShopItem_${item._id}`}
        className="Shop--item"
        disabled
        after={(
          <Tooltip
            text="Покупая вопрос, Вы увеличиваете ежедневный прирост очков гения и доход монет."
            alignX="right"
            isShown={tooltipState && (index === 0)}
            onClose={onCloseTooltipBalance}
          >
            <Button
              mode="secondary"
              onClick={() => {
                checkBalance(item.name, item.price);
              }}
            >
              {`${item.price} монет`}
            </Button>
          </Tooltip>
        )}
        before={(
          <div className="Shop--iconOuter">
            <div className="Shop--icon" style={{ backgroundImage: `url(${getIcon(item.name)})` }} />
          </div>
        )}
      >
        {globalVariables.translateEnToRu(item.name)}
      </SimpleCell>
    )));
};

RenderedCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  checkBalance: PropTypes.func.isRequired,
};
RenderedCategories.defaultProps = {
  categories: [],
};
export default RenderedCategories;
