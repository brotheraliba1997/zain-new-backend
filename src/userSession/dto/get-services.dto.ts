import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

export class UserSessionData {
  id: string;
  name: string;
}

export class UserSessionPaginator extends Paginator<UserSessionData> {
  data: UserSessionData[];
}

export enum QueryServicesOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'is_active',
}

export class GetServicesDto extends PaginationArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transform string to number
  limit?: number;

  @IsOptional()
  @IsEnum(QueryServicesOrderByColumn)
  orderBy?: QueryServicesOrderByColumn;

  @IsOptional()
  @IsEnum(SortOrder)
  sortedBy?: SortOrder;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
