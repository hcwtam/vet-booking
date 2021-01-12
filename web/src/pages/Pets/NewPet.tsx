import React, { ReactElement, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { addPet } from '../../utils/user';
import { authContext } from '../../store/auth';
import { AddPetForm } from '../../types/forms';
import { userContext } from '../../store/user';
import Content from '../../components/UI/Content';
import BackButton from '../../components/UI/BackButton';
import { Button } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  border-radius: 5px;
  background-color: #efefef;
  box-shadow: 0 0 8px #ccc;
  padding: 0 0 20px;
`;

const FormContainer = styled.div`
  padding: 20px;
`;

const Title = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const CheckboxGroup = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default function NewPet(): ReactElement {
  const { token } = useContext(authContext);
  const [, { petsMutate }] = useContext(userContext);

  const initialValues = {
    name: '',
    animalType: '',
    gender: '',
    desexed: '',
    illness: []
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    animalType: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    desexed: Yup.string().required('Required'),
    illness: Yup.array()
  });

  const onSubmit = async (values: AddPetForm) => {
    await addPet(values, token as string);
    petsMutate();
  };

  return (
    <>
      <Content>
        <h1 style={{ margin: '0 10px 20px' }}>Pets</h1>
        <Container>
          <Title>
            <h2
              style={{ marginBottom: 0, fontSize: '1.2rem', fontWeight: 600 }}
            >
              Add a new pet
            </h2>
          </Title>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <FormContainer>
                  <Form>
                    <Label>Name</Label>
                    <Field
                      type="text"
                      label="Name"
                      name="name"
                      placeholder="Name"
                      className="ant-input"
                      style={{ marginBottom: 20 }}
                    />
                    <Label>Pet Type</Label>
                    <Field
                      as="select"
                      label="Animal Type"
                      name="animalType"
                      className="ant-input"
                      style={{ marginBottom: 20 }}
                    >
                      <option value="">Type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="turtle">Turtle</option>
                    </Field>
                    <Label>Gender</Label>
                    <Field
                      as="select"
                      label="Gender"
                      name="gender"
                      className="ant-input"
                      style={{ marginBottom: 20 }}
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <Label>Desexed</Label>
                    <Field
                      as="select"
                      label="Desexed"
                      name="desexed"
                      className="ant-input"
                      style={{ marginBottom: 20 }}
                    >
                      <option value="">Desexed</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Field>
                    <Label>Illnesses</Label>
                    <CheckboxGroup
                      role="group"
                      aria-labelledby="checkbox-group"
                    >
                      <label>
                        <Field
                          type="checkbox"
                          name="illness"
                          value="skin allergy"
                          style={{ width: 0, height: 0, marginRight: 10 }}
                        />
                        Skin Allergy
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="illness"
                          value="ear infection"
                          style={{ width: 0, height: 0, marginRight: 10 }}
                        />
                        Ear Infection
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="illness"
                          value="diarrhea"
                          style={{ width: 0, height: 0, marginRight: 10 }}
                        />
                        Diarrhea
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="illness"
                          value="arthritis"
                          style={{ width: 0, height: 0, marginRight: 10 }}
                        />
                        Arthritis
                      </label>
                      <label>
                        <Field
                          type="checkbox"
                          name="illness"
                          value="diabetes"
                          style={{ width: 0, height: 0, marginRight: 10 }}
                        />
                        Diabetes
                      </label>
                    </CheckboxGroup>
                    <Button
                      danger
                      type="primary"
                      size="large"
                      htmlType="submit"
                      style={{
                        borderRadius: 8,
                        width: '100%',
                        height: 50,
                        fontWeight: 600,
                        marginTop: 40
                      }}
                      disabled={
                        !formik.dirty || !formik.isValid || formik.isSubmitting
                      }
                    >
                      Submit
                    </Button>
                  </Form>
                </FormContainer>
              );
            }}
          </Formik>
        </Container>
      </Content>
      <BackButton />
    </>
  );
}
