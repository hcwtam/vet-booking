import React, { ReactElement, useState, useEffect, createContext } from 'react';

interface Props {
  children: ReactElement;
}

interface ContextProps {
  token: string | void | null;
  setToken: React.Dispatch<React.SetStateAction<string | void | null>>;
}

const authContext = createContext<ContextProps | null>(null);
const { Provider } = authContext;

function AuthProvider({ children }: Props): ReactElement {
  const [token, setToken] = useState<string | null | void>(null);

  useEffect(() => {
    const fetchLogin = async () => {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        setToken(localToken);
      }
    };
    fetchLogin();
  }, [token]);

  return <Provider value={{ token, setToken }}>{children}</Provider>;
}

export { authContext, AuthProvider };
