import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/store/auth';
import { routineApi } from '../../src/services/api';
import { syncRoutineNotifications } from '../../src/services/routine-notification.service';
import { PatientRoutine, RoutineItem, RoutineItemType } from '../../src/types';
import { MealEditModal } from '../../src/components/MealEditModal';

const DEFAULT_MEAL_NAMES = ['café da manhã', 'cafe da manha', 'almoço', 'almoco', 'jantar'];

function isDefaultMealName(name: string): boolean {
  return DEFAULT_MEAL_NAMES.includes(name.trim().toLowerCase());
}

export default function RoutineScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [routine, setRoutine] = useState<PatientRoutine | null>(null);

  // Modal de edição
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [isNewMeal, setIsNewMeal] = useState(false);

  const loadRoutine = useCallback(async () => {
    try {
      const res = await routineApi.getMyRoutine();
      if (res.hasRoutine && res.routine) {
        setRoutine(res.routine);
        await AsyncStorage.setItem('orthotrack_routine', JSON.stringify(res.routine));
        await syncRoutineNotifications(res.routine, user?.name || 'Paciente', 'USING');
      } else {
        setRoutine(null);
      }
    } catch (err: any) {
      console.log('Erro ao carregar rotina:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  const handleToggleMasterRoutine = async (newValue: boolean) => {
    if (!routine) return;
    try {
      setRoutine((prev) => (prev ? { ...prev, enabled: newValue } : null));
      const res = await routineApi.updateRoutineStatus(newValue);
      if (res.routine) {
        setRoutine(res.routine);
        await AsyncStorage.setItem('orthotrack_routine', JSON.stringify(res.routine));
        await syncRoutineNotifications(res.routine, user?.name || 'Paciente', 'USING');
      }
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível alterar o status da rotina.');
      loadRoutine();
    }
  };

  const handleToggleItem = async (item: RoutineItem) => {
    const updatedStatus = !item.enabled;
    try {
      // Otimista
      setRoutine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map((it) =>
            it.id === item.id ? { ...it, enabled: updatedStatus } : it,
          ),
        };
      });

      const updated = await routineApi.updateItem(item.id, { enabled: updatedStatus });
      setRoutine((prev) => {
        if (!prev) return null;
        const newItems = prev.items.map((it) => (it.id === item.id ? updated : it));
        const updatedRoutine = { ...prev, items: newItems };
        AsyncStorage.setItem('orthotrack_routine', JSON.stringify(updatedRoutine));
        syncRoutineNotifications(updatedRoutine, user?.name || 'Paciente', 'USING');
        return updatedRoutine;
      });
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível atualizar a refeição.');
      loadRoutine();
    }
  };

  const handleOpenEdit = (item: RoutineItem) => {
    setEditingItem(item);
    setIsNewMeal(false);
    setModalVisible(true);
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setIsNewMeal(true);
    setModalVisible(true);
  };

  const handleSaveModal = async (data: {
    name: string;
    type: RoutineItemType;
    startTime: string;
    expectedDurationMinutes: number;
    enabled?: boolean;
  }) => {
    if (isNewMeal) {
      await routineApi.addItem(data);
    } else if (editingItem) {
      await routineApi.updateItem(editingItem.id, data);
    }
    await loadRoutine();
  };

  const handleDeleteModal = async () => {
    if (editingItem) {
      await routineApi.deleteItem(editingItem.id);
      await loadRoutine();
    }
  };

  const getMealIcon = (item: RoutineItem) => {
    const lower = item.name.toLowerCase();
    if (lower.includes('café') || lower.includes('cafe')) return 'cafe-outline';
    if (lower.includes('almoço') || lower.includes('almoco')) return 'restaurant-outline';
    if (lower.includes('jantar') || lower.includes('janta')) return 'moon-outline';
    if (item.type === 'snack') return 'fast-food-outline';
    if (item.type === 'hygiene') return 'sparkles-outline';
    return 'nutrition-outline';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minha Rotina</Text>
          <TouchableOpacity style={styles.headerAddBtn} onPress={handleOpenNew}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando sua rotina...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadRoutine();
              }}
              colors={[colors.primary]}
            />
          }
        >
          {/* Card Master Toggle */}
          <View style={styles.masterCard}>
            <View style={styles.masterCardInfo}>
              <View style={styles.masterIconWrapper}>
                <Ionicons name="notifications-outline" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.masterTitle}>Lembretes de Rotina</Text>
                <Text style={styles.masterSubtitle}>
                  {routine?.enabled
                    ? 'O app avisa se esquecer de registrar e quando recolocar o aparelho.'
                    : 'Lembretes automáticos desativados.'}
                </Text>
              </View>
            </View>
            <Switch
              value={routine?.enabled ?? false}
              onValueChange={handleToggleMasterRoutine}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={routine?.enabled ? colors.primary : '#CBD5E1'}
            />
          </View>

          {/* Dica da Rotina */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoBannerText}>
              Toque em uma refeição para ajustar o horário ou o tempo previsto sem aparelho.
            </Text>
          </View>

          {/* Lista de Refeições */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refeições Configuradas</Text>
            <Text style={styles.sectionCount}>
              {routine?.items ? `${routine.items.length} itens` : '0 itens'}
            </Text>
          </View>

          {routine?.items && routine.items.length > 0 ? (
            <View style={styles.itemsList}>
              {routine.items.map((item) => {
                const isDefault = isDefaultMealName(item.name);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemCard, !item.enabled && styles.itemCardDisabled]}
                    onPress={() => handleOpenEdit(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View
                        style={[
                          styles.itemIconBox,
                          !item.enabled && { backgroundColor: '#F1F5F9' },
                        ]}
                      >
                        <Ionicons
                          name={getMealIcon(item)}
                          size={20}
                          color={item.enabled ? colors.primary : colors.subtext}
                        />
                      </View>
                      <View>
                        <View style={styles.itemNameRow}>
                          <Text
                            style={[
                              styles.itemName,
                              !item.enabled && { color: colors.subtext },
                            ]}
                          >
                            {item.name}
                          </Text>
                          {isDefault && <View style={styles.defaultTag}><Text style={styles.defaultTagText}>Padrão</Text></View>}
                        </View>
                        <View style={styles.itemMetaRow}>
                          <Text style={styles.itemTime}>{item.startTime}</Text>
                          <Text style={styles.itemMetaDot}>•</Text>
                          <Text style={styles.itemDuration}>
                            {item.expectedDurationMinutes} min sem aparelho
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.itemRight}>
                      <Switch
                        value={item.enabled}
                        onValueChange={() => handleToggleItem(item)}
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={item.enabled ? colors.primary : '#CBD5E1'}
                      />
                      <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="restaurant-outline" size={48} color={colors.subtext} />
              <Text style={styles.emptyTitle}>Nenhuma refeição configurada</Text>
              <Text style={styles.emptyText}>
                Adicione seus horários habituais para receber lembretes contextualizados.
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={handleOpenNew}>
                <Text style={styles.emptyBtnText}>+ Adicionar Refeição</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botão Adicionar Refeição */}
          <TouchableOpacity style={styles.addNewMealBtn} onPress={handleOpenNew} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addNewMealBtnText}>+ Adicionar Refeição Personalizada</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal de Adicionar / Editar */}
      <MealEditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveModal}
        onDelete={handleDeleteModal}
        initialData={editingItem || undefined}
        isNew={isNewMeal}
        isDefaultMeal={editingItem ? isDefaultMealName(editingItem.name) : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  headerAddBtn: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.subtext,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  masterCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.sm,
  },
  masterIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  masterSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.subtext,
  },
  itemsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemCardDisabled: {
    opacity: 0.65,
    backgroundColor: '#FAFAFA',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  itemIconBox: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  defaultTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  defaultTagText: {
    fontSize: 10,
    color: colors.subtext,
    fontWeight: '600',
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  itemTime: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  itemMetaDot: {
    fontSize: 12,
    color: colors.subtext,
  },
  itemDuration: {
    fontSize: 12,
    color: colors.subtext,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addNewMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    backgroundColor: '#F0FDFA',
    marginTop: spacing.xs,
  },
  addNewMealBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});
