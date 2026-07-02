import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { usageApi } from '../../src/services/api';
import { formatTimeBR } from '../../src/utils/formatTime';

type Filter = 'today' | 'week' | 'month';

interface DayGroup {
  date: string;
  events: any[];
}

interface TimeGroup {
  label: string;
  icon: string;
  events: any[];
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
];

const TIME_GROUPS: { label: string; icon: string; start: number; end: number }[] = [
  { label: 'Manhã', icon: 'sunny-outline', start: 6, end: 12 },
  { label: 'Tarde', icon: 'partly-sunny-outline', start: 12, end: 18 },
  { label: 'Noite', icon: 'moon-outline', start: 18, end: 6 },
];

function getDayHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const name = dt.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayNum = dt.getDate();
  return `${name.charAt(0).toUpperCase() + name.slice(1)}, ${dayNum}`;
}

function getTimeGroup(timestamp: string): string {
  const hour = new Date(timestamp).getHours();
  if (hour >= 6 && hour < 12) return 'Manhã';
  if (hour >= 12 && hour < 18) return 'Tarde';
  return 'Noite';
}

function getTimeIcon(timestamp: string): string {
  const hour = new Date(timestamp).getHours();
  if (hour >= 6 && hour < 12) return 'sunny-outline';
  if (hour >= 12 && hour < 18) return 'partly-sunny-outline';
  return 'moon-outline';
}

function getDuration(e1: any, e2: any): string | null {
  if (!e2) return null;
  const diff = Math.abs(new Date(e1.timestamp).getTime() - new Date(e2.timestamp).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return null;
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export default function HistoryScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('week');
  const [risk, setRisk] = useState<string>('Baixo');
  const [status, setStatus] = useState<string>('REMOVED');

  const loadData = useCallback(async () => {
    try {
      const pid = await AsyncStorage.getItem('orthotrack_patient_id');
      if (pid) {
        const [historyData, reportData] = await Promise.all([
          usageApi.history(pid),
          usageApi.report(pid),
        ]);
        setEvents(historyData);
        if (reportData?.risk) setRisk(reportData.risk);
        if (reportData?.currentStatus) setStatus(reportData.currentStatus);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const getFilteredEvents = (): any[] => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (filter === 'today') {
      return events.filter(e => (e.date || e.timestamp.split('T')[0]) === todayStr);
    }

    const daysBack = filter === 'week' ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - daysBack);
    cutoff.setHours(0, 0, 0, 0);

    return events.filter(e => new Date(e.timestamp) >= cutoff);
  };

  const groupByDay = (evts: any[]): DayGroup[] => {
    const groups: Record<string, any[]> = {};
    for (const e of evts) {
      const day = e.date || e.timestamp.split('T')[0];
      if (!groups[day]) groups[day] = [];
      groups[day].push(e);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, evts]) => ({ date, events: evts }));
  };

  const groupByTimeOfDay = (evts: any[]): TimeGroup[] => {
    return TIME_GROUPS.map(tg => ({
      label: tg.label,
      icon: tg.icon,
      events: evts.filter(e => {
        const hour = new Date(e.timestamp).getHours();
        if (tg.start < tg.end) {
          return hour >= tg.start && hour < tg.end;
        }
        return hour >= tg.start || hour < tg.end;
      }),
    })).filter(g => g.events.length > 0);
  };

  const getRiskColor = (r: string) => {
    if (r === 'Baixo') return colors.success;
    if (r === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getStatusColor = (s: string) => {
    return s === 'USING' ? colors.success : colors.danger;
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const filteredEvents = getFilteredEvents();
  const dayGroups = groupByDay(filteredEvents);
  const isGrouped = filter !== 'today';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Histórico</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(status) }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
                <Text style={styles.chipText}>{status === 'USING' ? 'USANDO' : 'REMOVIDO'}</Text>
              </View>
              <View style={[styles.riskChip, { backgroundColor: getRiskColor(risk) }]}>
                <Text style={styles.chipText}>Risco {risk}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Segmented Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBg}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.tab, filter === f.key && styles.tabActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, filter === f.key && styles.tabTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="document-text-outline" size={40} color={colors.subtext} />
            </View>
            <Text style={styles.emptyTitle}>Nenhum evento registrado</Text>
            <Text style={styles.emptyText}>
              Quando você colocar ou retirar o alinhador, o evento aparecerá aqui.
            </Text>
          </View>
        )}

        {/* Today View - Grouped by Time of Day */}
        {!isGrouped && filteredEvents.length > 0 && (
          <View style={styles.eventsCard}>
            <Text style={styles.cardTitle}>Eventos de hoje</Text>
            {groupByTimeOfDay(filteredEvents).map(group => (
              <View key={group.label} style={styles.timeGroup}>
                <View style={styles.timeGroupHeader}>
                  <Ionicons name={group.icon as any} size={16} color={colors.primary} />
                  <Text style={styles.timeGroupLabel}>{group.label}</Text>
                  <Text style={styles.timeGroupCount}>{group.events.length}</Text>
                </View>
                {group.events.map((e, i) => (
                  <View key={`${group.label}-${i}`} style={styles.eventRow}>
                    <View style={[styles.eventDot, { backgroundColor: e.type === 'USING' ? colors.success : colors.danger }]} />
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, { color: e.type === 'USING' ? colors.success : colors.danger }]}>
                        {e.type === 'USING' ? 'Alinhador colocado' : 'Alinhador removido'}
                      </Text>
                      <Text style={styles.eventTime}>{formatTimeBR(e.timestamp)}</Text>
                    </View>
                    {i < group.events.length - 1 && (
                      <Text style={styles.eventDuration}>
                        {getDuration(e, group.events[i + 1])}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Week/Month View - Grouped by Day */}
        {isGrouped && dayGroups.map(group => (
          <View key={group.date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={styles.dayHeaderText}>{getDayHeader(group.date)}</Text>
              <Text style={styles.dayCount}>{group.events.length} eventos</Text>
            </View>
            {group.events.map((e, i) => (
              <View key={`${group.date}-${i}`} style={styles.eventRow}>
                <View style={[styles.eventDot, { backgroundColor: e.type === 'USING' ? colors.success : colors.danger }]} />
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: e.type === 'USING' ? colors.success : colors.danger }]}>
                    {e.type === 'USING' ? 'Alinhador colocado' : 'Alinhador removido'}
                  </Text>
                  <Text style={styles.eventTime}>{formatTimeBR(e.timestamp)}</Text>
                </View>
                {i < group.events.length - 1 && (
                  <Text style={styles.eventDuration}>
                    {getDuration(e, group.events[i + 1])}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerChips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  tabsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  tabsBg: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  tabTextActive: {
    color: colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  eventsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: spacing.md,
  },
  timeGroup: {
    marginBottom: spacing.md,
  },
  timeGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  timeGroupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  timeGroupCount: {
    fontSize: 11,
    color: colors.subtext,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  dayCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  dayCount: {
    fontSize: 11,
    color: colors.subtext,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  eventDuration: {
    fontSize: 11,
    color: colors.subtext,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
});
