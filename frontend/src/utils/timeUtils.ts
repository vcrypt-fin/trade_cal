// src/utils/timeUtils.ts

/**
 * Converts a 12-hour time format (e.g., "03:12 PM") to 24-hour format (e.g., "15:12").
 * @param time12h - Time in 12-hour format with AM/PM.
 * @returns Time in 24-hour format.
 */
export function convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutesStr}`;
  }
  
  /**
   * Converts a 24-hour time format (e.g., "15:12") to 12-hour format with AM/PM (e.g., "03:12 PM").
   * @param time24h - Time in 24-hour format.
   * @returns Time in 12-hour format with AM/PM.
   */
  export function convertTo12Hour(time24h: string): string {
    let [hours, minutes] = time24h.split(':').map(Number);
    const modifier = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutesStr} ${modifier}`;
  }
  