export interface ApiResponse {
  success: boolean;
  originalDate: string;
  businessDate: string;
  adjustments: string[];
  metadata: {
    originalDayOfWeek: string;
    resultDayOfWeek: string;
    isOriginalHoliday: boolean;
    isResultBusinessDay: boolean;
  };
}
