import utils from '../../utils';
import Customer from '../../models/customer.model';
import BaseService from '../../services/base.service';

class CustomerService extends BaseService {
  constructor() {
    super(Customer);
  }

  login = async data => this.model.findOne(
    {
      email: data.username,
      active: true,
    },
    'id firstName lastName fullName email passwordHash isEmailVerified',
  );

  createCustomer = async data => {
    const verificationCode = utils.GenerateCode();
    const date = new Date();
    const tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    data.resetTokenExpires = tomorrowDate;
    data.resetVerificationCode = verificationCode;
    return this.model.create(data);
  };
}
export default new CustomerService();
