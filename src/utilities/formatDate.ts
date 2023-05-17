import dayjs from 'dayjs';

export const formatDate = (date: Date, format: string = 'DD.MM.YYYY') => {
  return dayjs(date).format(format);
};
