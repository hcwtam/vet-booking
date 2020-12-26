import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router';

import { authContext } from '../../store/auth';
import { deleteBooking } from '../../utils/booking';

interface Props {
  hide: () => void;
  id: string;
  bookingsMutate: (data?: any, shouldRevalidate?: boolean | undefined) => any;
}

export default function Cancel({
  hide,
  id,
  bookingsMutate
}: Props): ReactElement {
  const { token } = useContext(authContext);
  const history = useHistory();

  return (
    <div>
      Are you sure you want to cancel this booking?
      <button
        onClick={async () => {
          await deleteBooking(id, token as string);
          bookingsMutate();
          history.push('/');
        }}
      >
        yes
      </button>
      <button onClick={hide}>no</button>
    </div>
  );
}
