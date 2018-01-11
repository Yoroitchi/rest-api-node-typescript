import initTests from '../../utils/initTests';
import {API_ROUTE_V1} from '../../../../utils/constants';
import {Response} from 'express';
import {OK_200_HTTP_CODE, FORBIDDEN_403_HTTP_CODE, UNAUTHORISED_401_HTTP_CODE} from '../../utils/constants';
import config from '../../../../config';
import {TEST_INVALID_JWT_TOKEN, TEST_VALID_ANOTHER_REGIRSTER_USER, TEST_VALID_REGISTER_USER } from '../../../../utils/testValues';
import expectError from '../../utils/expectError';
import generateJwtToken from '../../../../utils/jwt/generateToken';
import createUserWithPermission from '../../utils/createUserWithPermission';
import {PERMISSION_GET_USERS, DEFAULT_USERS_PAGINATION_LIMIT, DEFAULT_USERS_PAGINATION_OFFSET} from '../../../../utils/constants';
import {fakeUsers} from '../../../../utils/fakesFactory';

describe(__filename, () => {

  const { service, request } = initTests();

  it('should fail to get user when unauthenticated', async () => {
    const response = await request.patch(`${API_ROUTE_V1}/users/1`);
    expectError(response, UNAUTHORISED_401_HTTP_CODE);
  });

  it('should fail to get users when invalid token provided in authorization header', async () => {
    const response = await request.patch(`${API_ROUTE_V1}/users/1`)
                                  .set('Authorization' , TEST_INVALID_JWT_TOKEN);
    expectError(response, UNAUTHORISED_401_HTTP_CODE);
  });

  it('should fail to get user when insufficent permissions', async () => {
    const userWithoutPermissions = await service.createUser(TEST_VALID_REGISTER_USER);
    const validToken = await generateJwtToken({data: {id: userWithoutPermissions.id}});
    const response = await request.patch(`${API_ROUTE_V1}/users/${userWithoutPermissions.id}`)
                                  .set('Authorization' , validToken);
    expectError(response, FORBIDDEN_403_HTTP_CODE);
  });

});