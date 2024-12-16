"use client";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

const QRTest = ({onChange}: {onChange: (qrCodeData: string) => void}) => {
  const [qrCodeData, setQrCodeData] = useState(""); // Lưu dữ liệu QR code
  const [lastInputTime, setLastInputTime] = useState(Date.now()); // Theo dõi thời gian nhập cuối

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const currentTime = Date.now();
      if (activeElement?.tagName === 'INPUT'||activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      

      // Nếu khoảng cách giữa các ký tự nhập lớn, reset chuỗi
      if (currentTime - lastInputTime > 100) {
        setQrCodeData(""); // Reset chuỗi QR code
      }

      setLastInputTime(currentTime);

      // Xử lý ký tự nhập
      if (event.key?.length === 1) {
        setQrCodeData((prev) => prev + event.key); // Thêm ký tự vào chuỗi
      }

      // Kiểm tra phím Enter
      if (event.key === "Enter") {
        onChange(qrCodeData);
      }
    };

    // Lắng nghe sự kiện keydown toàn cục
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [qrCodeData, lastInputTime]); // Đảm bảo cập nhật khi `qrCodeData` hoặc `lastInputTime` thay đổi

  return (
    <Box>
    </Box>
  );
};

export default QRTest;
