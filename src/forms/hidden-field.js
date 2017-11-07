import React from 'react';
import { Input } from 'semantic-ui-react';
import { observer } from 'mobx-react';

export default observer(({field}) => (
  <Input type="hidden" {...field.bind()} />
));