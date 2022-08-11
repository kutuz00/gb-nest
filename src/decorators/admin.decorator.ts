import { SetMetadata } from '@nestjs/common';

export const Admin = (...role: string[]) => SetMetadata('roles', role);
