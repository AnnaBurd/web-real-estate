export const roundNumber = (num: number, decimalPlaces: number) => {
  return Number(`${Math.round(+`${num}e${decimalPlaces}`)}e-${decimalPlaces}`);
};
