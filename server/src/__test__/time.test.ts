import { format_Date } from '~/utils/time.utils'

describe('Format_Date', () => {
  test('formatDateTimeStringUpdate', () => {
    const inputDate = '2023-11-05T12:34:56.789Z'
    const formattedDate = format_Date.formatDateTimeStringUpdate(inputDate)
    expect(formattedDate).toEqual('Thứ sáu ngày 5 tháng 11 năm 2023 12:34:56 CH')
  })

  test('formatDateTime', () => {
    const inputDate = '2023-11-05T12:34:56.789Z'
    const formattedDate = format_Date.formatDateTime(inputDate)
    expect(formattedDate).toEqual('2023-11-05 12:34:56')
  })
})
