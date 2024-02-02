import { MessageSnackbar } from '@/components/feedback/snackbar';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

interface SnackbarState {
  open: boolean;
  message: string;
}

interface SnackbarContextValue extends SnackbarState {
  showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function SnackbarProvider(props: PropsWithChildren) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' });

  const showSnackbar = (message: string) => setSnackbar({ open: true, message });
  const hideSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <SnackbarContext.Provider value={{ ...snackbar, showSnackbar }}>
      {props.children}
      <MessageSnackbar {...snackbar} onClose={hideSnackbar} />
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext)!;
