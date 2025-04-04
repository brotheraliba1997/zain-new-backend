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

export class UserData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export class UserPaginator extends Paginator<UserData> {
  data: UserData[];
}

// export class GetUsersDto extends PaginationArgs {
//   orderBy?: QueryUsersOrderByColumn;
//   sortedBy?: SortOrder;
//   text?: string;
//   search?: string;
//   limit?: number;
//   page?: number;
// }

export enum QueryUsersOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'is_active',
}

export class GetUsersDto extends PaginationArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transform string to number
  limit?: number;

  @IsOptional()
  @IsEnum(QueryUsersOrderByColumn)
  orderBy?: QueryUsersOrderByColumn;

  @IsOptional()
  @IsEnum(SortOrder)
  sortedBy?: SortOrder;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @Type(() => Boolean) // Transform string to bool
  haveDevices?: Boolean;
}
