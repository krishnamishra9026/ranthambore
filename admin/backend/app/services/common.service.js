import Country from '../models/country.model';
import State from '../models/state.model';
import City from '../models/city.model';
import Page from '../models/page.model';

class CommonService {
  getCountries = async (condition, select) => Country.find(condition)
    .select(select)
    .sort('name')
    .lean();

  getStates = async (condition, select) => State.find(condition)
    .select(select)
    .sort('name')
    .lean();

  getCities = async (condition, select) => City.find(condition)
    .select(select)
    .sort('name')
    .lean();

  getPage = async (condition, select) => Page.findOne(condition)
    .select(select)
    .lean();
}
export default new CommonService();
