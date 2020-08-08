import React from 'react';
import PropTypes from 'prop-types';
import './memberModalContent.css';
import { Avatar, Cell, Footer } from '@vkontakte/vkui';

const MemberModalContent = (props) => {
  const { isRemovalMode } = props;
  function getCorrectWordMembers(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['участник', 'участника', 'участников'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  return (
    <div className="MemberModalContent">
      <Cell
        removable={isRemovalMode}
        before={<Avatar size={40} src="https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1" />}
      >
        Чел челов
      </Cell>
      <Cell
        removable={isRemovalMode}
        before={<Avatar size={40} src="https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1" />}
      >
        Чел челов
      </Cell>
      <Cell
        removable={isRemovalMode}
        before={<Avatar size={40} src="https://sun1-86.userapi.com/impf/c840222/v840222319/8a733/I7rD4NcI9N0.jpg?size=100x0&quality=90&crop=0,0,200,200&sign=b030c22785d59c8499f7c7985eabe4e4&ava=1" />}
      >
        Чел челов
      </Cell>

      <Footer>
        {`4 ${getCorrectWordMembers(4)}`}
      </Footer>
    </div>
  );
};

MemberModalContent.propTypes = {
  isRemovalMode: PropTypes.bool.isRequired,
};
MemberModalContent.defaultProps = {};
export default MemberModalContent;
