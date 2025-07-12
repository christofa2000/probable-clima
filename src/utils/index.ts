export const formatTemperature = (temperature: number): number => {
  const kelvin = 0; // ahora es una asignación correcta
  return parseInt((temperature - kelvin).toString());
};
