import {Request} from 'express';
import * as jwt from 'jsonwebtoken';
import AsyncHandler from '../AsyncHandler';
import {ExtractTokenFromRequestSignature, createExtractTokenFromRequest} from './extractTokenFromRequest';
import Service from '../../service/Service';
import * as express from 'express';
import config from '../../config';
import {ExpiredJwtTokenError, InvalidJwtTokenError, UnauthorizedError} from '../../utils/errors';

interface Options {
  req: Request;
  extractTokenFromRequest?: ExtractTokenFromRequestSignature;
  service: Service;
  secretOrKey?: string | Buffer;
}

const extractTokenFromRequest = createExtractTokenFromRequest();

export default async(options: Options): Promise<any> => {
  try {
    const tokenExtractor = options.extractTokenFromRequest || extractTokenFromRequest;
    const token: any = tokenExtractor({req: options.req});
    const secret = options.secretOrKey || config.jwt.secret;
    const {data}: any = jwt.verify(token, secret);
    
    const user: any = await options.service.getUserById({id: data.id});
    const permissions: any = await options.service.getUserPermissions({userId: user.id});
    user.permissions = permissions;
    return user;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new InvalidJwtTokenError();
    } else if (err instanceof jwt.NotBeforeError) {
      new InvalidJwtTokenError();
    } else if (err instanceof jwt.TokenExpiredError) {
      new ExpiredJwtTokenError();
    } 
    throw err;
  }
}

