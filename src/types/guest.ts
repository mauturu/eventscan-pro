export interface Guest {
  id: string;
  name: string;
  email?: string;
  ticketType?: string;
  checkedInAt: Date;
}

export interface QRData {
  id: string;
  name: string;
  email?: string;
  ticketType?: string;
}
