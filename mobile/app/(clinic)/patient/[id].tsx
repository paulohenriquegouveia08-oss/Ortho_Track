import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clinicApi, usageApi } from '../../../src/services/api';
import { colors, spacing, borderRadius } from '../../../src/theme/spacing';

type Period = 'today' | 'week' | 'month';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('today');

  const fetchData = useCallback(async () => {
    try {
      const [patientData, reportData] = await Promise.all([
        clinicApi.patientDetails(id!),
        usageApi.report(id!),
      ]);
      setPatient(patientData);
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

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    return status === 'USING' ? colors.success : colors.danger;
  };

  const getStatusText = (status: string) => {
    return status === 'USING' ? 'USANDO' : 'REMOVIDO';
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return colors.success;
    if (adherence >= 75) return colors.warning;
    return colors.danger;
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Baixo') return colors.success;
    if (risk === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getWeekdayName = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return days[dt.getDay()];
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <Text style={{ color: colors.subtext }}>Carregando...</Text>
      </View>
    );
  }

  const today = report?.today || {};
  const weekly = report?.weekly || {};

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
              {patient?.name || patient?.user?.name || 'Paciente'}
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

        {/* Today View */}
        {period === 'today' && (
          <>
            {/* Status Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Status Atual</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 60, height: 60, borderRadius: 30,
                  backgroundColor: getStatusColor(report?.currentStatus),
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Ionicons
                    name={report?.currentStatus === 'USING' ? 'checkmark' : 'close'}
                    size={30}
                    color={colors.white}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                    {getStatusText(report?.currentStatus)}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.subtext }}>
                    {report?.currentStatus === 'USING' ? 'Alinhador sendo utilizado' : 'Alinhador removido'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Usage Stats */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.md }}>
              <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' }}>
                <Ionicons name="time-outline" size={24} color={colors.primary} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 4 }}>
                  {formatHours(today.usageSeconds || 0)}h
                </Text>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Uso Hoje</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' }}>
                <Ionicons name="pause-outline" size={24} color={colors.warning} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 4 }}>
                  {formatHours(today.pauseSeconds || 0)}h
                </Text>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Pausa Hoje</Text>
              </View>
            </View>

            {/* Adherence Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Aderência</Text>
                <View style={{ backgroundColor: getAdherenceColor(today.adherence || 0), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>{today.adherence || 0}%</Text>
                </View>
              </View>
              <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${Math.min(today.adherence || 0, 100)}%`, backgroundColor: getAdherenceColor(today.adherence || 0), borderRadius: 4 }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Meta: 22h/dia</Text>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Mínimo: 18h/dia</Text>
              </View>
            </View>

            {/* Break Stats */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.md }}>
              <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md }}>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Pausas</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{today.breakCount || 0}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md }}>
                <Text style={{ fontSize: 11, color: colors.subtext }}>Maior Pausa</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                  {formatSeconds(today.longestBreakSeconds || 0)}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Week View */}
        {period === 'week' && (
          <>
            {/* Weekly Summary Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Resumo Semanal</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Média diária</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>
                  {formatSeconds(Math.round(weekly.avgSeconds || 0))}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={getAdherenceColor(weekly.avgAdherence || 0)} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Aderência</Text>
                </View>
                <View style={{ backgroundColor: getAdherenceColor(weekly.avgAdherence || 0), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>{weekly.avgAdherence || 0}%</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={getRiskColor(report?.risk || 'Baixo')} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Risco</Text>
                </View>
                <View style={{ backgroundColor: getRiskColor(report?.risk || 'Baixo'), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>{report?.risk || 'Baixo'}</Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="trophy-outline" size={14} color={colors.success} />
                  <Text style={{ fontSize: 12, color: colors.subtext }}>Melhor dia</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                  {weekly.bestDay ? formatSeconds(Math.round(weekly.bestDay.usageSeconds)) : '-'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
                  <Text style={{ fontSize: 12, color: colors.subtext }}>Pior dia</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                  {weekly.worstDay ? formatSeconds(Math.round(weekly.worstDay.usageSeconds)) : '-'}
                </Text>
              </View>

              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <Text style={{ fontSize: 12, color: colors.subtext }}>Mínimo recomendado</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.warning }}>18h/dia</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.subtext }}>Meta ideal</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>22h/dia</Text>
              </View>
            </View>

            {/* Daily Chart */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.md }}>Últimos 7 dias</Text>
              {(weekly.days || []).map((day: any, index: number) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>
                      {getWeekdayName(day.date)} ({day.date?.split('-').slice(1).reverse().join('/')})
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.subtext }}>
                      {formatHours(day.usageSeconds)}h
                    </Text>
                  </View>
                  <View style={{ height: 20, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{
                      height: '100%',
                      width: `${Math.min((day.usageSeconds / (22 * 3600)) * 100, 100)}%`,
                      backgroundColor: getAdherenceColor(day.adherence),
                      borderRadius: 4,
                    }} />
                  </View>
                  <Text style={{ fontSize: 10, color: colors.subtext, marginTop: 2 }}>{day.adherence}% aderência</Text>
                </View>
              ))}
            </View>

            {/* Weekly Breaks Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Pausas da Semana</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="pause-circle-outline" size={18} color={colors.warning} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Total de pausas</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                  {weekly.totalBreaks || 0}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="time-outline" size={18} color={colors.danger} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Maior pausa</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                  {weekly.longestBreak ? formatSeconds(Math.round(weekly.longestBreak)) : '-'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Média por dia</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                  {weekly.days?.length ? Math.round((weekly.totalBreaks || 0) / weekly.days.length) : 0}
                </Text>
              </View>
            </View>

            {/* Weekly Feedback */}
            <View style={{ backgroundColor: colors.successLight, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>Feedback</Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
                {(weekly.avgAdherence || 0) < 50
                  ? 'A média semanal está abaixo do mínimo recomendado. O paciente tem risco de atraso no tratamento.'
                  : (weekly.avgAdherence || 0) < 90
                    ? 'Bom progresso semanal. Continue incentivando o uso regular do alinhador.'
                    : 'Excelente aderência semanal. O paciente está seguindo bem o tratamento.'}
              </Text>
            </View>
          </>
        )}

        {/* Month View */}
        {period === 'month' && (
          <>
            {/* Monthly Summary Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Resumo Mensal</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Média diária</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>
                  {formatSeconds(Math.round(weekly.avgSeconds || 0))}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={getAdherenceColor(weekly.avgAdherence || 0)} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Aderência</Text>
                </View>
                <View style={{ backgroundColor: getAdherenceColor(weekly.avgAdherence || 0), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>{weekly.avgAdherence || 0}%</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={getRiskColor(report?.risk || 'Baixo')} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Risco</Text>
                </View>
                <View style={{ backgroundColor: getRiskColor(report?.risk || 'Baixo'), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.white }}>{report?.risk || 'Baixo'}</Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.sm }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="trophy-outline" size={14} color={colors.success} />
                  <Text style={{ fontSize: 12, color: colors.subtext }}>Melhor dia</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                  {weekly.bestDay ? formatSeconds(Math.round(weekly.bestDay.usageSeconds)) : '-'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
                  <Text style={{ fontSize: 12, color: colors.subtext }}>Pior dia</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                  {weekly.worstDay ? formatSeconds(Math.round(weekly.worstDay.usageSeconds)) : '-'}
                </Text>
              </View>
            </View>

            {/* Goals Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Metas</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Uso ideal</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>22h/dia</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Mínimo recomendado</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.warning }}>18h/dia</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="trending-up-outline" size={18} color={colors.primary} />
                  <Text style={{ fontSize: 13, color: colors.subtext }}>Aderência desejada</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>90%+</Text>
              </View>
            </View>

            {/* Risk Assessment Card */}
            <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm }}>Classificação de Risco</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 50, height: 50, borderRadius: 25,
                  backgroundColor: getRiskColor(report?.risk || 'Baixo'),
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Ionicons
                    name={report?.risk === 'Baixo' ? 'checkmark-circle' : report?.risk === 'Medio' ? 'warning' : 'alert-circle'}
                    size={24}
                    color={colors.white}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                    Risco {report?.risk || 'Baixo'}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.subtext }}>
                    {report?.risk === 'Baixo' ? 'Aderência excelente' :
                     report?.risk === 'Medio' ? 'Aderência moderada' :
                     'Aderência insuficiente'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Feedback */}
        {report?.feedback && (
          <View style={{ backgroundColor: colors.successLight, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.success }}>Feedback</Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>{report.feedback}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
