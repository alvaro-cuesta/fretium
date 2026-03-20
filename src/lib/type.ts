export function checkIsNever(value: never): never {
  // @ts-expect-error -- we want to be able to print out the value that caused the error, even if it's not actually `never`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call -- we want to be able to print out the value that caused the error
  throw new Error(`Expected never, but got: ${value.toString()}`);
}
