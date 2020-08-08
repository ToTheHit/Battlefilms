import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './shop.css';
import {
  Div, Group, Header, Panel, PanelHeader, Snackbar,
} from '@vkontakte/vkui';

import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import globalVariables from '../../../GlobalVariables';
import RenderedCategories from './Components/RenderedCategories';


const Shop = (props) => {
  const {
    id, setActivePanel, setQuestionData, setPopoutShopView,
    popoutShopView, setActiveStory,
    nextView,
  } = props;
  const pageCache = useSelector((state) => state.pageCache.shop);
  const [categories, setCategories] = useState(pageCache);

  const [showSnackbar, setShowSnackbar] = useState({ state: false, msg: '' });
  const userBalance = useSelector((state) => state.userInfo.coins.overall);
  const unapprovedQuestions = useSelector((state) => state.userQuestions.unapprovedQuestions);
  const scrollListener = useSelector((state) => state.scrollTo);
  const dispatch = useDispatch();

  const controlHardwareBackButton = useCallback(() => {
    setActiveStory(globalVariables.commonView.roots.main);
  }, []);

  useEffect(() => {
    // Алгоритм для обработки аппаратной кнопки "Назад" на андроидах
    if (window.history.state) {
      window.history.replaceState({ page: 'Shop' }, 'Shop', `${window.location.search}`);
    } else {
      window.history.pushState({ page: 'Shop' }, 'Shop', `${window.location.search}`);
    }
    window.addEventListener('popstate', controlHardwareBackButton);
    return () => {
      window.removeEventListener('popstate', controlHardwareBackButton);
    };
  }, []);

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.shop) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollListener]);

  const checkBalance = useCallback((category, price) => {
    if (userBalance >= price) {
      if (unapprovedQuestions < globalVariables.maxUnapprovedQuestionCount) {
        setQuestionData({ category, price });
        setActivePanel('ShopQuestion');
      } else {
        setShowSnackbar({ state: true, msg: 'У Вас слишком много вопросов на рассмотрении.' });
      }
    } else {
      setShowSnackbar({ state: true, msg: 'Вам не хватает монет для покупки этого вопроса.' });
    }
  }, [setActivePanel, setQuestionData, userBalance]);


  useEffect(() => {
    axios.get(`${globalVariables.serverURL}/api/getCategoriesState`)
      .then((data) => {
        setCategories(data.data);
        dispatch({
          type: 'PAGE_CACHE',
          payload: { shop: data.data },
        });
        setPopoutShopView(false);
      })
      .catch((err) => {
        console.info('Main, get/userQuestions', err);
        if (!err.response) {
          // nextView(globalVariables.view.start);
          nextView(globalVariables.view.connectionLost);
        }
      });
  }, []);

  return (
    <Panel id={id} className="Shop">
      <PanelHeader>
        Магазин
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

      {!popoutShopView && (
        <Group
          header={(
            <Header
              subtitle="Чем больше вопросов в категории, тем выше их цена. Однако, дешёвые вопросы более востребованы и принесут больше GP."
            >
              Вопросы
            </Header>
          )}
        >
          <div style={{ paddingTop: '4px' }}>
            <RenderedCategories checkBalance={checkBalance} categories={categories} />
          </div>
        </Group>
      )}
    </Panel>
  );
};

Shop.propTypes = {
  id: PropTypes.string.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  setPopoutShopView: PropTypes.func.isRequired,
  popoutShopView: PropTypes.bool.isRequired,
  setActiveStory: PropTypes.func.isRequired,
  nextView: PropTypes.func.isRequired,
};
Shop.defaultProps = {};
export default Shop;
