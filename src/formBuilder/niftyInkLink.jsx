import React from 'react';

import GenericInput from './genericInput';

const NiftyInkLinkInput = props => {
  return <GenericInput {...props} prepend='https://////' />;
};
export default NiftyInkLinkInput;
