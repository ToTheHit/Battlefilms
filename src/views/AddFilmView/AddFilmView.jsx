import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ScreenSpinner, View } from '@vkontakte/vkui';
import AddFilm from '../../panels/AddFilm/AddFilm';

const AddFilmView = (props) => {
  const { id, nextView } = props;
  const [AddFilmPopoutView, setAddFilmPopoutView] = useState(false);

  return (
    <View
      id={id}
      activePanel="AddFilmPanel"
      className="AddFilmView"
    >
      <AddFilm
        id="AddFilmPanel"
        nextView={nextView}
        popout={(AddFilmPopoutView && (<ScreenSpinner />))}
        setAddFilmPopoutView={setAddFilmPopoutView}
      />
    </View>
  );
};

AddFilmView.propTypes = {
  id: PropTypes.string.isRequired,
  nextView: PropTypes.func.isRequired,
};
AddFilmView.defaultProps = {};
export default AddFilmView;
