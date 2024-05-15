import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import 'dayjs/locale/nl' // load on demand
dayjs.locale('nl') // use Spanish locale globally

export default helper(function formatValue([str] /*, named*/) {
  if (typeof str !== 'string') {
    return str; // Return the input as-is if it's not a string.
  }
  const formatString = 'D MMMM YYYY, HH:mm';
  const date = dayjs(str)
  return date.isValid()? date.format(formatString) : str;
});
