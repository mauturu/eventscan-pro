export interface Guest {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  giftCount: number;
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
