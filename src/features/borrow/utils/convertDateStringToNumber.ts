// "YYYYMMDD" -> YYYYMMDD
export const convertDateStringToNumber = (dateString: string): number => {
  return parseInt(dateString?.replace(/-/g, ''), 10);
}