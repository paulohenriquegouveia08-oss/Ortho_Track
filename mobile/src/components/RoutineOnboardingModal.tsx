import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../theme/spacing';
import { routineApi } from '../services/api';
import { syncRoutineNotifications } from '../services/routine-notification.service';
import { RoutineItemType, RoutineResponse } from '../types';
import { MealEditModal } from './MealEditModal';

interface RoutineOnboardingModalProps {
  visible: boolean;
  patientName?: string;
  onComplete: (routineRes: RoutineResponse) => void;
  onSkip: () => void;
}

interface OnboardingMeal {
  id: string;
  name: string;
  type: RoutineItemType;
  hours: string;
  minutes: string;
  expectedDurationMinutes: number;
  enabled: boolean;
  isCustom?: boolean;
}

const DURATION_CHIPS = [5, 10, 15, 20, 30];

export function RoutineOnboardingModal({
  visible,
  patientName = 'Paciente',
  onComplete,
  onSkip,
}: RoutineOnboardingModalProps) {
  const [saving, setSaving] = useState(false);

  const [meals, setMeals] = useState<OnboardingMeal[]>([
    {
      id: 'default-breakfast',
      name: 'Café da manhã',
      type: 'meal',
      hours: '07',
      minutes: '30',
      expectedDurationMinutes: 15,
      enabled: true,
      isCustom: false,
    },
    {
      id: 'default-lunch',
      name: 'Almoço',
      type: 'meal',
      hours: '12',
      minutes: '00',
      expectedDurationMinutes: 30,
      enabled: true,
      isCustom: false,
    },
    {
      id: 'default-dinner',
      name: 'Jantar',
      type: 'meal',
      hours: '19',
      minutes: '30',
      expectedDurationMinutes: 30,
      enabled: true,
      isCustom: false,
    },
  ]);

  // Controle de edição avançada via MealEditModal
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNewMeal, setIsAddingNewMeal] = useState(false);

  const updateMeal = (index: number, partial: Partial<OnboardingMeal>) => {
    setMeals((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...partial };
      return copy;
    });
  };

  const removeCustomMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const requestNotificationPermissionFriendly = async () => {
    try {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    } catch {
      return false;
    }
  };

  const handleSaveRoutine = async () => {
    setSaving(true);
    try {
      // 1. Pede permissão de notificação amigavelmente
      await requestNotificationPermissionFriendly();

      // 2. Prepara e valida payload
      const payloadItems = meals.map((m, idx) => {
        let h = parseInt(m.hours, 10);
        let min = parseInt(m.minutes, 10);
        if (isNaN(h) || h < 0) h = 0;
        if (h > 23) h = 23;
        if (isNaN(min) || min < 0) min = 0;
        if (min > 59) min = 59;

        const startTime = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

        return {
          name: m.name.trim() || `Refeição ${idx + 1}`,
          type: m.type,
          startTime,
          expectedDurationMinutes: m.expectedDurationMinutes || 15,
          enabled: m.enabled,
          sortOrder: idx,
        };
      });

      // 3. Salva no backend
      const res = await routineApi.createRoutine({
        items: payloadItems,
        enabled: true,
      });

      // 4. Salva localmente e agenda notificações
      if (res.routine) {
        await AsyncStorage.setItem('orthotrack_routine', JSON.stringify(res.routine));
        await syncRoutineNotifications(res.routine, patientName, 'USING');
      }

      await AsyncStorage.setItem('routine_onboarding_completed', 'true');
      onComplete(res);
    } catch (err: any) {
      Alert.alert('Erro ao salvar', err?.message || 'Falha ao salvar sua rotina');
    } finally {
      setSaving(false);
    }
  };

  const renderMealForm = (meal: OnboardingMeal, index: number) => {
    return (
      <View key={meal.id} style={styles.mealCard}>
        {/* Header da Refeição */}
        <View style={styles.mealCardHeader}>
          <View style={styles.mealIconWrapper}>
            <Ionicons
              name={
                meal.name.toLowerCase().includes('café') || meal.name.toLowerCase().includes('cafe')
                  ? 'cafe-outline'
                  : meal.name.toLowerCase().includes('almoço') || meal.name.toLowerCase().includes('almoco')
                  ? 'restaurant-outline'
                  : meal.name.toLowerCase().includes('jantar')
                  ? 'moon-outline'
                  : 'fast-food-outline'
              }
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealNameText} numberOfLines={1}>
              {meal.name}
            </Text>
          </View>

          {/* Botão de Edição Avançada */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditingIndex(index)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={13} color={colors.primary} />
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>

          {meal.isCustom && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeCustomMeal(meal.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={17} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        {/* Seção de Horário */}
        <View style={styles.inputSection}>
          <Text style={styles.inputSectionLabel}>Horário habitual:</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeDigit}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                value={meal.hours}
                onChangeText={(newH) => {
                  updateMeal(index, { hours: newH.replace(/\D/g, '') });
                }}
                onBlur={() => {
                  let hVal = parseInt(meal.hours, 10);
                  if (isNaN(hVal) || hVal < 0) hVal = 0;
                  if (hVal > 23) hVal = 23;
                  updateMeal(index, { hours: String(hVal).padStart(2, '0') });
                }}
                placeholder="00"
                placeholderTextColor={colors.subtext}
              />
              <Text style={styles.timeSubLabel}>Hora</Text>
            </View>

            <Text style={styles.timeColon}>:</Text>

            <View style={styles.timeBox}>
              <TextInput
                style={styles.timeDigit}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                value={meal.minutes}
                onChangeText={(newM) => {
                  updateMeal(index, { minutes: newM.replace(/\D/g, '') });
                }}
                onBlur={() => {
                  let mVal = parseInt(meal.minutes, 10);
                  if (isNaN(mVal) || mVal < 0) mVal = 0;
                  if (mVal > 59) mVal = 59;
                  updateMeal(index, { minutes: String(mVal).padStart(2, '0') });
                }}
                placeholder="00"
                placeholderTextColor={colors.subtext}
              />
              <Text style={styles.timeSubLabel}>Min</Text>
            </View>
          </View>
        </View>

        {/* Duração sem aparelho */}
        <View style={styles.inputSection}>
          <Text style={styles.inputSectionLabel}>Tempo sem o aparelho:</Text>
          <View style={styles.chipsRow}>
            {DURATION_CHIPS.map((dur) => {
              const selected = meal.expectedDurationMinutes === dur;
              return (
                <TouchableOpacity
                  key={dur}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => updateMeal(index, { expectedDurationMinutes: dur })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {dur} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onSkip}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Vamos conhecer sua rotina</Text>
              <Text style={styles.subtitle}>
                Informe os horários habituais das suas refeições e quanto tempo costuma ficar sem o
                aparelho.
              </Text>
            </View>
            <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>Pular</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Refeições */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {meals.map((meal, idx) => renderMealForm(meal, idx))}

            <TouchableOpacity
              style={styles.addMealBtn}
              onPress={() => setIsAddingNewMeal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addMealBtnText}>+ Adicionar outra refeição / lanche</Text>
            </TouchableOpacity>

            <View style={styles.privacyNote}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
              <Text style={styles.privacyNoteText}>
                Você poderá editar, pausar ou adicionar novos horários a qualquer momento no menu do
                seu Perfil.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
              onPress={handleSaveRoutine}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                  <Text style={styles.confirmBtnText}>Salvar e Ativar Minha Rotina</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de edição de refeição existente */}
      {editingIndex !== null && meals[editingIndex] && (
        <MealEditModal
          visible={true}
          isNew={false}
          isDefaultMeal={!meals[editingIndex].isCustom}
          initialData={{
            name: meals[editingIndex].name,
            type: meals[editingIndex].type,
            startTime: `${meals[editingIndex].hours.padStart(2, '0')}:${meals[editingIndex].minutes.padStart(2, '0')}`,
            expectedDurationMinutes: meals[editingIndex].expectedDurationMinutes,
            enabled: meals[editingIndex].enabled,
          }}
          onClose={() => setEditingIndex(null)}
          onSave={async (data) => {
            const [h, m] = data.startTime.split(':');
            updateMeal(editingIndex, {
              name: data.name,
              type: data.type,
              hours: h || '12',
              minutes: m || '00',
              expectedDurationMinutes: data.expectedDurationMinutes,
            });
          }}
          onDelete={
            meals[editingIndex].isCustom
              ? async () => {
                  removeCustomMeal(meals[editingIndex].id);
                }
              : undefined
          }
        />
      )}

      {/* Modal para adicionar nova refeição customizada */}
      {isAddingNewMeal && (
        <MealEditModal
          visible={true}
          isNew={true}
          initialData={{
            name: '',
            type: 'snack',
            startTime: '16:00',
            expectedDurationMinutes: 15,
            enabled: true,
          }}
          onClose={() => setIsAddingNewMeal(false)}
          onSave={async (data) => {
            const [h, m] = data.startTime.split(':');
            const newId = `custom-${Date.now()}`;
            setMeals((prev) => [
              ...prev,
              {
                id: newId,
                name: data.name,
                type: data.type,
                hours: h || '16',
                minutes: m || '00',
                expectedDurationMinutes: data.expectedDurationMinutes,
                enabled: true,
                isCustom: true,
              },
            ]);
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    maxHeight: '92%',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 18,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  content: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  mealIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: '#CCFBF1',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 2,
  },
  inputSection: {
    marginTop: spacing.xs,
  },
  inputSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeDigit: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 60,
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  timeSubLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.subtext,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  timeColon: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
  addMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    backgroundColor: '#F0FDFA',
    marginBottom: spacing.md,
  },
  addMealBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  privacyNote: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11,
    color: colors.subtext,
    lineHeight: 15,
  },
  footer: {
    paddingTop: spacing.xs,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
