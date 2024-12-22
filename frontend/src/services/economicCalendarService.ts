export interface EconomicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  currency: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast?: string;
  previous?: string;
  description?: string;
}

class EconomicCalendarService {
  private subscribers: ((data: EconomicEvent[]) => void)[] = [];
  private pollingInterval: number | null = null;

  private formatDateForUrl(date: Date): string {
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}${day}.${year}`;
  }

  private parseImpact(impactClass: string): 'High' | 'Medium' | 'Low' {
    if (impactClass.includes('high') || impactClass.includes('red')) return 'High';
    if (impactClass.includes('medium') || impactClass.includes('ora')) return 'Medium';
    return 'Low';
  }

  private extractCalendarData(html: string): EconomicEvent[] {
    try {
      console.log('Starting calendar data extraction...');
      
      // Look for the calendar data in the script tag with a more specific pattern
      const scriptRegex = /window\.calendarComponentStates\[1\]\s*=\s*({[\s\S]*?days:\s*\[([\s\S]*?)\][\s\S]*?});/;
      const match = html.match(scriptRegex);
      
      if (!match) {
        console.error('Could not find calendar data in script. HTML snippet:', html.substring(0, 500));
        return [];
      }

      console.log('Found script match. Parsing JSON...');
      
      try {
        // Extract the days array directly
        const daysRegex = /"events":\[([\s\S]*?)\](?=,|\})/g;
        const daysMatches = match[0].matchAll(daysRegex);
        const events: EconomicEvent[] = [];
        
        for (const dayMatch of daysMatches) {
          if (!dayMatch[1]) continue;
          
          try {
            // Try to parse individual event objects
            const eventRegex = /{[^{}]*?"name":"[^"]*?"[^{}]*?}/g;
            const eventMatches = dayMatch[1].match(eventRegex);
            
            if (!eventMatches) continue;
            
            for (const eventStr of eventMatches) {
              try {
                const event = JSON.parse(eventStr);
                console.log('Processing event:', {
                  name: event.name,
                  forecast: event.forecast,
                  previous: event.previous,
                  actual: event.actual
                });

                if (!event.name) continue;

                // Handle time format
                let timeStr = event.timeLabel || 'All Day';
                if (timeStr !== 'All Day') {
                  const timeParts = timeStr.match(/(\d+):(\d+)(am|pm)/i);
                  if (timeParts) {
                    let [_, hours, minutes, ampm] = timeParts;
                    let hour = parseInt(hours);
                    if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
                    if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
                    timeStr = `${hour.toString().padStart(2, '0')}:${minutes}`;
                  }
                }

                const newEvent = {
                  id: event.id.toString(),
                  title: event.name,
                  date: new Date(event.dateline * 1000).toISOString().split('T')[0],
                  time: timeStr,
                  currency: event.currency || 'USD',
                  impact: this.parseImpact(event.impactClass || ''),
                  actual: event.actual && event.actual !== '' ? event.actual : undefined,
                  forecast: event.forecast && event.forecast !== '' ? event.forecast : undefined,
                  previous: event.previous && event.previous !== '' ? event.previous : undefined,
                  description: event.notice || undefined
                };

                console.log('Created event:', newEvent);
                events.push(newEvent);
              } catch (eventError) {
                console.error('Error parsing individual event:', eventError);
                console.error('Event string that failed:', eventStr);
                continue;
              }
            }
          } catch (dayError) {
            console.error('Error processing day events:', dayError);
            continue;
          }
        }

        console.log(`Total events processed: ${events.length}`);

        // Sort events by date and time
        events.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          if (a.time === 'All Day') return -1;
          if (b.time === 'All Day') return 1;
          return a.time.localeCompare(b.time);
        });

        return events;
      } catch (parseError) {
        console.error('Error parsing calendar data:', parseError);
        console.error('Raw data that failed to parse:', match[0].substring(0, 1000));
        return [];
      }
    } catch (error) {
      console.error('Error extracting calendar data:', error);
      return [];
    }
  }

  public async fetchEvents(): Promise<EconomicEvent[]> {
    try {
      console.log('Starting calendar fetch...');
      const dateStr = 'dec31.2024';
      const targetUrl = `https://www.forexfactory.com/calendar?week=${dateStr}&permalink=true&impacts=3,2,1,0&event_types=1,2,3,4,5,7,8,9,10,11&currencies=9`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      console.log('Fetching through proxy:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        throw new Error(`Failed to fetch calendar: ${response.status}`);
      }

      console.log('Fetch successful, getting text...');
      const html = await response.text();
      console.log('HTML length:', html.length);
      console.log('HTML preview:', html.substring(0, 500));

      const events = this.extractCalendarData(html);
      console.log('Final events:', events);
      return events;
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      return [];
    }
  }

  public startPolling() {
    console.log('Starting economic calendar polling...');
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial fetch
    this.fetchAndNotify();

    // Set up polling every 5 minutes
    this.pollingInterval = window.setInterval(() => {
      console.log('Polling for new economic calendar data...');
      this.fetchAndNotify();
    }, 300000);
  }

  private async fetchAndNotify() {
    const events = await this.fetchEvents();
    console.log('Notifying subscribers with events:', events.length);
    this.notifySubscribers(events);
  }

  public subscribe(callback: (data: EconomicEvent[]) => void) {
    this.subscribers.push(callback);
    console.log('New subscriber added. Total subscribers:', this.subscribers.length);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
      console.log('Subscriber removed. Remaining subscribers:', this.subscribers.length);
    };
  }

  private notifySubscribers(data: EconomicEvent[]) {
    console.log(`Notifying ${this.subscribers.length} subscribers with ${data.length} events`);
    this.subscribers.forEach(callback => callback(data));
  }

  public stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Economic calendar polling stopped');
    }
  }
}

const economicCalendarService = new EconomicCalendarService();
export default economicCalendarService; 