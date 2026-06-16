/**
 * 判斷該圖示是否為自訂圖片路徑或 Base64 數據
 * @param icon 圖示字串
 */
export const isImageIcon = (icon: string | undefined): boolean => {
    if (!icon) return false;
    return icon.includes('/') || icon.includes('.') || icon.startsWith('data:image');
};

/**
 * 解析圖示的完整資源路徑，自動補全 baseUrl
 * @param icon 圖示字串或路徑
 */
export const resolveIconPath = (icon: string | undefined): string => {
    if (!icon) return '';
    if (icon.startsWith('http') || icon.startsWith('data:image')) {
        return icon;
    }
    const cleanIcon = icon.startsWith('/') ? icon.slice(1) : icon;
    const baseUrl = import.meta.env.BASE_URL || '/';
    const formattedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${formattedBase}${cleanIcon}`;
};
