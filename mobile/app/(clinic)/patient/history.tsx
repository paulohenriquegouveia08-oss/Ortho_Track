import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clinicApi, usageApi } from '../../../src/services/api';
import { colors, spacing, borderRadius } from '../../../src/theme/spacing';

type Period = 'today' | 'week' | 'month';

export default function PatientHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('today');

  const fetchData = useCallback(async () => {
    try {
      const [patientData, historyData, reportData] = await Promise.all([
        clinicApi.patientDetails(id!),
        usageApi.history(id!),
        usageApi.report(id!),
      ]);
      setPatient(patientData);
      setHistory(historyData || []);
      setReport(reportData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatSeconds = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getStatusColor = (status: string) => {
    return status === 'USING' ? colors.success : colors.danger;
  };

  const getStatusText = (status: string) => {
    return status === 'USING' ? 'USANDO' : 'REMOVIDO';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Baixo') return colors.success;
    if (risk === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getEventIcon = (type: string) => {
    return type === 'USING' ? 'checkmark-circle' : 'close-circle';
  };

  const getEventColor = (type: string) => {
    return type === 'USING' ? colors.success : colors.danger;
  };

  const getEventText = (type: string) => {
    return type === 'USING' ? 'Alinhador colocado' : 'Alinhador removido';
  };

  const getEventPeriod = (timestamp: string) => {
    const hour = new Date(timestamp).getHours();
    if (hour < 12) return 'Manhã';
    if (hour < 18) return 'Tarde';
    return 'Noite';
  };

  const getFilteredHistory = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return history.filter(event => {
      const eventDate = new Date(event.timestamp);
      
      switch (period) {
        case 'today':
          return eventDate >= today;
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return eventDate >= weekAgo;
        }
        case 'month': {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return eventDate >= monthAgo;
        }
        default:
          return true;
      }
    });
  };

  const calculatePeriodStats = () => {
    const filtered = getFilteredHistory();
    const usingEvents = filtered.filter(e => e.type === 'USING');
    const removedEvents = filtered.filter(e => e.type === 'REMOVED');

    let totalUsage = 0;
    let totalPause = 0;
    let breakCount = 0;

    for (let i = 0; i < filtered.length; i++) {
      const event = filtered[i];
      const nextEvent = filtered[i + 1];

      if (event.type === 'USING' && nextEvent?.type === 'REMOVED') {
        totalUsage += (new Date(nextEvent.timestamp).getTime() - new Date(event.timestamp).getTime()) / 1000;
      } else if (event.type === 'REMOVED' && nextEvent?.type === 'USING') {
        totalPause += (new Date(nextEvent.timestamp).getTime() - new Date(event.timestamp).getTime()) / 1000;
        breakCount++;
      }
    }

    return {
      usage: Math.round(totalUsage),
      pause: Math.round(totalPause),
      breaks: breakCount,
      longestBreak: totalPause > 0 ? Math.round(totalPause / Math.max(breakCount, 1)) : 0,
    };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <Text style={{ color: colors.subtext }}>Carregando...</Text>
      </View>
    );
  }

  const periodStats = calculatePeriodStats();
  const filteredHistory = getFilteredHistory();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, paddingTop: 50, paddingBottom: 16, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.white }}>
              Histórico do Paciente
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor(report?.currentStatus) }} />
              <Text style={{ fontSize: 13, color: colors.white, opacity: 0.9 }}>{getStatusText(report?.currentStatus)}</Text>
              {report?.risk && (
                <View style={{ backgroundColor: getRiskColor(report.risk), paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                  <Text style={{ fontSize: 10, color: colors.white, fontWeight: '600' }}>Risco {report.risk}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Period Selector */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: 4, marginBottom: spacing.lg }}>
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: borderRadius.sm,
                backgroundColor: period === p ? colors.primary : 'transparent',
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: '600',
                color: period === p ? colors.white : colors.subtext,
              }}>
                {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Resumo do Período</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={14} color={colors.primary} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Uso no período</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>
              {formatSeconds(periodStats.usage)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="pause-outline" size={14} color={colors.warning} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Tempo sem uso</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.warning }}>
              {formatSeconds(periodStats.pause)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Quantidade de pausas</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
              {periodStats.breaks}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={14} color={colors.danger} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Maior pausa</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
              {formatSeconds(periodStats.longestBreak)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="shield-checkmark-outline" size={14} color={getRiskColor(report?.risk || 'Baixo')} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Risco</Text>
            </View>
            <View style={{ backgroundColor: getRiskColor(report?.risk || 'Baixo'), paddingHorizontal: 6, paddingVertical: 2, borderRadius: borderRadius.sm }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.white }}>{report?.risk || 'Baixo'}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
              <Text style={{ fontSize: 12, color: colors.subtext }}>Mínimo recomendado</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.warning }}>18h/dia</Text>
          </View>
        </View>

        {/* Events List */}
        <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Eventos</Text>
            <Text style={{ fontSize: 12, color: colors.subtext }}>{filteredHistory.length} eventos</Text>
          </View>

          {filteredHistory.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Ionicons name="calendar-outline" size={32} color={colors.border} />
              <Text style={{ fontSize: 13, color: colors.subtext, marginTop: spacing.sm }}>Nenhum evento neste período</Text>
            </View>
          ) : (
            filteredHistory.map((event, index) => (
              <View key={event.id || index}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
                  <View style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 18, 
                    backgroundColor: getEventColor(event.type) + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing.md
                  }}>
                    <Ionicons name={getEventIcon(event.type)} size={18} color={getEventColor(event.type)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                      {getEventText(event.type)}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.subtext }}>
                      {getEventPeriod(event.timestamp)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text }}>
                      {new Date(event.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.subtext }}>
                      {new Date(event.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </Text>
                  </View>
                </View>
                {index < filteredHistory.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 52 }} />
                )}
              </View>
            ))
          )}
        </View>

        {/* Clinical Feedback */}
        <View style={{ backgroundColor: colors.successLight, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Ionicons name="medical-outline" size={16} color={colors.success} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>Feedback Clínico</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
            {(report?.risk || 'Baixo') === 'Alto'
              ? 'Paciente com baixa aderência no período. Recomenda-se reforçar a orientação de uso mínimo diário.'
              : (report?.risk || 'Baixo') === 'Medio'
                ? 'Aderência moderada. Continue incentivando o uso regular do alinhador.'
                : 'Excelente aderência. O paciente está seguindo bem o tratamento.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
