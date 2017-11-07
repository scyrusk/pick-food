import MobxReactForm from 'mobx-react-form';
import { feathersClient } from '../stores/client';

export default class CreateUserForm extends MobxReactForm {
  userServiceName = 'users';
  onSuccessHanlder = null;
  onErrorHandler = null;

  constructor(fields, plugins, successHandler, errorHandler) {
    super(fields, plugins);
    this.onSuccessHandler = successHandler;
    this.onErrorHandler = errorHandler;
  }

  onSuccess(form) {
    var self = this;
    feathersClient().service(this.userServiceName).create({
      ...form.values()
    }).then((result) => {
      self.onSuccessHandler(result);
    }).catch((e) => {
      self.onErrorHandler(e);
    })
  }
}