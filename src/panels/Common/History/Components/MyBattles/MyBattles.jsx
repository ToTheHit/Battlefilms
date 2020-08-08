import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './myBattles.css';
import { SimpleCell, Avatar, Footer, Button } from '@vkontakte/vkui';
import globalVariables from "../../../../../GlobalVariables";

const MyBattles = (props) => {
  const {setActivePanel} = props;
  const myBattles = [
    {
      author: 'Тест1',
      authorPhoto: '',
      name: 'Первая битва',
    },
    {
      author: 'Тест2',
      authorPhoto: '',
      name: 'Вторая битва',
    },
  ];

  function getCorrectWordBattles(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['битве', 'битвах', 'битвах'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  const renderedBattles = useMemo(() => {
    const temp = myBattles.map((item) => (
      <SimpleCell
        key={`MyBattles__${item.author}__${item.name}`}
        onClick={() => setActivePanel(globalVariables.commonView.panels.battleParticipant)}
        before={(
          <Avatar
            size={48}
            src={item.authorPhoto}
          />
        )}
        description={item.author}
        expandable
      >
        {item.name}
      </SimpleCell>
    ));
    temp.push(
      <Footer
        key={'MyBattles__footer'}
      >
        {`Вы участвуете в ${myBattles.length} ${getCorrectWordBattles(myBattles.length)}`}
      </Footer>,
    );
    return temp;
  }, [myBattles]);

  return (
    <div className="MyBattles">
      {renderedBattles}
    </div>
  );
};

MyBattles.propTypes = {
  setActivePanel: PropTypes.func.isRequired,
};
MyBattles.defaultProps = {};
export default MyBattles;
