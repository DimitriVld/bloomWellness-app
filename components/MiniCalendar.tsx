import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const MiniCalendar = ({
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: MiniCalendarProps) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }, [weekOffset]);

  const monthYear = useMemo(() => {
    const date = weekDates[3];
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }, [weekDates]);

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isSelected = (date: Date) => isSameDay(date, selectedDate);

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
    onPrevWeek?.();
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
    onNextWeek?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>{monthYear}</Text>
        <View style={styles.arrows}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={20} color={colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.daysContainer}>
        {weekDates.map((date, index) => {
          const selected = isSelected(date);
          const today = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              style={styles.dayColumn}
              onPress={() => onSelectDate(date)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, today && !selected && styles.todayLabel]}>
                {DAYS[index]}
              </Text>
              <View
                style={[
                  styles.dateCircle,
                  selected && styles.selectedCircle,
                  today && !selected && styles.todayCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    selected && styles.selectedDateText,
                    today && !selected && styles.todayDateText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    textTransform: 'capitalize',
  },
  arrows: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  arrowButton: {
    padding: spacing.xxxs,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: spacing.xxs,
  },
  todayLabel: {
    color: colors.primary,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: colors.primary,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  selectedDateText: {
    color: colors.white,
    fontWeight: '600',
  },
  todayDateText: {
    color: colors.primary,
  },
});

export default MiniCalendar;
