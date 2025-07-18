export interface PayPeriodSettings {
  type: "weekly" | "biweekly" | "fortnightly" | "monthly" | "4-weekly" | "semimonthly";
  startDay: number; // 0 = Sunday, 1 = Monday, etc.
  customStartDate?: string; // Optional custom start date for pay period calculation
}

export interface PayPeriod {
  start: Date;
  end: Date;
  label: string;
}

export function calculatePayPeriod(
  date: Date,
  settings: PayPeriodSettings,
  offset: number = 0 // -1 for previous, 0 for current, 1 for next
): PayPeriod {
  console.log("Calculating pay period for:", date, "settings:", settings, "offset:", offset);
  
  // Use custom start date if provided, otherwise use the input date
  const referenceDate = settings.customStartDate ? new Date(settings.customStartDate) : date;
  console.log("Using reference date:", referenceDate);
  
  let periodStart: Date;
  let periodEnd: Date;
  
  switch (settings.type) {
    case "weekly":
      if (settings.customStartDate) {
        // For custom start date, calculate from that specific date
        periodStart = new Date(referenceDate);
        periodStart.setDate(periodStart.getDate() + (offset * 7));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 6);
      } else {
        periodStart = getWeekStart(referenceDate, settings.startDay);
        periodStart.setDate(periodStart.getDate() + (offset * 7));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 6);
      }
      break;
      
    case "biweekly":
    case "fortnightly":
      if (settings.customStartDate) {
        // For custom start date, calculate biweekly periods from that date
        periodStart = new Date(referenceDate);
        periodStart.setDate(periodStart.getDate() + (offset * 14));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 13);
      } else {
        periodStart = getWeekStart(referenceDate, settings.startDay);
        // Find the correct biweekly period
        const weeksSinceEpoch = Math.floor((periodStart.getTime() - new Date('1970-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
        const fortnightOffset = Math.floor(weeksSinceEpoch / 2) * 2;
        periodStart = new Date('1970-01-01');
        periodStart.setDate(periodStart.getDate() + (fortnightOffset * 7) + (offset * 14));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 13);
      }
      break;
      
    case "4-weekly":
      if (settings.customStartDate) {
        // For custom start date, calculate 4-weekly periods from that date
        periodStart = new Date(referenceDate);
        periodStart.setDate(periodStart.getDate() + (offset * 28));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 27);
      } else {
        periodStart = getWeekStart(referenceDate, settings.startDay);
        const weeksSince4Weekly = Math.floor((periodStart.getTime() - new Date('1970-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
        const fourWeekOffset = Math.floor(weeksSince4Weekly / 4) * 4;
        periodStart = new Date('1970-01-01');
        periodStart.setDate(periodStart.getDate() + (fourWeekOffset * 7) + (offset * 28));
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 27);
      }
      break;
      
    case "monthly":
      if (settings.customStartDate) {
        // For custom start date, calculate monthly periods from that date
        periodStart = new Date(referenceDate);
        periodStart.setMonth(periodStart.getMonth() + offset);
        periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        periodEnd.setDate(periodEnd.getDate() - 1);
      } else {
        periodStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + offset, 1);
        periodEnd = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + offset + 1, 0);
      }
      break;
      
    default:
      throw new Error(`Unsupported pay period type: ${settings.type}`);
  }
  
  const label = formatPayPeriodLabel(periodStart, periodEnd, settings.type);
  
  return {
    start: periodStart,
    end: periodEnd,
    label
  };
}

function getWeekStart(date: Date, startDay: number): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + startDay;
  if (day < startDay) {
    d.setDate(diff - 7);
  } else {
    d.setDate(diff);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatPayPeriodLabel(start: Date, end: Date, type: string): string {
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  switch (type) {
    case "weekly":
      return `Week of ${startStr} - ${endStr}`;
    case "biweekly":
      return `Bi-week ${startStr} - ${endStr}`;
    case "fortnightly":
      return `Fortnight ${startStr} - ${endStr}`;
    case "4-weekly":
      return `4-Week Period ${startStr} - ${endStr}`;
    case "monthly":
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    default:
      return `${startStr} - ${endStr}`;
  }
}

export function getCurrentPayPeriod(settings: PayPeriodSettings): PayPeriod {
  const referenceDate = settings.customStartDate ? new Date(settings.customStartDate) : new Date();
  return calculatePayPeriod(referenceDate, settings, 0);
}

export function getPreviousPayPeriod(settings: PayPeriodSettings, currentPeriod?: PayPeriod): PayPeriod {
  const referenceDate = currentPeriod ? currentPeriod.start : new Date();
  return calculatePayPeriod(referenceDate, settings, -1);
}

export function getNextPayPeriod(settings: PayPeriodSettings, currentPeriod?: PayPeriod): PayPeriod {
  const referenceDate = currentPeriod ? currentPeriod.start : new Date();
  return calculatePayPeriod(referenceDate, settings, 1);
}