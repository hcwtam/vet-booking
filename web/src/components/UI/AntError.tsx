import React, { ReactElement } from 'react';
import { ErrorMessage } from 'formik';

interface Props {
  name: string;
}

export default function AntError({ name }: Props): ReactElement {
  return (
    <ErrorMessage
      className="ant-form-item-explain ant-form-item-explain-error"
      name={name}
    >
      {(msg) => (
        <div
          className="ant-form-item-explain ant-form-item-explain-error"
          role="alert"
          style={{ position: 'relative', bottom: 12, height: 0 }}
        >
          {msg}
        </div>
      )}
    </ErrorMessage>
  );
}
