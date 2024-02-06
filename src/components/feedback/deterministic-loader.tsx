import { Backdrop, LinearProgress, Stack } from '@mui/material';
import React from 'react';

interface DeterministicLoaderProps extends React.PropsWithChildren {
  showLoading: boolean;
  secondaryLoader?: boolean;
  primaryProgress?: number;
  secondaryProgress?: number;
  loadingText?: string;
}

export function DeterministicLoader(props: DeterministicLoaderProps) {
  return (
    <>
      <Backdrop
        sx={{ color: '#ffff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={props.showLoading}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <Stack sx={{ width: '50%' }} spacing={2}>
          <span className="text-center">{props.loadingText}</span>
          <LinearProgress color="inherit" variant="determinate" value={props.primaryProgress} />
          {props.secondaryLoader && (
            <LinearProgress color="inherit" variant="determinate" value={props.secondaryProgress} />
          )}
        </Stack>
      </Backdrop>
    </>
  );
}
