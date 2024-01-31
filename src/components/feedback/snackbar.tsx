import { Snackbar } from '@mui/material';

export function MessageSnackbar() {
  return <Snackbar open={true} autoHideDuration={6000} message="Note archived" />;
}
