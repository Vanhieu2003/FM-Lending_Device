"use client"
import { Card, CardContent, Box, TextField, Container, Button, InputAdornment, Typography, IconButton, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import QRScannerService from "src/@core/service/QR";
import ReplayIcon from '@mui/icons-material/Replay';
import QRTest from "./QRTest";
import { useCustomSnackbar } from "src/hooks/use-snackbar";
import StudentCodeCheck from "./StudentCodePopup";
import { toggleLoading } from "src/@core/components/loading-screen/loading-overlay";


interface Step1ContentProps {
    onSubmit: (borrowCode: string, data: any) => void;
}

export const Step1Content = ({ onSubmit }: Step1ContentProps) => {
    const [userCode, setUserCode] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [borrowCode, setBorrowCode] = useState('');
    const [error, setError] = useState(false);
    const [borrowCodeError, setBorrowCodeError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [borrowCodeHelperText, setBorrowCodeHelperText] = useState('');
    const [rfid,setRFID] = useState<any>();
    const [openPopUp,setOpenPopUp] = useState<boolean>(false);
    const [ScanStatus, setScanStatus] = useState(false);
    const { showSuccess, showError } = useCustomSnackbar();
    const theme = useTheme();
    const [isRFID, setIsRFID] = useState<boolean>(true);


    const validLengths = [0, 4, 10, 12, 14];

    const checkValidLinkAndFormat = async (link: string) => {
        if (link.startsWith("https")) {
            const response: any = await QRScannerService.getStudentInfoByQR_ID(link);
            setScanStatus(false);
            if (response.data[0].success) {
                console.log("success");
                const studentCode = response.data[0].internalCode.replace(/\./g, '');
                setIsRFID(false);
                return studentCode;
            }
            else {
                console.log("falied");
                setScanStatus(false);
                showError(response.data[0].errorMsg);
                return false;
            }

        }
        return false;
    }

    const validateUserCode = (code: string): boolean => {
        if (!validLengths.includes(code.length)) {
            setError(true);
            setHelperText('Vui lòng nhập đúng mã số người mượn');
            return false;
        }
        return true;
    };
    const validateBorrowCode = (code: string): boolean => {
        if (code.length !== 6) {
            setBorrowCodeError(true);
            setBorrowCodeHelperText('Vui lòng nhập đúng mã đơn mượn');
            return false;
        }
        return true;
    };


    const handleNextStep = async () => {
        toggleLoading(true);
        if (borrowCode.length > 0) {
            const result = validateBorrowCode(borrowCode);
            if (result) {
                const fullCode = 'CTB-' + borrowCode;
                try {
                    const response = await QRScannerService.getInfoByBorrowCode(fullCode).finally(() => toggleLoading(false));
                    onSubmit(borrowCode, response);
                    return;
                }
                catch (error) {
                    return;
                }
            }
            return;
        }
        if (userCode.length > 0) {
            const result = validateUserCode(userCode);
            if (result) {
                if (userCode.length === 4) {
                    try {
                        const response = await QRScannerService.getStaffInfo(userCode).finally(() => toggleLoading(false));
                        onSubmit(borrowCode, response);
                        return;
                    }
                    catch (error) {
                        return;
                    }
                }
                else if (userCode.length === 10) {
                    try {
                        const response = await QRScannerService.getStudentInfo(userCode).finally(() => toggleLoading(false));
                        
                        onSubmit(borrowCode, response);
                        return;
                    }
                    catch (error) {
                 
                        return;
                    }
                }
                else if (userCode.length === 14) {
                    try {
                        const response = await QRScannerService.getInfoByRFID(userCode).finally(() => toggleLoading(false));

                        onSubmit(borrowCode, response);
                        return;
                    }
                    catch (error) {
                        handleOpenCheck();
                        return;
                    }
                }
                else {
                    try {
                        const response = await QRScannerService.getVisitorInfo(userCode).finally(() => toggleLoading(false));;
                        onSubmit(borrowCode, response);
                        return;
                    }
                    catch (error) {
                        showError("Đã xảy ra lỗi không xác định")
                    }

                }
            }
            return;
        }
        if (userCode.length === 0 && borrowCode.length === 0) {
            toggleLoading(false);
            showError("Vui lòng nhập 1 trong 2 thông tin để tiếp tục")
        }

    }

    const handleUserCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const result = await checkValidLinkAndFormat(value);
        if (!result) {
            if (value.startsWith('https')) {
                handleReplayQR();
                return;
            }
            setUserCode(value);

            setIsRFID(false);
            if (value.trim()) {
                setError(false);
                setHelperText('');
            }
        }
        else {
            setUserCode(result);
            if (result.trim()) {
                setError(false);
                setHelperText('');
            }
        }
    }

    const handleReplayQR = () => {
        setScanStatus(false);
        (document.activeElement as HTMLElement)?.blur();
        setUserCode('');
        setBorrowCode('');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNextStep();
        }
    };

    const handleQRScanner = async (qrCodeData: string) => {
        setScanStatus(true);
        const result = await checkValidLinkAndFormat(qrCodeData);

        if (result) {
            setUserCode(result);
            setScanStatus(false);
        }
        else {
            if (qrCodeData.startsWith("CTB-")) {
                //Tách QR borrowCode
                setBorrowCode(qrCodeData.split('-')[1]);
                setScanStatus(false);
            }
            else if (qrCodeData.includes("|")) {
                if (qrCodeData.startsWith("https")) return;
                //Tách CMND
                setUserCode(qrCodeData.split('|')[0]);
                setIsRFID(false);
                setScanStatus(false);
            }
            else {
                setIsRFID(true);
                setUserCode(qrCodeData);
                setScanStatus(false);
            }
        }
    }

    useEffect(() => {
        if (userCode.length === 14) {
            handleNextStep();
        }
    }, [userCode])

    const handleOpenCheck = async()=>{
        await setRFID(userCode);
        await setOpenPopUp(true);
    }

    const handleUpdateSuccess = (status:boolean,data:any)=>{
        if(status){
            console.log(data)
            onSubmit(borrowCode, data)
        }
        else{
            setOpenPopUp(false);
        }
    }


    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: '500px' }}>
                <CardContent sx={{ borderBottom: `1px dashed ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Quét mã QR </Typography>

                        <QRTest onChange={handleQRScanner} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{
                            '& .dot-animation': {
                                animation: 'dotAnimation 1.4s infinite',
                                display: 'inline-block'
                            },
                            '@keyframes dotAnimation': {
                                '0%, 20%': {
                                    transform: 'translateY(0)'
                                },
                                '50%': {
                                    transform: 'translateY(-5px)'
                                },
                                '80%, 100%': {
                                    transform: 'translateY(0)'
                                }
                            }
                        }}>
                            {ScanStatus ? (
                                <span>
                                    <Typography variant="subtitle1">Đang xử lý
                                        <span className="dot-animation">.</span>
                                        <span className="dot-animation" style={{ animationDelay: '0.2s' }}>.</span>
                                        <span className="dot-animation" style={{ animationDelay: '0.4s' }}>.</span>
                                    </Typography>
                                </span>
                            ) : " "}
                        </Box>
                        <Box>
                            <IconButton onClick={handleReplayQR} disabled={ScanStatus}>
                                <ReplayIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
                <CardContent sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
                    <TextField
                        id="outlined-basic1"
                        label="Nhập mã số người mượn"
                        variant="outlined"
                        fullWidth
                        inputProps={{
                            maxLength: 14,
                        }}
                        value={userCode}
                        onKeyDown={handleKeyDown}
                        onChange={handleUserCodeChange}
                        error={error}
                        helperText={helperText}
                    />
                </CardContent>
                <CardContent>
                    <TextField
                        id="outlined-basic2"
                        label="Nhập thông tin mã đơn mượn"
                        variant="outlined"
                        value={borrowCode}
                        error={borrowCodeError}
                        helperText={borrowCodeHelperText}
                        inputProps={{
                            maxLength: 6,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">CTB-</InputAdornment>,
                        }}
                        fullWidth
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setBorrowCode(e.target.value)} />
                </CardContent>
                <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleNextStep}>Tiếp tục</Button>
                </CardContent>
                {openPopUp===true && <StudentCodeCheck onSuccess={handleUpdateSuccess} RFID={rfid} openPopUp={true}/>}
            </Card>

        </Container>
    )

};