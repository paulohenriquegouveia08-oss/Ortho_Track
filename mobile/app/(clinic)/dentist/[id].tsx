import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clinicApi } from '../../../src/services/api';
import { colors, spacing, borderRadius } from '../../../src/theme/spacing';

interface DentistInfo {
  id: string;
  name: string;
  email: string;
  patientCount: number;
}

interface DentistPatient {
  id: string;
  name: string;
  currentStatus: string;
  todayUsageSeconds: number;
  adherence: number;
}

export default function DentistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [dentist, setDentist] = useState<DentistInfo | null>(null);
  const [patients, setPatients] = useState<DentistPatient[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [dentistData, patientsData] = await Promise.all([
        clinicApi.dentistDetails(id!),
        clinicApi.dentistPatients(id!),
      ]);
      setDentist(dentistData);
      setPatients(patientsData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar dados');
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

  const handleOpenLinkModal = async () => {
    setShowLinkModal(true);
    try {
      const patientsData = await clinicApi.users();
      setAllPatients(patientsData?.patients || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const handleLinkPatient = async (patientId: string) => {
    try {
      await clinicApi.linkPatientToDentist(id!, patientId);
      setShowLinkModal(false);
      fetchData();
      Alert.alert('Sucesso', 'Paciente vinculado ao dentista');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao vincular paciente');
    }
  };

  const handleUnlinkPatient = async (patientId: string, patientName: string) => {
    Alert.alert(
      'Desvincular Paciente',
      `Deseja desvincular ${patientName} deste dentista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: async () => {
            try {
              await clinicApi.unlinkPatientFromDentist(id!, patientId);
              fetchData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Falha ao desvincular');
            }
          },
        },
      ]
    );
  };

  const formatSeconds = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getStatusColor = (status: string) => {
    return status === 'USING' ? colors.success : colors.danger;
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return colors.success;
    if (adherence >= 75) return colors.warning;
    return colors.danger;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <Text style={{ color: colors.subtext }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, paddingTop: 50, paddingBottom: 16, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.white }}>{dentist?.name}</Text>
            <Text style={{ fontSize: 13, color: colors.white, opacity: 0.8 }}>{dentist?.email}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.lg }}>
          <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>{patients.length}</Text>
            <Text style={{ fontSize: 12, color: colors.subtext }}>Pacientes</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.success }}>
              {patients.filter(p => p.currentStatus === 'USING').length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.subtext }}>Usando Agora</Text>
          </View>
        </View>

        {/* Patients List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Pacientes Vinculados</Text>
          <TouchableOpacity
            onPress={handleOpenLinkModal}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.sm }}
          >
            <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>+ Vincular</Text>
          </TouchableOpacity>
        </View>

        {patients.length === 0 ? (
          <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.xl, alignItems: 'center' }}>
            <Ionicons name="people-outline" size={48} color={colors.subtext} />
            <Text style={{ fontSize: 14, color: colors.subtext, marginTop: spacing.sm }}>Nenhum paciente vinculado</Text>
          </View>
        ) : (
          patients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              onPress={() => router.push(`/(clinic)/patient/${patient.id}`)}
              style={{ backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: getStatusColor(patient.currentStatus) }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{patient.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.subtext }}>
                    {formatSeconds(patient.todayUsageSeconds)} hoje
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ backgroundColor: getAdherenceColor(patient.adherence), paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.white }}>{patient.adherence}%</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleUnlinkPatient(patient.id, patient.name)}>
                  <Ionicons name="close-circle" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Link Patient Modal */}
      {showLinkModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.lg }}>
          <View style={{ backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, maxHeight: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Vincular Paciente</Text>
              <TouchableOpacity onPress={() => setShowLinkModal(false)}>
                <Ionicons name="close" size={24} color={colors.subtext} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 12, color: colors.subtext, marginBottom: spacing.md }}>
              Selecione um paciente para vincular a este dentista
            </Text>
            <ScrollView>
              {allPatients.length === 0 ? (
                <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center', padding: spacing.lg }}>
                  Carregando pacientes...
                </Text>
              ) : (
                allPatients.map((patient: any) => (
                  <TouchableOpacity
                    key={patient.id}
                    onPress={() => handleLinkPatient(patient.id)}
                    style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  >
                    <Text style={{ fontSize: 14, color: colors.text }}>{patient.name || patient.user?.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.subtext }}>{patient.email || patient.user?.email}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
