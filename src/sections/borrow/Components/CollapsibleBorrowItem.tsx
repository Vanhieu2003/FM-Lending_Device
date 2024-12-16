import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Box, Switch, Typography, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Equipment } from 'src/utils/type';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

interface CollapsibleBorrowItemProps {
    onSelectionChange?: (selectedEquipments: Array<{
        borrowLogCode: string;
        id: string;
        quantityReturn: number;
    }>) => void;
    borrowLogCode: string;
    data: Equipment[];
}


const CollapsibleBorrowItem = ({ onSelectionChange, borrowLogCode, data }: CollapsibleBorrowItemProps) => {
    
    const [quantities, setQuantities] = useState<{ [key: string]: number }>(() => {
        const initialQuantities: { [key: string]: number } = {};
        data.forEach(item => {
            initialQuantities[item.id] = item.quantily;
        });
        return initialQuantities;
    });

    const handleQuantityChange = (equipmentId: string, value: string) => {
        const equipment = data.find(item => item.id === equipmentId);
        if (!equipment) return;

        const newValue = parseInt(value) || 0;
        const limitedValue = Math.min(Math.max(0, newValue), equipment.maxQuantity??equipment.quantily);

        setQuantities(prev => ({
            ...prev,
            [equipmentId]: limitedValue
        }));
    };

    const handleIncrement = (equipmentId: string) => {
        const equipment = data.find(item => item.id === equipmentId);
        if (!equipment) return;

        setQuantities(prev => ({
            ...prev,
            [equipmentId]: Math.min(prev[equipmentId] + 1, equipment.maxQuantity??equipment.quantily)
        }));
    };

    const handleDecrement = (equipmentId: string) => {
        setQuantities(prev => ({
            ...prev,
            [equipmentId]: Math.max(0, prev[equipmentId] - 1)
        }));
    };

    const getSelectedEquipments = () => {
        return Object.entries(quantities)
            .map(([id, quantity]) => ({
                borrowLogCode: borrowLogCode,
                id: id,
                quantityReturn: quantity
            }));
    };

    useEffect(() => {
 
        onSelectionChange?.(getSelectedEquipments());
    }, [quantities]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.map((equipment, index) => (
                <Box
                    key={equipment.id}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{index + 1}.</Typography>
                        <Typography variant="body2">{equipment.equimentName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {quantities[equipment.id] > 0 && (
                            <IconButton 
                                size="small" 
                                onClick={() => handleDecrement(equipment.id)}
                            >
                                <RemoveIcon />
                            </IconButton>
                        )}
                        
                        <TextField
                            size="small"
                            value={quantities[equipment.id]}
                            onChange={(e) => handleQuantityChange(equipment.id, e.target.value)}
                            inputProps={{
                                style: { textAlign: 'center', width: '40px' },
                                min: 0,
                                max: equipment.quantily
                            }}
                        />
                        
                        {quantities[equipment.id] < (equipment.maxQuantity??equipment.quantily) && (
                            <IconButton 
                                size="small" 
                                onClick={() => handleIncrement(equipment.id)}
                            >
                                <AddIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default CollapsibleBorrowItem