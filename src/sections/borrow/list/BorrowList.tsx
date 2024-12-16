"use client"
import { useEffect, useState } from "react";
import BorrowService from "src/@core/service/Borrow";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Card, Chip, Container, IconButton, MenuItem, Modal, Tooltip, Typography, useTheme, Stack, Divider, CardContent } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExcelJS from 'exceljs';
import FilterComponent from "../Components/FilterBorrowList";
import { useSettingsContext } from "src/components/settings";
import InvoiceAnalytic from "../Components/DailyBorrowAnalytics";
import { Scrollbar } from "src/components/scrollbar";
import { useGlobalContext } from "src/app/Context/GlobalContext";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toggleLoading } from "src/@core/components/loading-screen/loading-overlay";

const SignatureCell = ({ value }: { value: string }) => {
    const [open, setOpen] = useState(false);
    if (!value) return null;
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Box
                className="signature-cell"
                sx={{
                    width: 100,
                    marginTop: '10px',
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',

                }}
                onClick={handleOpen}
            >
                <img
                    src={`data:image/png;base64,${value}`}
                    alt="Signature"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    }}
                />
            </Box>
            {/* Modal không cần hiển thị khi in */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="signature-modal"
                aria-describedby="signature-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none',
                    maxWidth: '120vw',
                    maxHeight: '120vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <img
                        src={`data:image/png;base64,${value}`}
                        alt="Signature Large"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100vh',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
};

const PhoneNumberCell = ({ value }: { value: string }) => {
    const [isHidden, setIsHidden] = useState(true);

    if (!value) return null;

    const formatPhoneNumber = (phone: string) => {
        if (isHidden) {
            const first3 = phone.slice(0, 3);
            const last3 = phone.slice(-3);
            return `${first3}****${last3}`;
        }
        return phone;
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <span>{formatPhoneNumber(value)}</span>
            <Tooltip title={isHidden ? "Hiện số điện thoại" : "Ẩn số điện thoại"}>
                <IconButton
                    size="small"
                    onClick={() => setIsHidden(!isHidden)}
                >
                    {isHidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
            </Tooltip>

        </Box>
    );
};

const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Họ tên', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'departmentCode', headerName: 'Khoa', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'roomCode', headerName: 'Phòng', width: 150, align: 'center', headerAlign: 'center' },
    {
        field: 'phoneNumber',
        headerName: 'Số điện thoại',
        width: 140,
        renderCell: (params: GridRenderCellParams) => (
            <PhoneNumberCell value={params.value} />
        ),
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'borrowDate',
        headerName: 'Ngày mượn',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <span>{params.value.slice(0, -3)}</span>
        ),
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'signReceive',
        headerName: 'Ký mượn',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <SignatureCell value={params.value} />
        ),
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'returnDate',
        headerName: 'Ngày trả',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <span>{params.value ? params.value.slice(0, -3) : ''}</span>
        ),
        align: 'center',
        headerAlign: 'center'
    },
    {
        field: 'signReturn',
        headerName: 'Ký trả',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <SignatureCell value={params.value} />
        ),
        align: 'center',
        headerAlign: 'center'
    },
    { field: 'totalEquipment', headerName: 'Tổng số lượng', width: 150, align: 'center', headerAlign: 'center' },
    {
        field: 'status',
        headerName: 'Trạng thái',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <Chip label={params.value} color={params.value === 'Đang mượn' ? 'warning' : 'success'} sx={{ width: 120 }} variant="soft" icon={params.value === 'Đang mượn' ?<CancelIcon/>:<CheckCircleIcon/>}/>
        ),
        align: 'center',
        headerAlign: 'center'
    },
    { field: 'note', headerName: 'Ghi chú', width: 150, align: 'center', headerAlign: 'center' },
];


const BorrowList = () => {
    const [data, setData] = useState<any>([]);
    const settings = useSettingsContext();
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const fetchBorrowList = async (date: string, selectedCampus: string) => {
        toggleLoading(true);
        const response = await BorrowService.GetAllBorrowList(date, selectedCampus).finally(()=>toggleLoading(false));
        if(response){
            setData(response);
        }
        
    }
    const rows = data.map((item: any, index: number) => ({
        id: index,
        ...item,
        status: item.status === 1 ? 'Đang mượn' : 'Đã trả'
    }));
    const { selectedValue, setSelectedValue } = useGlobalContext();

    useEffect(() => {
        
        if (selectedValue && selectedDate) {
            fetchBorrowList(selectedDate.toISOString(), selectedValue ?? '');
        }
    }, [selectedValue]);

   

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách mượn trả');

        const base64ToBlob = async (base64: string) => {
            try {
                // Xử lý chuỗi base64 nếu có data URL prefix
                const base64String = base64.includes('data:image')
                    ? base64.split(',')[1]
                    : base64;

                // Chuyển base64 thành Blob
                const response = await fetch(`data:image/png;base64,${base64String}`);
                const blob = await response.blob();
                return blob;
            } catch (error) {
                console.error('Lỗi khi chuyển base64 sang Blob:', error);
                return null;
            }
        };

        // Tạo cột
        worksheet.columns = [
            { header: 'Họ và tên', key: 'fullName', width: 20 },
            { header: 'Khoa', key: 'departmentCode', width: 15 },
            { header: 'Phòng', key: 'roomCode', width: 15 },
            { header: 'Số điện thoại', key: 'phoneNumber', width: 15 },
            { header: 'Ngày mượn', key: 'borrowDate', width: 20 },
            { header: 'Chữ ký mượn', key: 'signReceive', width: 15 },
            { header: 'Ngày trả', key: 'returnDate', width: 20 },
            { header: 'Chữ ký trả', key: 'signReturn', width: 15 },
            { header: 'Tổng số lượng', key: 'totalEquipment', width: 15 },
            { header: 'Trạng thái', key: 'status', width: 15 },
            { header: 'Ghi chú', key: 'note', width: 20 },
        ];

        // Thiết lập chiều cao mặc định cho các hàng
        worksheet.properties.defaultRowHeight = 60;

        // Thêm dữ liệu
        for (let index = 0; index < data.length; index++) {
            const item = data[index] as {
                fullName: string;
                departmentCode: string;
                roomCode: string;
                phoneNumber: string;
                borrowDate: string;
                returnDate?: string;
                totalEquipment: number;
                status: number;
                note?: string;
                signReceive?: string;
                signReturn?: string;
            };

            const row = worksheet.addRow({
                fullName: item.fullName,
                departmentCode: item.departmentCode,
                roomCode: item.roomCode,
                phoneNumber: item.phoneNumber,
                borrowDate: item.borrowDate,
                returnDate: item.returnDate || '',
                totalEquipment: item.totalEquipment,
                status: item.status === 1 ? 'Đang mượn' : 'Đã trả',
                note: item.note || '',
            });

            // Thiết lập chiều cao cho hàng hiện tại
            row.height = 60;

            // Xử lý chữ ký mượn
            if (item.signReceive) {
                try {
                    const signReceiveBlob = await base64ToBlob(item.signReceive);
                    if (signReceiveBlob) {
                        const arrayBuffer = await signReceiveBlob.arrayBuffer();
                        const signReceiveImage = workbook.addImage({
                            buffer: Buffer.from(arrayBuffer),
                            extension: 'png',
                        });
                        worksheet.addImage(signReceiveImage, {
                            tl: { col: 5, row: index + 1 },
                            ext: { width: 100, height: 70 }
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi chèn chữ ký mượn:', error);
                }
            }

            // Xử lý chữ ký trả
            if (item.signReturn) {
                try {
                    const signReturnBlob = await base64ToBlob(item.signReturn);
                    if (signReturnBlob) {
                        const arrayBuffer = await signReturnBlob.arrayBuffer();
                        const signReturnImage = workbook.addImage({
                            buffer: Buffer.from(arrayBuffer),
                            extension: 'png',
                        });
                        worksheet.addImage(signReturnImage, {
                            tl: { col: 7, row: index + 1 },
                            ext: { width: 100, height: 70 }
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi chèn chữ ký trả:', error);
                }
            }
        }

        try {
            // Thay đổi cách xuất file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Tạo URL và link tải xuống
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'DanhSachMuonTra.xlsx';

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Lỗi khi xuất file Excel:', error);
        }
    }

    const handleFilter = async (date: any) => {
        if (date !== null && selectedValue) {
            setSelectedDate(date);
            fetchBorrowList(date.toISOString(), selectedValue);
        }

    }
    const handleDateFormat = (stringDate: string) => {
        const dateFormat = stringDate?.slice(0, 10);
        const date = dateFormat?.split('-')[0];
        const month = dateFormat?.split('-')[1];
        const year = dateFormat?.split('-')[2];
        const dateFilter = `${year}-${month}-${date}`;
        return dateFilter;
    }

    const getTotal = (data: any[]) => {
        return data.length;
    }
    const getTotalByStatus = (data: any[], status: number) => {
        if (status === 0) {
            return data.filter((item: any) => item.status === 1 && new Date(handleDateFormat(item.borrowDate)).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)).length
        }
        else {
            return data.filter((item: any) => item.status === status).length;
        }

    }
    const getTotalRoom = (data: any[]) => {
        return new Set(data.map((item: any) => item.roomCode)).size;
    }

    const getPercent = (data: any[], status: number) => {
        return getTotalByStatus(data, status) / getTotal(data) * 100;
    }
   
    
    return (
        <Container maxWidth={settings.compactLayout ? false : 'lg'} sx={{ paddingX: '40px !important' }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant='h4'>Danh sách đơn cấp phát</Typography>
            </Box>
            <Card
                sx={{
                    mb: { xs: 3, md: 3 },
                }}
            >
                <Scrollbar>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                        sx={{ py: 2 }}
                    >
                        <InvoiceAnalytic
                            title="Tổng lượt"
                            total={getTotal(data)}
                            percent={100}
                            icon="solar:bill-list-bold-duotone"
                            color={theme.palette.info.main}
                        />

                        <InvoiceAnalytic
                            title="Đã trả"
                            total={getTotalByStatus(data, 2)}
                            percent={getPercent(data, 2)}
                            icon="solar:file-check-bold-duotone"
                            color={theme.palette.success.main}
                        />

                        <InvoiceAnalytic
                            title="Đang mượn"
                            total={getTotalByStatus(data, 1)}
                            percent={getPercent(data, 1)}
                            icon="solar:sort-by-time-bold-duotone"
                            color={theme.palette.warning.main}
                        />

                        <InvoiceAnalytic
                            title="Chưa trả"
                            total={getTotalByStatus(data, 0)}
                            percent={getPercent(data, 0)}
                            icon="solar:bell-bing-bold-duotone"
                            color={theme.palette.error.main}
                        />

                        <InvoiceAnalytic
                            title="Số phòng mượn"
                            total={getTotalRoom(data)}
                            percent={100}
                            icon="solar:file-corrupted-bold-duotone"
                            color={theme.palette.text.secondary}
                            unit='phòng'
                        />
                    </Stack>
                </Scrollbar>
            </Card>
            <Box sx={{ height: 'fit-content', width: '100%', boxShadow: 3, borderRadius: 2, padding: 2 }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, alignItems: 'center' }}>
                    <FilterComponent onChange={handleFilter} />
                    <Button variant="contained" color="primary" onClick={handleExport} sx={{ height: 'fit-content' }}>Xuất Excel</Button>
                </Box>
                {data.length > 0 ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowHeight={() => 80}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 }
                            }
                        }}
                        autoHeight
                        pagination={true}
                    />
                ):(<Box sx={{textAlign:'center'}}>
                    <Typography variant="h6">Chưa có danh sách mượn nào</Typography>
                </Box>)}
            </Box>
        </Container>
    )
}

export default BorrowList;