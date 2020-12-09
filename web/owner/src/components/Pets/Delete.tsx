import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';
import { authContext } from '../../store/auth';
import { deletePet } from '../../utils/user';

interface Props {
  hide: () => void;
  id: string;
  petsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Delete({ hide, id, petsMutate }: Props): ReactElement {
  const { token } = useContext(authContext);
  const history = useHistory();

  return (
    <div>
      Are you sure you want to delete this pet profile?
      <button
        onClick={async () => {
          await deletePet(id, token as string);
          petsMutate();
          history.push('/pets');
        }}
      >
        yes
      </button>
      <button onClick={hide}>no</button>
    </div>
  );
}
