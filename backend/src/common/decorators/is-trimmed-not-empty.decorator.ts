import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsTrimmedNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTrimmedNotEmpty',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must not be empty`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be empty`;
        },
      },
    });
  };
}
