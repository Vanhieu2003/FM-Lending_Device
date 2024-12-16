'use client';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Container, Typography, Box,
  useTheme
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment'
import 'dayjs/locale/vi';

// ----------------------------------------------------------------------
interface FilterProps {
  onChange: (value: any) => void;
}
export default function FilterComponent({ onChange }: FilterProps) {
  const theme = useTheme();
  const [selectBorrowDate, setSelectBorrowDate] = useState<Dayjs | null>(null);

  const adjustTimeZone = (date: Date) => {
    const adjustedDate = new Date(date);
    return adjustedDate;
};

  useEffect(() => {
    onChange(adjustTimeZone(selectBorrowDate?.toDate() || new Date()));
  }, [selectBorrowDate]);


  return (

    <Box sx={{display:'flex',gap:2}}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DatePicker
          label="Ngày mượn"
          value={selectBorrowDate}
          defaultValue={dayjs()}
          onChange={(newDate: Dayjs | null) => {
            setSelectBorrowDate(newDate);
          }}
          onAccept={(newDate: Dayjs | null) => {
            if (newDate && moment(newDate.format('DD/MM/YYYY'), 'DD/MM/YYYY', true).isValid()) {
              setSelectBorrowDate(newDate);
            }
          }}
          format="DD/MM/YYYY"
          sx={{
            '& .MuiInputLabel-root': { // Màu của label
              color: theme.palette.text.primary,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { // Màu của border
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': { // Màu của border khi hover
                borderColor: theme.palette.text.primary,
              },
              '&.Mui-focused fieldset': { // Màu của border khi focus
                borderColor: theme.palette.text.primary,
              },
            },
            '& .MuiInputBase-input': { // Màu của text
              color: theme.palette.text.primary,
            },
            '& .MuiIconButton-root': { // Màu của icon calendar
              color: theme.palette.text.primary,
            },
          }}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DatePicker
          label="Ngày trả"
          defaultValue={dayjs()}
          disabled={true}
          onChange={(newDate: Dayjs | null) => {
            setSelectBorrowDate(newDate);
          }}
          onAccept={(newDate: Dayjs | null) => {
            if (newDate && moment(newDate.format('DD/MM/YYYY'), 'DD/MM/YYYY', true).isValid()) {
              setSelectBorrowDate(newDate);
            }
          }}
          format="DD/MM/YYYY"
          sx={{
            '& .MuiInputLabel-root': { // Màu của label
              color: theme.palette.text.primary,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { // Màu của border
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': { // Màu của border khi hover
                borderColor: theme.palette.text.primary,
              },
              '&.Mui-focused fieldset': { // Màu của border khi focus
                borderColor: theme.palette.text.primary,
              },
            },
            '& .MuiInputBase-input': { // Màu của text
              color: theme.palette.text.primary,
            },
            '& .MuiIconButton-root': { // Màu của icon calendar
              color: theme.palette.text.primary,
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}
