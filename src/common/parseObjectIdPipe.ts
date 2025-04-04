import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const objectIdRegex = /^[a-f\d]{24}$/i;

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    // console.log('Received value for ObjectId validation:', value);

    if (!value || !objectIdRegex.test(value)) {
      throw new BadRequestException(
        'Validation failed (Invalid ObjectId format)',
      );
    }

    // console.log('Valid ObjectId:', value);
    return value;
  }
}
