export class CustomError {
    message!: string;
    status!: number;
    additionalInfo!: any;
  
    constructor(message: string, status: number = 500, additionalInfo: any = {}) {
      this.message = message;
      this.status = status;
      this.additionalInfo = additionalInfo
    }
}
/**
 * A typeguarded version of `instanceof Error` for NodeJS.
 * @author Joseph JDBar Barron
 * @link https://dev.to/jdbar
 */
export function instanceOfNodeError<T extends new (...args: any) => Error>(
    value: Error,
    errorType: T
): value is InstanceType<T> & NodeJS.ErrnoException {
    return value instanceof errorType;
}