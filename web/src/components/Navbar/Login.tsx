import React, { ReactElement, useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { login, LoginFormData } from '../../utils/auth';
import { authContext } from '../../store/auth';
import { Button } from 'antd';
import { ModalContentType } from '../../types/types';
import LinkButton from '../UI/LinkButton';
import AntError from '../UI/AntError';
import { userContext } from '../../store/user';

const Label = styled.label`
  font-weight: 600;
`;

interface Props {
  setModalContent: (content: ModalContentType) => void;
}

export default function Login({ setModalContent }: Props): ReactElement {
  const history = useHistory();
  const { setToken, setUserType } = useContext(authContext);
  const [, { userMutate }] = useContext(userContext);

  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required')
  });

  const onSubmit = async (values: LoginFormData) => {
    const res = await login(values);
    if (res.userType && res.token) {
      setToken(res.token);
      setUserType(res.userType);
      userMutate();
      history.push('/');
    } else {
      setErrorMessage(
        res.error === 401
          ? 'Incorrect username or password.'
          : 'Cannot login. Please try again.'
      );
    }
  };

  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Label>Username</Label>
                <Field
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="Username"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="username" />
                <Label>Password</Label>
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Password"
                  className="ant-input"
                  style={{ marginBottom: 15 }}
                />
                <AntError name="password" />
                <Button
                  danger
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    borderRadius: 8,
                    width: '100%',
                    height: 50,
                    fontWeight: 600,
                    marginTop: 20,
                    marginBottom: 20
                  }}
                  disabled={
                    !formik.dirty || !formik.isValid || formik.isSubmitting
                  }
                >
                  Log In
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div>{errorMessage}</div>
      <div>
        Don't have an account?{`  `}
        <LinkButton onClick={() => setModalContent('Sign up')}>
          Sign up
        </LinkButton>
      </div>
    </>
  );
}
