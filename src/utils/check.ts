export const isNumeric = (value: string): boolean => {
    // Kiểm tra xem chuỗi có chỉ chứa số hay không
    return /^\d+$/.test(value);
};