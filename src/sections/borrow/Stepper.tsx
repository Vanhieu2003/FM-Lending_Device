"use client"
import { Box, Button, Container, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import * as React from 'react';
import { useState } from 'react';
import { Step1Content } from './Components/Step1Content';
import { Step2Content } from './Components/Step2Content';
import { Step3Content } from './Components/Step3Content';
import { useSettingsContext } from 'src/components/settings';
import { useGlobalContext } from 'src/app/Context/GlobalContext';



const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
        }),
    },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme }) => ({
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        '& .QontoStepIcon-completedIcon': {
            color: theme.palette.primary.main,
            zIndex: 1,
            fontSize: 18,
        },
        '& .QontoStepIcon-circle': {
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[700],
        }),
        variants: [
            {
                props: ({ ownerState }) => ownerState.active,
                style: {
                    color: theme.palette.primary.main,
                },
            },
        ],
    }),
);
function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}





const StepperComponent = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [isBorrowing, setIsBorrowing] = useState(true);
    const [borrowCode, setBorrowCode] = useState('');
    const [data, setData] = useState<any>();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [userData, setUserData] = useState(null);
    const { selectedValue, setSelectedValue } = useGlobalContext();
    const handleSubmitStep1 = (borrowCode: string, data:any) => {
        setBorrowCode(borrowCode);
        setData(data);
        handleNext()
    }
    const handleSubmitStep2 = (selectedRoom: any, selectedItems: any, userData: any) => {
        setSelectedRoom(selectedRoom);
        setSelectedItems(selectedItems);
        setUserData(userData);
        setData(userData);  
        handleNext()
    }
    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <Step1Content onSubmit={handleSubmitStep1} />;
            case 1:
                return <Step2Content 
                key={selectedValue} 
                onStatusChange={(status: boolean) => status ? handleNext() : handleBack()} 
                borrowCode={borrowCode} onFormSubmit={handleSubmitStep2} 
                data={data} 
                selectedCampus={selectedValue}
                onBorrowStateChange={handleBorrowStateChange}/>;
            case 2:
                return <Step3Content 
                selectedRoom={selectedRoom} 
                selectedItems={selectedItems} 
                userData={userData} 
                onChange={(status: boolean) => status ? handleNext() : handleBack()}/>;
            default:
                return 'Unknown step';
        }
    }
    const steps = isBorrowing 
        ? ['Nhập thông tin', 'Chọn thiết bị', 'Xác nhận']  // Steps cho mượn
        : ['Nhập thông tin', 'Trả đơn mượn'];  // Steps cho trả
    const settings = useSettingsContext();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleBorrowStateChange = (isBorrow: boolean) => {
        setIsBorrowing(isBorrow);
    };

    

    return (
        <Container maxWidth={settings.compactLayout ? false : 'lg'} sx={{paddingX: '40px !important'}}>
            <Box sx={{  mb: 2 }}>
                <Typography variant='h4'>Đăng ký cấp phát thiết bị</Typography>
            </Box>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>


            <Box sx={{ my: 2 }}>
                {renderStepContent(activeStep)}
            </Box>
        </Container>
    )
}

export default StepperComponent


