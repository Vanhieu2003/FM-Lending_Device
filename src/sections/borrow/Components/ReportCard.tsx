import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'


interface props {
    openPopUp: boolean;
    onClose: () => void;
}

const RatingCard = ({ openPopUp, onClose }: props) => {
    const [open, setOpen] = useState(openPopUp);
    const [rating, setRating] = useState(0);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setOpen(false);
    };
   

    return (
        <Dialog
            open={open}
            onClose={() => {setOpen(false)}}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
                noValidate: true,
            }}
        >
            <DialogTitle>Đánh giá mức độ hài lòng</DialogTitle>
            <DialogContent sx={{height:'90px'}}>
                <DialogContentText>
                    Vui lòng chọn mức độ hài lòng của bạn 😋😋
                </DialogContentText>
                <DialogContentText>
                    <Box sx={{ display: 'flex', justifyContent: 'center',marginY:2 }}>
                        <Rating onChange={(event, value) => setRating(value || 0)} size='large' />
                    </Box>
                </DialogContentText>
           
            </DialogContent>
            <DialogActions>
                <Button type="submit">Xác nhận</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RatingCard