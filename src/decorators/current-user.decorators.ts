// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const CurrentUser = createParamDecorator(
//   (data: string, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     return data ? request.user?.[data] : request.user;
//   },
// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): any => {
    const request = context.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
