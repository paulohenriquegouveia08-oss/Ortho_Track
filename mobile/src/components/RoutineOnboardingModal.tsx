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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../theme/spacing';
import { routineApi } from '../services/api';
import { syncRoutineNotifications } from '../services/routine-notification.service';
import { RoutineItemType, RoutineResponse } from '../types';

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
  startTime: string;
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
  const [step, setStep] = useState<number>(0); // 0: Introdução/Café, 1: Almoço, 2: Jantar, 3: Extras/Resumo
  const [saving, setSaving] = useState(false);

  const [meals, setMeals] = useState<OnboardingMeal[]>([
    {
      id: 'default-breakfast',
      name: 'Café da manhã',
      type: 'meal',
      startTime: '07:30',
      expectedDurationMinutes: 15,
      enabled: true,
      isCustom: false,
    },
    {
      id: 'default-lunch',
      name: 'Almoço',
      type: 'meal',
      startTime: '12:00',
      expectedDurationMinutes: 30,
      enabled: true,
      isCustom: false,
    },
    {
      id: 'default-dinner',
      name: 'Jantar',
      type: 'meal',
      startTime: '19:30',
      expectedDurationMinutes: 30,
      enabled: true,
      isCustom: false,
    },
  ]);

  // Edição rápida de um item no step atual
  const updateMeal = (index: number, partial: Partial<OnboardingMeal>) => {
    setMeals((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...partial };
      return copy;
    });
  };

  const addCustomMeal = () => {
    const newId = `custom-${Date.now()}`;
    setMeals((prev) => [
      ...prev,
      {
        id: newId,
        name: 'Lanche da tarde',
        type: 'snack',
        startTime: '16:00',
        expectedDurationMinutes: 15,
        enabled: true,
        isCustom: true,
      },
    ]);
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

      // 2. Prepara payload
      const payloadItems = meals.map((m, idx) => ({
        name: m.name.trim(),
        type: m.type,
        startTime: m.startTime,
        expectedDurationMinutes: m.expectedDurationMinutes,
        enabled: m.enabled,
        sortOrder: idx,
      }));

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
    const [h, m] = meal.startTime.split(':');

    return (
      <View key={meal.id} style={styles.mealCard}>
        <View style={styles.mealCardHeader}>
          <View style={styles.mealIconWrapper}>
            <Ionicons
              name={
                meal.name.toLowerCase().includes('café')
                  ? 'cafe-outline'
                  : meal.name.toLowerCase().includes('almoço')
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
            {meal.isCustom ? (
              <TextInput
                style={styles.customNameInput}
                value={meal.name}
                onChangeText={(text) => updateMeal(index, { name: text })}
                placeholder="Nome da refeição"
              />
            ) : (
              <Text style={styles.mealNameText}>{meal.name}</Text>
            )}
          </View>
          {meal.isCustom && (
            <TouchableOpacity onPress={() => removeCustomMeal(meal.id)}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        {/* Horário */}
        <View style={styles.inputSection}>
          <Text style={styles.inputSectionLabel}>Horário que costuma fazer:</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={styles.timeDigit}
              keyboardType="number-pad"
              maxLength={2}
              value={h}
              onChangeText={(newH) => {
                const clean = newH.replace(/\D/g, '');
                updateMeal(index, { startTime: `${clean.padStart(2, '0').slice(-2)}:${m}` });
              }}
            />
            <Text style={styles.timeColon}>:</Text>
            <TextInput
              style={styles.timeDigit}
              keyboardType="number-pad"
              maxLength={2}
              value={m}
              onChangeText={(newM) => {
                const clean = newM.replace(/\D/g, '');
                updateMeal(index, { startTime: `${h}:${clean.padStart(2, '0').slice(-2)}` });
              }}
            />
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
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Vamos conhecer sua rotina</Text>
              <Text style={styles.subtitle}>
                Personalize seus lembretes informando os horários em que você normalmente faz suas
                refeições e quanto tempo costuma ficar sem o aparelho.
              </Text>
            </View>
            <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
              <Text style={styles.skipBtnText}>Pular</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Refeições */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {meals.map((meal, idx) => renderMealForm(meal, idx))}

            <TouchableOpacity style={styles.addMealBtn} onPress={addCustomMeal}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addMealBtnText}>+ Adicionar outra refeição / lanche</Text>
            </TouchableOpacity>

            <View style={styles.privacyNote}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
              <Text style={styles.privacyNoteText}>
                Você poderá editar, pausar ou adicionar novos horários a qualquer momento no seu
                Perfil.
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
      </View>
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
  customNameInput: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 2,
  },
  inputSection: {
    marginTop: spacing.xs,
  },
  inputSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeDigit: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    width: 46,
    height: 38,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  timeColon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
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
