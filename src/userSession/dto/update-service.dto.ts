import { PartialType } from '@nestjs/swagger';
import { RegisterSessionDeviceDto } from './register-device.dto';

export class UpdateServiceDto extends PartialType(RegisterSessionDeviceDto) {}
