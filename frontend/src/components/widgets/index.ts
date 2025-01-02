import LeaderboardWidget from './LeaderboardWidget';
import NewsWidget from './NewsWidget';
import EconomicCalendarWidget from './EconomicCalendarWidget';
import StatWidget from './StatWidget';
import AverageRRWidget from './AverageRRWidget';
import WidgetSelector from './WidgetSelector';
import AddWidgetModal from './AddWidgetModal';

console.log('Widgets loaded:', {
  LeaderboardWidget: !!LeaderboardWidget,
  NewsWidget: !!NewsWidget,
  EconomicCalendarWidget: !!EconomicCalendarWidget,
  StatWidget: !!StatWidget,
  AverageRRWidget: !!AverageRRWidget
});

export {
  LeaderboardWidget,
  NewsWidget,
  EconomicCalendarWidget,
  StatWidget,
  AverageRRWidget,
  WidgetSelector,
  AddWidgetModal
}; 