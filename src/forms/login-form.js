import MobxReactForm from 'mobx-react-form';
import { feathersClient } from '../stores/client';

class LoginForm extends MobxReactForm {
  onSuccessHandler = null;
  onErrorHandler = null;

  constructor(fields, plugins, successHandler, errorHandler) {
    super(fields, plugins);
    this.onSuccessHandler = successHandler;
    this.onErrorHandler = errorHandler;
  }

  onSuccess(form) {
    var self = this;
    feathersClient().authenticate({
      strategy: 'local',
      ...form.values(),
    }).then(function(result){
      self.onSuccessHandler(result);
    }).catch(function(error){
      self.onErrorHandler(error);
    });
  }
}

export default LoginForm;