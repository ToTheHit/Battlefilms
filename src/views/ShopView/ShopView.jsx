import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScreenSpinner, View } from '@vkontakte/vkui';
import Shop from '../../panels/Common/Shop/Shop';
import ShopQuestion from '../../panels/Common/Shop/ShopQuestion';

const ShopView = (props) => {
  const { id, setActiveStory } = props;
  const [activePanel, setActivePanel] = useState('Shop');
  const [questionData, setQuestionData] = useState({});
  const [popoutShopView, setPopoutShopView] = useState(true);

  useEffect(() => {
    if (activePanel === 'Shop') setPopoutShopView(true);
  }, [activePanel]);

  return (
    <View className="ShopView" activePanel={activePanel} id={id} popout={(popoutShopView && (<ScreenSpinner />))}>
      <Shop
        id="Shop"
        setActivePanel={setActivePanel}
        setQuestionData={setQuestionData}
        setPopoutShopView={setPopoutShopView}
        popoutShopView={popoutShopView}
        setActiveStory={setActiveStory}
      />
      <ShopQuestion id="ShopQuestion" questionData={questionData} setActivePanel={setActivePanel} />
    </View>
  );
};

ShopView.propTypes = {
  id: PropTypes.string.isRequired,
  setActiveStory: PropTypes.func.isRequired,
};
ShopView.defaultProps = {};
export default ShopView;
