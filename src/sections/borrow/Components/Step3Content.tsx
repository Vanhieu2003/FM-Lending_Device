import { Card, CardContent, Box, Typography, Stack, Button, Container, Grid, useTheme, IconButton } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';

import IconTextComponent from "src/components/common/common-icon-text";
import SignatureComponent from "./Signature";
import { useEffect, useRef, useState } from "react";
import SnackbarComponent from "src/components/common/common-snackbar";
import WebcamCapture from "./CameraCaptureComponent";
import { InfoComponent } from "./InfoComponent";
import CompleteCard from "./CompleteCard";
import BorrowService from "src/@core/service/Borrow";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCustomSnackbar } from "src/hooks/use-snackbar";




export const Step3Content = ({ selectedRoom, selectedItems, userData, onChange }: any) => {

    const theme = useTheme();
    const [now, setNow] = useState(new Date().toLocaleString());
    const webcamRef = useRef<any>(null);
    const [status, setStatus] = useState<number>(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [signature, setSignature] = useState('');
    const [successData, setSuccessData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useCustomSnackbar();
    const handleCapture = (imageSrc: string) => {
        setCapturedImage(imageSrc);
        handleSubmitToAPI(imageSrc)
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    const handleSignatureChange = (signature: string) => {
        setSignature(signature);
    }

  

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().toLocaleString());
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, []);

    const handleSubmitToAPI = async (imageSrc: string) => {
        const data = {
            borrowId: userData.borrowType === 'Visitor' ? userData.rfid : userData.code,
            borrowerType: userData.borrowType,
            roomId: selectedRoom.id,
            signReceive: signature,
            imageReceive: imageSrc,
            equiments: selectedItems.map((item: any) => ({
                id: item.id,
                equimentName: item.name,
                quantily: item.quantity
            }))
        };

        try {
            const response = await BorrowService.createBorrowLog(data);

            if (response) {
                showSuccess('Đã gửi yêu cầu mượn thành công!');
                setStatus(1);
                setSuccessData({
                    ...response,
                    borrowTime: now,
                    roomCode: selectedRoom.roomCode,
                    userName: userData.name
                });
            }
        } catch (error) {
            showError("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
    };


    const handleSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        if (!webcamRef.current.capture()) {
            showError("Vui lòng cung cấp quyền camera");
            setIsSubmitting(false);
            return;
        }
    }
    
    if (status === 0) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Card sx={{ width: '100%', maxWidth: '600px' }}>
                    <CardContent sx={{ borderBottom: `1px dashed ${theme.palette.divider}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => onChange(false)}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant='h6' color={theme.palette.text.primary}>Xác nhận thông tin đơn</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, color: theme.palette.text.disabled }}>
                                <Typography variant='subtitle1' color={theme.palette.text.primary}>Địa điểm: {selectedRoom?.roomCode}</Typography>
                                <Typography variant='caption'>Thời điểm: {now}</Typography>
                                <InfoComponent type={userData?.borrowType} userData={userData} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <WebcamCapture onCapture={handleCapture} ref={webcamRef} />
                            </Box>
                        </Box>
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant='subtitle1' color={theme.palette.primary.main}>Thiết bị mượn</Typography>
                        <Stack spacing={1.5}>
                            {selectedItems?.map((item: any, index: number) => (
                                <Grid container spacing={1} key={index}>
                                    <Grid item xs={0.5}>
                                        <Typography variant="body2" color={theme.palette.text.secondary}>{index + 1}.</Typography>
                                    </Grid>
                                    <Grid item xs={5.5} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2">{item.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color={theme.palette.text.secondary}>x{item.quantity}</Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Stack>
                    </CardContent>

                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button fullWidth variant='contained' disabled={signature===''} onClick={handleSubmit}>Xác nhận mượn</Button>
                        <Box>
                            <IconTextComponent icon={<ReportIcon />} text="Thiết bị mượn phải được xác nhận trả sau buổi học. Người mượn vi phạm sẽ bị nhắc nhở!" type="warning" />
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ width: 'fit-content', height: 'fit-content' }}>
                    <CardContent sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
                        <SignatureComponent onChange={handleSignatureChange} />
                    </CardContent>
                </Card>

            </Container>

        )
    }
    else {
        return <CompleteCard data={successData}></CompleteCard>
    }


}