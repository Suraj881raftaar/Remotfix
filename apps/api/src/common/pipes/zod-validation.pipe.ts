import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from '@remotfix/validation';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' && metadata.type !== 'query' && metadata.type !== 'param') {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const error: ZodError = result.error;
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Request payload validation failed',
        details: error.flatten(),
      });
    }
    return result.data;
  }
}
