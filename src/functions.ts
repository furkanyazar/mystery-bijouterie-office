export const setCookie = (name: string, value: string, expiration: string): void => {
  const date = new Date(expiration);
  document.cookie = name = name + "=" + (value || "") + "; Path=/; Expires=" + date.toUTCString();
};

export const getCookie = (name: string): string => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const removeCookie = (name: string): void => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, setValues: (newValues: any) => void) =>
  setValues((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

export const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>, setValues: (newValues: any) => void) =>
  setValues((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

export const handleChangeCheck = (e: React.ChangeEvent<HTMLInputElement>, setValues: (newValues: any) => void) =>
  setValues((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

export const formatCurrency = (price: number) => Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
