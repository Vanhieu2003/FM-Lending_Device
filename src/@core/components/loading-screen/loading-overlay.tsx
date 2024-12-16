'use client';

import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

const BoxOverlay = styled(Box)(({ theme }) => ({
  backgroundColor: 'grey',
  position: 'fixed',
  width: '100%',
  height: '100%',
  zIndex: 2002,
  top: '0px',
  left: '0px',
  opacity: 0.5,
}));

const LoadingCustom = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: '45%',
  left: '49%',
  // transform: 'translate(-50%, -50%)',
  zIndex: 2003,
}));

// handle loading
const loadingSubject = new BehaviorSubject<boolean>(false);

export const toggleLoading = (value: boolean) => {
  loadingSubject.next(value);
};

const Loading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const toggleLoading = (value: boolean) => {
    if (value) {
      setCount((previous) => previous + 1);
    } else {
      setCount((previous) => (previous > 0 ? previous - 1 : 0));
    }
  };

  useEffect(() => {
    if (count > 0) {
      setIsLoading(true);
      console.log('ok');
    } else {
      setIsLoading(false);
      console.log("not ok");
    }
  }, [count]);

  //#region Subscribe Loading
  useEffect(() => {
    const subscribe = loadingSubject.subscribe((value:any) => {
      toggleLoading(value);
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, []);
  //#endregion Subscribe Loading

  return isLoading ? (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        zIndex: '999999',
        maxWidth: '100%',
      }}
    >
      <BoxOverlay />
      <LoadingCustom />
    </Box>
  ) : null;
};

export default Loading;
