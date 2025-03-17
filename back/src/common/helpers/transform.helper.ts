export class TransformHelper {
  public static trim({ value }: { value: string }): string {
    return value ? value.trim() : value;
  }

  public static toLowerCase({ value }: { value: string }): string {
    return value ? value.toLowerCase() : value;
  }

  public static toUpperCase({ value }: { value: string }): string {
    return value ? value.toUpperCase() : value;
  }

  public static toNumber({ value }: { value: string }): number {
    return Number(value);
  }

  public static toLowerCaseArray({ value }: { value: string[] }): string[] {
    return value ? value.map((item) => item.toLowerCase()) : value;
  }

  public static toUpperCaseArray({ value }: { value: string[] }): string[] {
    return value ? value.map((item) => item.toUpperCase()) : value;
  }

  public static uniqueItemsArray({ value }: { value: string[] }): string[] {
    return value ? Array.from(new Set(value)) : value;
  }

  public static trimArray({ value }: { value: string[] }): string[] {
    return value ? value.map((item) => item.trim()) : value;
  }

  public static toBoolean({ value }: { value: string }): boolean {
    return value === 'true';
  }

  public static toDate({ value }: { value: string }): Date {
    return new Date(value);
  }
}
