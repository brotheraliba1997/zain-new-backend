import { Type } from 'class-transformer';

export class BaseEntity {
  id: string;
  @Type(() => Date)
  createdAt: Date;
  @Type(() => Date)
  updatedAt: Date;
}
