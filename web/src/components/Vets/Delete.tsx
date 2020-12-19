import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';
import { authContext } from '../../store/auth';
import { deleteVet } from '../../utils/user';

interface Props {
  hide: () => void;
  id: string;
  vetsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Delete({ hide, id, vetsMutate }: Props): ReactElement {
  const { token } = useContext(authContext);
  const history = useHistory();

  return (
    <div>
      Are you sure you want to delete this vet profile?
      <button
        onClick={async () => {
          await deleteVet(id, token as string);
          vetsMutate();
          history.push('/vets');
        }}
      >
        yes
      </button>
      <button onClick={hide}>no</button>
    </div>
  );
}
