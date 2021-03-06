import AsyncHandler from '../../../utils/AsyncHandler';
import {UserAttributes} from '../../../models/interfaces/user';

export interface Options {
  readonly id: number;  
}

type Signature = AsyncHandler<Options, UserAttributes>;

export default Signature;