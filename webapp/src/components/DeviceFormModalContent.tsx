import { useState, FormEvent, ChangeEvent } from 'react';
import {
  Button,
  Form,
  Modal,
  Icon,
  Segment,
  CheckboxProps,
  TextAreaProps,
  InputOnChangeData,
} from 'semantic-ui-react';

const blankForm = {
  name: undefined,
  nameError: false,

  macAddress: undefined,
  macAddressError: false,

  description: undefined,
};

export const DeviceFormModalContent = (props) => {
  const [form, setForm] = useState<any | null>({
    ...blankForm,
    ...(props.initialForm ? props.initialForm : {}),
  });

  const { name, nameError, macAddress, macAddressError, description } = form;

  const handleChange = (
    e: FormEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    data: InputOnChangeData | TextAreaProps | CheckboxProps
  ) => {
    if (data && data.name === 'deviceHealth') {
      setForm({ ...form, [data.name]: data.value });
    } else {
      setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });
    }
  };

  const handleSubmit = () => {
    let errors = {};
    if (!name || name === '') {
      errors = { ...errors, nameError: true };
    }
    if (!macAddress || macAddress === '') {
      errors = { ...errors, macAddressError: true };
    }

    setForm({
      ...form,
      ...errors,
    });

    if (!Object.values(errors).length) {
      setForm(blankForm);
      props.submitCallBack(form);
    }
  };

  return (
    <>
      <Modal.Content image scrolling>
        <div className='image'>
          <Icon name='microchip' />
        </div>
        <Modal.Description>
          <Segment>
            <Form>
              <Form.Input
                label='Device Name '
                placeholder='Device Name'
                name='name'
                value={name || ''}
                onChange={handleChange}
                required
                error={nameError}
                inline
              />
              <Form.Input
                label='MAC Address'
                placeholder='MAC Address'
                name='macAddress'
                value={macAddress || ''}
                onChange={handleChange}
                required
                error={macAddressError}
                inline
              />
              <Form.TextArea
                label='About'
                placeholder='Please provide a brief description'
                name='description'
                value={description}
                onChange={handleChange}
                inline
              />
            </Form>
          </Segment>
          {props.extraFormContent}
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        {props.extraActions}
        <Button primary type='submit' onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Modal.Actions>
    </>
  );
};
