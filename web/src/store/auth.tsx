import React, { ReactElement, useState, useEffect, createContext } from 'react';

interface Props {
  children: ReactElement;
}

interface ContextProps {
  token: string | void | null;
  setToken: React.Dispatch<React.SetStateAction<string | void | null>>;
  userType: string | void | null;
  setUserType: React.Dispatch<React.SetStateAction<string | void | null>>;
}

const authContext = createContext<ContextProps>({
  token: '',
  setToken: () => null,
  userType: '',
  setUserType: () => null
});
const { Provider } = authContext;

function AuthProvider({ children }: Props): ReactElement {
  const [token, setToken] = useState<string | null | void>(null);
  const [userType, setUserType] = useState<string | null | void>(null);

  useEffect(() => {
    const fetchLogin = async () => {
      const localToken = localStorage.getItem('token');
      const localUserType = localStorage.getItem('userType');

      if (localToken) {
        setToken(localToken);
      }
      if (localUserType) {
        setUserType(localUserType);
      }
    };
    fetchLogin();
  }, [token, userType]);

  return (
    <Provider value={{ token, setToken, userType, setUserType }}>
      {children}
    </Provider>
  );
}

export { authContext, AuthProvider };
