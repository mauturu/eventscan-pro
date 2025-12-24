export interface Guest {
  id: string;
  name: string;
  phone: string;
  gift: boolean;
  checkedInAt: Date;
}

export interface QRGuestData {
  name: string;
  phone: string;
}

export interface CSVGuest {
  name: string;
  phone: string;
}
