import { Box, Typography, Card, CardContent, Stack, Button, Grid, Checkbox, Chip, IconButton, Collapse, Container, useTheme, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReportIcon from '@mui/icons-material/Report';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { equipment } from "src/_mock/_equipment";
import DeviceInput from "./DeviceInput";
import LevelSelect from "src/components/common/common-level-select";
import CollapsibleBorrowItem from "./CollapsibleBorrowItem";
import IconTextComponent from "src/components/common/common-icon-text";
import TextCaptionComponent from "src/components/common/common-text-disable";
import SignatureComponent from "./Signature";
import BorrowService from "src/@core/service/Borrow";
import { InfoComponentWithIcon } from "./InfoComponent";
import SnackbarComponent from "src/components/common/common-snackbar";
import { Equipment } from "src/utils/type";
import InfoCheck from "./InfoCheck";
import RatingCard from "./ReportCard";
import { useCustomSnackbar } from "src/hooks/use-snackbar";




//Step2Component
const RenderLeftContent = ({ onChange, userData, onInfoChange, theme }: any) => {
    const [openInfoCheck, setOpenInfoCheck] = useState(userData?.phone ? false : true);
    const [additionalName, setAdditionalName] = useState<string | null>(null);
    const [additionalPhone, setAdditionalPhone] = useState<string | null>(null);
    const { showSuccess, showError } = useCustomSnackbar();

    const handleVisitorSubmit = async (phone: string, name?: string) => {
        if (userData?.borrowType === 'Visitor') {
            const data = {
                "visitorName": name,
                "phoneNumber": phone
            }
            const response = await BorrowService.updateVisitorInfo(userData?.rfid, data);
            if (response) {
                setAdditionalPhone(phone);
                setAdditionalName(name || '');
                showSuccess("Thông tin đã được cập nhật")
                onInfoChange(phone, name);
            }
        }
        else {
            const response = await BorrowService.updateUserPhoneNumber(userData?.code, userData?.borrowType, phone);
            if (response) {
                setAdditionalPhone(phone);
                showSuccess("Số điện thoại đã được cập nhật");
                onInfoChange(phone);
            }
        }
    };

    const handleAction = (status: boolean) => {
        if (status === false) {
            onChange(status);
        }
    }
    return (<Card>

        <InfoCheck
            openPopUp={openInfoCheck}
            onSubmitInfo={handleVisitorSubmit}
            onAction={handleAction}
            type={userData?.borrowType}
        />
        <CardContent sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
            <Box>
                <Typography variant='subtitle1'>Thông tin đăng ký</Typography>
            </Box>
        </CardContent>
        <CardContent>
            {userData && <InfoComponentWithIcon type={userData?.borrowType} userData={userData} additionalPhone={additionalPhone} additionalName={additionalName} />}
        </CardContent>
    </Card>
    )
}

//Step2Component
const renderBorrowItem = ({ data, isSelected, onSelect }: any) => {
    const theme = useTheme();

    return (
        <Button
            fullWidth
            variant="outlined"
            onClick={() => onSelect(data)}
            sx={{
                display: 'flex',
                gap: 1,
                padding: '10px',
                justifyContent: 'flex-start',
                border: isSelected
                    ? `2px solid ${theme.palette.grey[900]}`
                    : `1px solid ${theme.palette.grey["500Channel"]}`
            }}
        >
            <data.Icon />
            <Typography variant="body2">{data.name}</Typography>
        </Button>
    );
};

//Step2Component
const RenderRightContent = ({ onChange, userData, onSubmit, selectedCampus,theme }: any) => {
    const [selectedItemsDefault, setSelectedItemsDefault] = useState<any[]>([]);
    const [selectedItemsFromList, setSelectedItemsFromList] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const { showSuccess, showError } = useCustomSnackbar();
   

    const deviceOptions = equipment.slice(3,).map(item => ({
        id: item.id,
        name: item.name
    }));
    const handleClick = (type: string) => () => {
        if (type === 'cancel') {
            onChange(false);
        }
        else {
            if (selectedRoom === null || selectedItems.length === 0) {
                showError("Vui lòng chọn đầy đủ thông tin");
            }
            else {
                onSubmit(selectedRoom, selectedItems, userData);
            }
        }
    }

    const handleItemChange = (selectedItemsFromList: any) => {
        setSelectedItemsFromList(selectedItemsFromList)
    }

    const handleItemSelect = (data: any) => {
        setSelectedItemsDefault(prev => {
            const isSelected = prev.some(item => item.id === data.id);
            if (isSelected) {
                return prev.filter(item => item.id !== data.id);
            } else {
                return [...prev, {
                    id: data.id,
                    name: data.name,
                    quantity: 1
                }];
            }
        });
    };
    const handleLevelChange = (value: any) => {
       
        setSelectedRoom(value);
    }
    useEffect(() => {
        setSelectedItems([...selectedItemsDefault, ...selectedItemsFromList])
    }, [selectedItemsDefault, selectedItemsFromList])
    return (
        <Card>
            <CardContent sx={{
                borderBottom: `1px dashed ${theme.palette.divider}`
            }}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Thông tin đề xuất mượn thiết bị</Typography>
                        <TextCaptionComponent text="Lưu ý: chọn đúng phòng sử dụng thiết bị" type="disable" />
                    </Stack>
                    <Stack spacing={1.5}>
                        <TextCaptionComponent text="Vị trí tiếp nhận" type="primary" />
                        <LevelSelect onChange={handleLevelChange} selectedCampus={selectedCampus} />
                    </Stack>
                </Stack>
            </CardContent>
            <CardContent sx={{
                borderBottom: `1px dashed ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
            }}>
                <TextCaptionComponent text="Danh mục thiết bị cần mượn" type="disable" />
                <IconTextComponent icon={<ReportIcon />} text="Kiểm tra thiết bị trước khi tiếp nhận" type="warning" />
                <Grid container spacing={2}>
                    {equipment.slice(0, 3).map((item, index) => (
                        <Grid item xs={4} key={index}>
                            {renderBorrowItem({
                                data: item,
                                isSelected: selectedItemsDefault.some(selected => selected.id === item.id),
                                onSelect: handleItemSelect
                            })}
                        </Grid>
                    ))}
                </Grid>
                <DeviceInput onchange={handleItemChange} deviceOptions={deviceOptions} />
            </CardContent>
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
                    <Button variant="text" sx={{ flex: 1, backgroundColor: theme.palette.grey[100], padding: 0, color:'black' }} onClick={handleClick('cancel')}>Hủy</Button>
                    <Button variant="text" sx={{ flex: 4, color: theme.palette.primary.main, backgroundColor: theme.palette.divider }} onClick={handleClick('confirm')}>Đồng ý</Button>
                </Box>
            </CardContent>

        </Card>
    )
}

const RightContentReturn = ({ onChange, data,theme }: any) => {
    const [modifiedItems, setModifiedItems] = useState<{
        [key: string]: Array<Equipment>
    }>(data.reduce((acc: any, item: any) => {
        acc[item.borrowLogCode] = item.returnedEquipmentIds.map((equipment: Equipment) => ({
            ...equipment,
            maxQuantity: equipment.quantily,
        }));
        return acc;
    }, {}));
    const [returnItems, setReturnItems] = useState<Array<{
        borrowLogCode: string;
        id: string;
        quantityReturn: number;
    }>>(data.flatMap((item: any) =>
        item.returnedEquipmentIds.map((equipment: Equipment) => ({
            borrowLogCode: item.borrowLogCode,
            id: equipment.id,
            quantityReturn: equipment.quantily
        }))
    ));
    const [openRow, setOpenRow] = useState<string | null>(null);
    const [signature, setSignature] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const { showSuccess, showError } = useCustomSnackbar();

    const handleExpandClick = (borrowId: string) => {
        setOpenRow(openRow === borrowId ? null : borrowId);
    };
    const handleSignatureChange = (signature: string) => {
        setSignature(signature);
    }
    const handleClear = () => {
        setNote('');
    }
    const handleReturnItemsChange = (items: Array<{
        borrowLogCode: string;
        id: string;
        quantityReturn: number;
    }>) => {

        const otherItems = returnItems.filter(
            item => item.borrowLogCode !== items[0]?.borrowLogCode
        );


        // Lọc bỏ các items có số lượng là 0 
        const validItems = items.filter(item => item.quantityReturn > 0);


        // Thêm các items mới hợp lệ vào
        setReturnItems([...otherItems, ...validItems]);
    };


    const handleSubmit = async () => {
        const totalEquipmentReturn = returnItems.reduce((acc, item) => acc + item.quantityReturn, 0);
        const totalEquipment = data.reduce((acc: any, item: any) => acc + item.totalEquipment, 0);
        const borrowLogCodes = Array.from(new Set(returnItems.map(item => item.borrowLogCode)))
        const returnData = {
            borrowLogCode: borrowLogCodes,
            signReturn: signature,
            note: note,
            returnedEquipmentIds: returnItems
        };
        // if (totalEquipmentReturn === totalEquipment) {
        //     setOpenRating(true);
        //     return;
        // }
        const response = await BorrowService.updateBorrowLog(returnData);
        if (response) {
            showSuccess("Đơn mượn đã được trả thành công");
            onChange(false);
        }
    }
    const RatingDialog = () => {
        return openRating ? (
            <RatingCard
                openPopUp={openRating}
                onClose={() => setOpenRating(false)}
            />
        ) : null;
    };
    useEffect(() => {
        Object.keys(modifiedItems).forEach(borrowLogCode => {
            modifiedItems[borrowLogCode].forEach(item => {
                const returnItem = returnItems.find(ri => ri.id === item.id);
                if (!returnItem) {
                    item.quantily = 0;
                } else {
                    item.quantily = returnItem.quantityReturn;
                }
            });
        });

    }, [returnItems])
    return (
        <>
            <Card>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Thông tin đơn mượn thiết bị</Typography>
                        <Typography variant="caption" color={theme.palette.text.disabled}>Lưu ý: Chọn đúng phòng</Typography>
                    </Stack>
                    <Typography variant="caption" color={theme.palette.primary.main}>Danh sách đơn mượn</Typography>
                    {data.map((borrowItem: any) => (
                        <Box key={borrowItem.borrowLogCode} sx={{ border: '1px solid #F0F0F0', padding: '10px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 2, justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                        <Typography variant="body2">#{borrowItem.borrowLogCode}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 12, flex: 2, justifyContent: 'center' }}>
                                        <Typography variant="body2">Phòng {borrowItem.roomCode}</Typography>
                                        <Typography variant="body2">{borrowItem.totalEquipment} thiết bị</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end', }}>
                                    <Chip label="Đang mượn" color="warning" sx={{ backgroundColor: '#d4b28c', color: '#6d4c41' }} />
                                    <IconButton onClick={() => handleExpandClick(borrowItem.borrowLogCode)}>
                                        <ExpandMoreIcon sx={{ transform: openRow === borrowItem.borrowLogCode ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Collapse in={openRow === borrowItem.borrowLogCode} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
                                <CollapsibleBorrowItem
                                    onSelectionChange={handleReturnItemsChange}
                                    borrowLogCode={borrowItem.borrowLogCode}
                                    data={modifiedItems[borrowItem.borrowLogCode]} />
                            </Collapse>
                        </Box>
                    ))}

                </CardContent>

                <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <SignatureComponent onChange={handleSignatureChange} />
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                                <Typography variant="subtitle1">Ghi chú</Typography>
                                <Button variant='outlined' onClick={handleClear}>Xóa</Button>
                            </Box>
                            <Box sx={{ height: '8pt' }} />
                            <TextField
                                label="Nhập ghi chú"
                                variant="outlined"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ height: '100%' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button variant="text" sx={{ backgroundColor: theme.palette.grey[100] }} onClick={() => onChange(false)}>Hủy</Button>

                            <Button variant="text" disabled={returnItems.length === 0 || signature === '' || isLoading} sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.divider }} onClick={handleSubmit} >Xác nhận trả đủ</Button>
                        </Box>
                    </Box>
                </CardContent>

            </Card>
            <RatingDialog />
        </>

    )

}

// Step2Content.js
export const Step2Content = ({ onStatusChange, borrowCode, onFormSubmit, data, selectedCampus, onBorrowStateChange }: any) => {
    const [isBorrow, setIsBorrow] = useState(borrowCode.length > 0 || data.isNull === true ? false : true);
    const [userData, setUserData] = useState<any>();
    const [borrowData, setBorrowData] = useState<any>();
    const theme = useTheme()


    const fetchData = async () => {
        if (borrowCode.length > 0) {
            setBorrowData(data);
            setUserData(data[0].borrowerInfo);
        }
        else {
            setUserData(data);
            setBorrowData(data.borrowLog);
        }
    }

    const handleStatusChange = (status: boolean) => {
        onStatusChange(status);
    }

    const handleSubmit = (selectedRoom: any, selectedItems: any, userData: any) => {
        onFormSubmit(selectedRoom, selectedItems, userData);
    }

    const handleInfoChange = (phone: string, name: string) => {
        setUserData((prevUserData: any) => ({
            ...prevUserData,
            phone: phone ? phone : prevUserData.phone,
            name: name ? name : prevUserData.name
        }));
    }


    useEffect(() => { fetchData(), onBorrowStateChange(isBorrow); }, [isBorrow])
    return (
        <Container>
            <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={3}>
                    {userData && <RenderLeftContent onChange={handleStatusChange} userData={userData} onInfoChange={handleInfoChange} theme = {theme} />}
                </Grid>
                <Grid item xs={9}>
                    {isBorrow ? (userData && <RenderRightContent onChange={handleStatusChange} userData={userData} onSubmit={handleSubmit} selectedCampus={selectedCampus} theme = {theme}/>) : (userData && <RightContentReturn onChange={handleStatusChange} data={borrowData} theme={theme}/>)}
                </Grid>
            </Grid>

        </Container>
    )
}