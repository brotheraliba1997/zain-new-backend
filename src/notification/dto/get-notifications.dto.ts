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

export class NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string;
  createdAt: string;
  recipients: string[];
}

export class NotificationPaginator extends Paginator<NotificationData> {
  data: any;
}

export enum QueryProgramsOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'is_active',
}

export class GetNotificationDto extends PaginationArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transform string to number
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Transform string to number
  page?: number;

  @IsOptional()
  @IsEnum(QueryProgramsOrderByColumn)
  orderBy?: QueryProgramsOrderByColumn;

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
