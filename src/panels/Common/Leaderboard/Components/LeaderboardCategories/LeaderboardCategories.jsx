import React, { useEffect, useRef, useState } from 'react';
import './leaderboardCategories.css';
import PropTypes from 'prop-types';
import {
  Avatar,
  Caption,
  Div,
  Group,
  Header,
  PanelSpinner,
  SimpleCell,
  Title,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import axios from 'axios';
import globalVariables from '../../../../../GlobalVariables';
import Icon64Math from '../../../../../assets/Icons/icn64_math.png';
import Icon64Russian from '../../../../../assets/Icons/icn64_rus.png';
import Icon64Litra from '../../../../../assets/Icons/icn64_litra.png';
import Icon64Physics from '../../../../../assets/Icons/icn64_physics.png';
import Icon64Chemistry from '../../../../../assets/Icons/icn64_chem.png';
import Icon64Astro from '../../../../../assets/Icons/icn64_astro.png';
import Icon64Biology from '../../../../../assets/Icons/icn64_bio.png';
import Icon64History from '../../../../../assets/Icons/icn64_history.png';
import Icon64Art from '../../../../../assets/Icons/icn64_art.png';
import Icon64Sport from '../../../../../assets/Icons/icn64_sport.png';
import Icon64Other from '../../../../../assets/Icons/icn64_other.png';
import Icon64Geography from '../../../../../assets/Icons/icn64_geography.png';

const LeaderboardCategories = (props) => {
  const { setShowSnackbar } = props;
  const [spinnerIsActive, setSpinnerIsActive] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const userQuestions = useSelector((state) => state.userQuestions.questions.All);
  const scrollListener = useSelector((state) => state.scrollTo);
  const contentRef = useRef(null);

  useEffect(() => {
    if (scrollListener.scrollableElement === globalVariables.commonView.roots.leaderboard) {
      contentRef.current.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollListener]);

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

  function getCorrectWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['вопрос', 'вопроса', 'вопросов'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  useEffect(() => {
    axios.get(`${globalVariables.serverURL}/api/getCategoriesState`)
      .then((data) => {
        const sortedQuestions = {};
        for (let i = 0; i < userQuestions.length; i += 1) {
          if (!sortedQuestions[userQuestions[i].category]) {
            sortedQuestions[userQuestions[i].category] = 0;
          }
          if (userQuestions[i].approved) {
            sortedQuestions[userQuestions[i].category] += 1;
          }
        }
        // console.info(sortedQuestions);

        const rendered = data.data.map((category) => {
          const leaders = category.leaders.map((leader) => {
            const badgeColor = '#5856D6';
            return (
              <a
                key={`Category-${category.name}_leader-${leader.user_id}`}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://vk.com/id${leader.user_id}`}
              >
                <SimpleCell
                  className="LeaderboardCategories__Category--leader"
                  before={(
                    <Avatar size={48} src={leader.photo} />
                  )}
                  description={(
                    <div
                      className="LeaderboardCategories__Category--leader_description"
                    >
                      {`${leader.categoryQuestionsCount} ${getCorrectWord(leader.categoryQuestionsCount)}`}
                    </div>
                  )}
                >
                  {`${leader.first_name} ${leader.last_name}`}
                </SimpleCell>
              </a>
            );
          });
          if (leaders.length === 0) return null;
          return (
            <Group
              key={`[Leaderborard_Category-${category.name}`}
              separator="auto"
              header={(
                <Div
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  <SimpleCell
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    disabled
                    before={(
                      <div
                        className="LeaderboardCategories--icon"
                        style={{ backgroundImage: `url(${getIcon(category.name)}` }}
                      />
                    )}
                  >
                    <div className="LeaderboardCategories__Category--header">
                      <Title level="3" weight="semibold">
                        {`${globalVariables.translateEnToRu(category.name)}`}
                      </Title>
                      {/*                      <Caption
                        className="LeaderboardCategories__Category--header-counter"
                        level="1"
                        weight="regular"
                      >
                        {`${category.count} ${getCorrectWord(category.count)}`}
                      </Caption> */}
                    </div>
                  </SimpleCell>
                </Div>
              )}
              description={(
                <Caption level="2">
                  {sortedQuestions[category.name]
                    ? `Вы задали ${(sortedQuestions[category.name] ? sortedQuestions[category.name] : 0)} ${getCorrectWord((sortedQuestions[category.name] ? sortedQuestions[category.name] : 0))} в этой категории`
                    : 'Вы не задали ни одного вопроса'}
                </Caption>
              )}
            >
              {leaders}
            </Group>
          );
        });
        setSpinnerIsActive(false);
        setLeaderboard(rendered);
      })
      .catch((err) => {
        // setSpinnerIsActive(false);
        setShowSnackbar(true);
        console.info('LeaderboardCategories, GET api/getCategoriesState', err);
      });
  }, []);
  return (
    <div ref={contentRef} style={{ paddingTop: 0 }} className="LeaderboardCategories">

      <Header
        subtitle="Станьте мозгополистом, покупая вопросы в магазине. Мозгополию можно составить из трёх вопросов одинаковой категории."
      />
      {spinnerIsActive && <PanelSpinner size="small" />}
      {leaderboard}
    </div>
  );
};

LeaderboardCategories.propTypes = {
  setShowSnackbar: PropTypes.func.isRequired,
};
LeaderboardCategories.defaultProps = {};
export default LeaderboardCategories;
