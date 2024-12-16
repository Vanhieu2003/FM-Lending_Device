"use client"
import { Autocomplete, Button, createFilterOptions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import InfoService from 'src/@core/service/Info';
import QRScannerService from 'src/@core/service/QR';
import { PHONE_MESSAGES } from 'src/_mock/_phone';
import { useCustomSnackbar } from 'src/hooks/use-snackbar';



interface PhoneCheckProps {
    onSuccess: (status: boolean, data?: any) => void
    RFID: string
    openPopUp: boolean
}

type UserType = 'student' | 'staff';



const StudentCodeCheck = ({ onSuccess, RFID, openPopUp }: PhoneCheckProps) => {
    const validLengths = [4, 10];
    const [open, setOpen] = useState(openPopUp);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [optionList, setOptionList] = useState<any[]>([]);
    const [type, setType] = useState<UserType>('student');
    const { showError, showSuccess } = useCustomSnackbar();
    const userTypeOptions: UserType[] = ['student', 'staff'];
    const userTypeLabels: Record<UserType, string> = {
        student: 'Học sinh',
        staff: 'Cán bộ giảng viên'
    };

    const filterOptions = createFilterOptions({
        ignoreCase: true,
        limit: 20,
        stringify: (option: any) => option.code
    });


    const handleClose = () => {
        onSuccess(false);
        setOpen(false);

    };

    const fetchData = async (type: string) => {
        if (type === 'student') {
            //call api
            const response: any = await InfoService.getStudentList();
            setOptionList(response)
        }
        else {
            //call api
            const response: any = await InfoService.getStaffList();
            setOptionList(response)
        }
    }
    const handleSubmit = async () => {
        if (!selectedUser || selectedUser === null) {
            showError("Vui lòng chọn đầy đủ thông tin")
        }
        else {
            try {
                const response: any = await QRScannerService.updateRFIDIfNull(RFID, selectedUser.code);
                onSuccess(true, response);
            }

            catch (error) {
                return;
            }
        }



    }

    useEffect(() => {
        fetchData(type);
    }, [type])

    return (
        <Dialog
            open={open}
            onClose={() => { }}
            disableEscapeKeyDown
            PaperProps={{
                component: 'form',
                noValidate: true,
            }}
        >
            <DialogTitle>Xác nhận thông tin người dùng</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DialogContentText>
                    Vui lòng nhập thông tin để tiếp tục
                </DialogContentText>
                <Autocomplete
                    fullWidth
                    options={userTypeOptions}
                    getOptionLabel={(option: UserType) => userTypeLabels[option]}
                    value={type}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setType(newValue);
                            setSelectedUser(null);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn kiểu"
                            variant="outlined"
                        />
                    )}
                />


                <Autocomplete
                    fullWidth
                    options={optionList}
                    getOptionLabel={(option: any) => option.code}
                    value={selectedUser}
                    filterOptions={filterOptions}
                    onChange={(event, newValue) => {
                        setSelectedUser(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn mã số"
                            variant="outlined"
                        />
                    )}
                    noOptionsText="Không có dữ liệu người dùng"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.code}
                        </li>
                    )}
                />
                {/* <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="code"
                    name="code"
                    label="Mã số người mượn"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={studentCode}
                    error={error}
                    helperText={helperText}
                    onChange={(e) => {
                        setStudentCode(e.target.value);
                    }}
                /> */}
                
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default StudentCodeCheck