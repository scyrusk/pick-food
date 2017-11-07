import React from 'react';
import { observer } from 'mobx-react';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

export default observer(({field}) => (
  <Form.Field className={classnames({error:field.error})}>
    <label htmlFor={field.id}>
      {field.label}
    </label>
    <Input {...field.bind()} />
    <span className="error">{field.error}</span>
  </Form.Field>
));