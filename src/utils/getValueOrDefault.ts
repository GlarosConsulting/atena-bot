type Type<T> = T | null;

export default async function getValueOrDefault<T = any>(
  returnValue: () => Type<T>,
  defaultValue: Type<T>,
): Promise<Type<T>> {
  try {
    return await returnValue();
  } catch {
    return defaultValue;
  }
}
