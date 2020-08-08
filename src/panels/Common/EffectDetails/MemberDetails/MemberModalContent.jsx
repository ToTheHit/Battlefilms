import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './memberModalContent.css';
import { Avatar, Cell, Footer } from '@vkontakte/vkui';

const MemberModalContent = (props) => {
  const { isRemovalMode } = props;
  const [members, setMembers] = useState([
    {
      first_name: 'Первый',
      last_name: 'Участник',
      photo: '',
    },
    {
      first_name: 'Второй',
      last_name: 'Участник',
      photo: '',
    },
    {
      first_name: 'Третий',
      last_name: 'Участник',
      photo: '',
    }
  ]);
  function getCorrectWordMembers(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['участник', 'участника', 'участников'][(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
  }

  const membersMemo = useMemo(() => members.map((item) => (
    <Cell
      key={Math.random()}
      removable={isRemovalMode}
      before={(
        <Avatar
          size={40}
          src={item.photo}
        />
        )}
    >
      <span>{item.first_name}</span>
      {' '}
      <span style={{ fontWeight: 500 }}>{item.last_name}</span>
    </Cell>
  )), [members, isRemovalMode]);

  return (
    <div className="MemberModalContent">
      {membersMemo}

      <Footer>
        {`${members.length} ${getCorrectWordMembers(membersMemo.length)}`}
      </Footer>
    </div>
  );
};

MemberModalContent.propTypes = {
  isRemovalMode: PropTypes.bool.isRequired,
};
MemberModalContent.defaultProps = {};
export default MemberModalContent;
