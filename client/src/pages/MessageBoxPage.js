import React from 'react';
import Typography from '@material-ui/core/Typography';

import MessageBox from '../components/MessageBox';

export const MessageBoxPage = (props) => {
  return (
    <div>
      <Typography>Message Box</Typography>
      <MessageBox />
    </div>
  )
}

export default MessageBoxPage;