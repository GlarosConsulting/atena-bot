export default function parseRealValue(value: string): number {
  if (value === null || value === undefined) return 0;

  return parseFloat(
    value.replace('R$ ', '').replace('.', '').replace(',', '.'),
  );
}
