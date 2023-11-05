import { format, parseISO } from 'date-fns'
import vi from 'date-fns/locale/vi'

class Format_Date {
  public formatDateTimeStringUpdate = (inputDate: string) =>
    format(parseISO(inputDate), "EEEE 'ngày' d 'tháng' M 'năm' yyyy h:mm:ss a", {
      locale: vi
    })

  public formatDateTime = (inputDate: string) => format(parseISO(inputDate), 'yyyy-MM-dd HH:mm:ss')
}

export const format_Date = new Format_Date()
