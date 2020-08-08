import React, { useEffect, useState, useCallback } from 'react';
import {
  ModalPage, ModalRoot, Separator,
} from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import EffectGPDetailsContent from './EffectGPDetails/EffectGPDetailsContent';
import EffectDetailsHeader from './EffectDetailsHeader';
import EffectTaxDetailsContent from './EffectTaxDetails/EffectTaxDetailsContent';
import EffectCoinsDetailsContent from './EffectCoinsDetails/EffectCoinsDetailsContent';
import EffectMindopolistDetails from './EffectMindopolistDetails/EffectMindopolistDetails';
import EffectPioneerDetailsContent from './EffectPioneerDetails/EffectTaxDetailsContent';
import EffectMasterDetailsContent from './EffectMasterDetails/EffectMasterDetailsContent';
import MemberModalContent from './MemberDetails/MemberModalContent';
import EffectDetailsHeaderWithAction from './EffectDetailsHeaderWithAction';

const EffectDetailsSelector = () => {
  const dispatch = useDispatch();
  const mainViewModalName = useSelector((state) => state.mainViewModal.modalName);

  const [isActive, setIsActive] = useState(false);
  const [membersModalRemovalMode, setMembersModalRemovalMode] = useState(false);

  let closedByHardwareBackButton = false;
  const controlHardwareBackButton = useCallback(() => {
    setIsActive(false);
    closedByHardwareBackButton = true;
  }, [setIsActive]);

  useEffect(() => {
    if (!isActive) {
      dispatch({
        type: 'OPEN_MODAL',
        payload: null,
      });
      setMembersModalRemovalMode(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (mainViewModalName) setIsActive(true);
  }, [mainViewModalName]);

  useEffect(() => {
    if (isActive) {
      closedByHardwareBackButton = false;
      window.history.pushState({ page: `EffectDetails_${Math.random()}` }, 'EffectDetails', `${window.location.search}`);
      window.addEventListener('popstate', controlHardwareBackButton);
    } else {
      if (!closedByHardwareBackButton) {
        if (mainViewModalName) {
          window.history.back();
        }
      }
      window.removeEventListener('popstate', controlHardwareBackButton);
    }
  }, [isActive]);


  return (
    <ModalRoot
      activeModal={(isActive ? mainViewModalName : null)}
      onClose={() => {
        setIsActive(false);
      }}
    >
      <ModalPage
        id="TaxDetailsModalPage"
        header={<EffectDetailsHeader setIsActive={setIsActive} text="Мозговой налог" />}
      >
        <Separator wide />
        <EffectTaxDetailsContent />
      </ModalPage>

      <ModalPage
        id="GPDetailsModalPage"
        header={<EffectDetailsHeader setIsActive={setIsActive} text="Прибыль GP" />}
        dynamicContentHeight
      >
        <Separator wide />
        <EffectGPDetailsContent status={{
          isActive,
          setIsActive,
        }}
        />
      </ModalPage>

      <ModalPage
        id="CoinsDetailsModalPage"
        header={<EffectDetailsHeader setIsActive={setIsActive} text="Дневной доход" />}
        dynamicContentHeight
      >
        <Separator wide />
        <EffectCoinsDetailsContent />
      </ModalPage>

      <ModalPage
        id="MindopolistDetailsModalPage"
        header={<EffectDetailsHeader setIsActive={setIsActive} text="Мозгополист" />}
        dynamicContentHeight
      >
        <Separator wide />
        <EffectMindopolistDetails />
      </ModalPage>

      <ModalPage id="PioneerModalPage" header={<EffectDetailsHeader setIsActive={setIsActive} text="Первопроходец" />}>
        <Separator wide />
        <EffectPioneerDetailsContent />
      </ModalPage>

      <ModalPage id="MasterModalPage" header={<EffectDetailsHeader setIsActive={setIsActive} text="Магистр" />}>
        <Separator wide />
        <EffectMasterDetailsContent />
      </ModalPage>

      <ModalPage
        id="MembersModalPage"
        header={(
          <EffectDetailsHeaderWithAction
            setIsActive={setIsActive}
            text="Участники"
            settlingHeight={100}
            action={(status) => { setMembersModalRemovalMode(status); }}
            actionTextInit="Изменить"
            actionTextEnd="Готово"
          />
      )}
      >
        <Separator />
        <MemberModalContent
          isRemovalMode={membersModalRemovalMode}
        />
      </ModalPage>

    </ModalRoot>

  );
};

EffectDetailsSelector.propTypes = {};
EffectDetailsSelector.defaultProps = {};
export default EffectDetailsSelector;
