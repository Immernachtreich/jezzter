import { Snackbar } from '@mui/material';
import { useEffect } from 'react';

export interface MessageSnackbarProps extends React.PropsWithChildren {
  message: string;
  timeout?: number;
  open?: boolean;
  onClose?: () => void;
}

export function MessageSnackbar(props: MessageSnackbarProps) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={props.open}
      autoHideDuration={props.timeout}
      message={props.message}
      onClose={props.onClose}
    />
  );
}
