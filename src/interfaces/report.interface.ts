interface ICarReport {
  daysNumber: number;
}

export interface ICarsReport {
  [key: string]: ICarReport;
}
