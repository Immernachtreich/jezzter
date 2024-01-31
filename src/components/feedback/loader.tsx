import { Backdrop, LinearProgress, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface LoaderProps extends React.PropsWithChildren {
  showLoading: boolean;
}

export function Loader(props: LoaderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => setIsLoading(props.showLoading), [props.showLoading]);

  return (
    <>
      <Backdrop
        sx={{ color: '#ffff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isLoading}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <Stack sx={{ width: '50%' }} spacing={2}>
          <span className="text-center">Loading..</span>
          <LinearProgress color="inherit" />
        </Stack>
      </Backdrop>
    </>
  );
}
