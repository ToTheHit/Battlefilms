import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './workViewModal.css';
import {
  FormLayout, ModalCard, ModalRoot, Textarea,
} from '@vkontakte/vkui';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import globalVariables from '../../GlobalVariables';

const WorkViewModal = (props) => {
  const { nextView } = props;
  const modalIsActive = useSelector((state) => state.workViewModal.modalIsActive);
  const questionsLength = useSelector((state) => state.workViewModal.questionsLength);
  const answersLength = useSelector((state) => state.quiz.quizResult.length);
  const reportQuestionID = useSelector((state) => state.quiz.reportQuestionID);
  const userToken = useSelector((state) => state.userToken.token);

  const dispatch = useDispatch();
  const [buttonTitle, setButtonTitle] = useState('Продолжить');
  const [modalText, setModalText] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportContentError, setReportContentError] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    setReportContentError(false);
  }, [reportContent]);

  useEffect(() => {
    setReportContent('');
  }, [reportQuestionID]);

  useEffect(() => {
    if (answersLength > 0) {
      setButtonTitle('Готов');
    } else setButtonTitle('Начать');
  }, [answersLength]);

  useEffect(() => {
    if (answersLength === 0) {
      setModalText(`${questionsLength} вопросов из разных тем. 20 секунд на один вопрос.\n Вы готовы?`);
    } else {
      setModalText(`Вы ответили на ${answersLength} из ${questionsLength - 1} вопросов.\n Вы готовы продолжить?`);
    }
  }, [answersLength, questionsLength]);

  function closeModal(isStart) {
    setReportSent(false);
    dispatch({
      type: 'UPDATE_WORK-VIEW-MODAL',
      payload: {
        modalIsActive: false,
        start: isStart,
      },
    });
  }

  function closeReportModal(send) {
    if (send) {
      const urlParams = new URLSearchParams(window.location.search);
      // console.info(`Send report for question ${reportQuestionID}`);
      // console.info('Report text: ', reportContent);
      // console.info('User token:', userToken);
      if (reportContent.length === 0) {
        setReportContentError(true);
      } else {
        const data = {
          questionID: reportQuestionID,
          reportText: reportContent,
        };
        axios.post(`${globalVariables.serverURL}/api/reportQuestion`, data, {
          params: {
            id: urlParams.get('vk_user_id'),
          },
          headers: {
            'X-Access-Token': userToken,
          },
        })
          .catch((error) => {
            console.info('Erorr: /api/reportQuestion', error);
          });

        dispatch({
          type: 'UPDATE_QUIZ_RESULT',
          payload: {
            confirmReportByQuestionID: reportQuestionID,
          },
        });
        setReportSent(true);
        /*        dispatch({
          type: 'UPDATE_WORK-VIEW-MODAL',
          payload: {
            modalIsActive: false,
          },
        }); */
      }
    } else {
      dispatch({
        type: 'UPDATE_WORK-VIEW-MODAL',
        payload: {
          modalIsActive: false,
        },
      });
    }
  }

  function getActiveModal() {
    if (modalIsActive && reportQuestionID) {
      dispatch({
        type: 'UPDATE_WORK-VIEW-MODAL',
        payload: {
          isStartModal: false,
        },
      });

      if (reportSent) return 'Work--reportSent';
      return 'Work--report';
    }
    if (modalIsActive && questionsLength > 0) {
      dispatch({
        type: 'UPDATE_WORK-VIEW-MODAL',
        payload: {
          isStartModal: true,
        },
      });
      return 'Work--readyCheck';
    }
    return null;
  }

  return (
    <ModalRoot
      activeModal={getActiveModal()}
      onClose={() => closeModal()}
    >
      <ModalCard
        id="Work--readyCheck"
        icon={<Icon56ErrorOutline style={{ transform: 'rotate(180deg)' }} />}
        header={modalText}
        actions={[
          {
            title: 'Отложить',
            mode: 'secondary',
            action: () => {
              closeModal(false);
              nextView(globalVariables.view.main);
            },
          },
          {
            title: buttonTitle,
            mode: 'primary',
            action: () => closeModal(true),
          },
        ]}
        onClose={() => closeModal(true)}
      />

      <ModalCard
        id="Work--report"
        header="Плохой вопрос"
        actions={[
          {
            title: 'Отмена',
            mode: 'secondary',
            action: () => {
              closeReportModal(false);
            },
          },
          {
            title: 'Отправить',
            mode: 'primary',
            action: () => closeReportModal(true),
          },
        ]}
        onClose={() => closeReportModal(false)}
      >
        <FormLayout className="WorkView__modal--report__form">
          <Textarea
            top="Почему вопрос некорректен?"
            onChange={(e) => setReportContent(e.target.value)}
            status={(reportContentError && 'error')}
            bottom={(reportContentError && 'Нельзя отправить пустое сообщение')}
          />
        </FormLayout>
      </ModalCard>


      <ModalCard
        id="Work--reportSent"
        icon={<Icon56CheckCircleOutline />}
        actions={[
          {
            title: 'Закрыть',
            mode: 'secondary',
            action: () => closeModal(true),
          },
        ]}
        onClose={() => closeModal(true)}
      >
        <div style={{ textAlign: 'center' }}>
          Благодарим за обращение. Мы рассмотрим его в ближайшее время.
        </div>
      </ModalCard>

    </ModalRoot>
  );
};

WorkViewModal.propTypes = {
  nextView: PropTypes.func.isRequired,
};
WorkViewModal.defaultProps = {};
export default WorkViewModal;
