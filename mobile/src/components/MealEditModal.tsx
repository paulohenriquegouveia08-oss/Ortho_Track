import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/spacing';
import { RoutineItemType, RoutineItem } from '../types';

interface MealEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    type: RoutineItemType;
    startTime: string;
    expectedDurationMinutes: number;
    enabled?: boolean;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  initialData?: Partial<RoutineItem>;
  isNew?: boolean;
  isDefaultMeal?: boolean;
}

const DURATION_PRESETS = [5, 10, 15, 20, 30];

const TYPE_OPTIONS: Array<{ label: string; value: RoutineItemType; icon: any }> = [
  { label: 'Refeição', value: 'meal', icon: 'restaurant-outline' },
  { label: 'Lanche', value: 'snack', icon: 'cafe-outline' },
  { label: 'Higiene', value: 'hygiene', icon: 'sparkles-outline' },
  { label: 'Outro', value: 'other', icon: 'ellipsis-horizontal-outline' },
];

const NAME_SUGGESTIONS = [
  'Lanche da manhã',
  'Café da tarde',
  'Lanche da tarde',
  'Ceia',
  'Higiene bucal',
];

export function MealEditModal({
  visible,
  onClose,
  onSave,
  onDelete,
  initialData,
  isNew = false,
  isDefaultMeal = false,
}: MealEditModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<RoutineItemType>('meal');
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [duration, setDuration] = useState(30);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationText, setCustomDurationText] = useState('30');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name || '');
        setType(initialData.type || 'meal');

        if (initialData.startTime) {
          const [h, m] = initialData.startTime.split(':');
          setHours(h || '12');
          setMinutes(m || '00');
        } else {
          setHours('12');
          setMinutes('00');
        }

        const dur = initialData.expectedDurationMinutes || 30;
        setDuration(dur);
        setCustomDurationText(String(dur));
        setIsCustomDuration(!DURATION_PRESETS.includes(dur));
      } else {
        setName('');
        setType('snack');
        setHours('16');
        setMinutes('00');
        setDuration(15);
        setCustomDurationText('15');
        setIsCustomDuration(false);
      }
    }
  }, [visible, initialData]);

  const handleSelectDuration = (val: number) => {
    setDuration(val);
    setCustomDurationText(String(val));
    setIsCustomDuration(false);
  };

  const handleCustomDurationToggle = () => {
    setIsCustomDuration(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Atenção', 'Informe um nome para a refeição.');
      return;
    }

    // Valida horário
    let h = parseInt(hours, 10);
    let m = parseInt(minutes, 10);
    if (isNaN(h) || h < 0 || h > 23) {
      Alert.alert('Atenção', 'Hora inválida. Deve ser entre 00 e 23.');
      return;
    }
    if (isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Atenção', 'Minutos inválidos. Devem ser entre 00 e 59.');
      return;
    }

    const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    // Valida duração
    let finalDuration = duration;
    if (isCustomDuration) {
      finalDuration = parseInt(customDurationText, 10);
      if (isNaN(finalDuration) || finalDuration <= 0) {
        Alert.alert('Atenção', 'Informe um tempo de duração válido em minutos.');
        return;
      }
      if (finalDuration > 360) {
        Alert.alert('Atenção', 'A duração máxima permitida é de 360 minutos (6 horas).');
        return;
      }
    }

    setSaving(true);
    try {
      await onSave({
        name: trimmedName,
        type,
        startTime: formattedTime,
        expectedDurationMinutes: finalDuration,
        enabled: initialData?.enabled !== undefined ? initialData.enabled : true,
      });
      onClose();
    } catch (err: any) {
      Alert.alert('Erro ao salvar', err?.message || 'Falha ao salvar refeição');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    Alert.alert(
      'Excluir refeição',
      `Tem certeza de que deseja remover "${name}" da sua rotina?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await onDelete();
              onClose();
            } catch (err: any) {
              Alert.alert('Erro ao excluir', err?.message || 'Falha ao excluir refeição');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isNew ? 'Adicionar Refeição' : isDefaultMeal ? `Editar ${name}` : 'Editar Refeição'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Nome da Refeição */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nome da Refeição</Text>
              <TextInput
                style={[styles.input, isDefaultMeal && styles.inputDisabled]}
                placeholder="Ex: Lanche da tarde"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
                editable={!isDefaultMeal}
                maxLength={60}
              />
              {!isDefaultMeal && (
                <View style={styles.suggestionRow}>
                  {NAME_SUGGESTIONS.map((sug) => (
                    <TouchableOpacity
                      key={sug}
                      style={styles.suggestionChip}
                      onPress={() => setName(sug)}
                    >
                      <Text style={styles.suggestionText}>{sug}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Horário */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Horário Habitual</Text>
              <Text style={styles.fieldHelper}>Quando você costuma fazer essa pausa</Text>
              <View style={styles.timePickerRow}>
                <View style={styles.timeBox}>
                  <TextInput
                    style={styles.timeInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={hours}
                    onChangeText={(val) => {
                      setHours(val.replace(/\D/g, ''));
                    }}
                    placeholder="00"
                  />
                  <Text style={styles.timeUnitLabel}>Horas</Text>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                <View style={styles.timeBox}>
                  <TextInput
                    style={styles.timeInput}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={minutes}
                    onChangeText={(val) => {
                      setMinutes(val.replace(/\D/g, ''));
                    }}
                    placeholder="00"
                  />
                  <Text style={styles.timeUnitLabel}>Minutos</Text>
                </View>
              </View>
            </View>

            {/* Tempo Sem Aparelho */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tempo Estimado sem Aparelho</Text>
              <Text style={styles.fieldHelper}>Para cálculo de alertas de recolocação</Text>
              <View style={styles.durationRow}>
                {DURATION_PRESETS.map((p) => {
                  const selected = !isCustomDuration && duration === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.durationChip, selected && styles.durationChipSelected]}
                      onPress={() => handleSelectDuration(p)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.durationChipText, selected && styles.durationChipTextSelected]}
                      >
                        {p} min
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[styles.durationChip, isCustomDuration && styles.durationChipSelected]}
                  onPress={handleCustomDurationToggle}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.durationChipText,
                      isCustomDuration && styles.durationChipTextSelected,
                    ]}
                  >
                    Outro
                  </Text>
                </TouchableOpacity>
              </View>

              {isCustomDuration && (
                <View style={styles.customDurationRow}>
                  <TextInput
                    style={styles.customDurationInput}
                    keyboardType="number-pad"
                    maxLength={3}
                    value={customDurationText}
                    onChangeText={(val) => setCustomDurationText(val.replace(/\D/g, ''))}
                    placeholder="Ex: 45"
                  />
                  <Text style={styles.customDurationUnit}>minutos sem o aparelho</Text>
                </View>
              )}
            </View>

            {/* Tipo */}
            {!isDefaultMeal && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tipo de Atividade</Text>
                <View style={styles.typeGrid}>
                  {TYPE_OPTIONS.map((opt) => {
                    const selected = type === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.typeButton, selected && styles.typeButtonSelected]}
                        onPress={() => setType(opt.value)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={opt.icon}
                          size={18}
                          color={selected ? colors.primary : colors.subtext}
                        />
                        <Text
                          style={[styles.typeButtonText, selected && styles.typeButtonTextSelected]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            {!isNew && !isDefaultMeal && onDelete ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={deleting || saving}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving || deleting}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Salvando...' : isNew ? 'Adicionar à Rotina' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  fieldHelper: {
    fontSize: 12,
    color: colors.subtext,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: colors.subtext,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  suggestionText: {
    fontSize: 11,
    color: colors.subtext,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  timeBox: {
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 72,
    height: 64,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  timeUnitLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  durationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  durationChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  durationChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  durationChipTextSelected: {
    color: colors.white,
  },
  customDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  customDurationInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 60,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  customDurationUnit: {
    fontSize: 13,
    color: colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  typeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: '#CCFBF1',
  },
  typeButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    padding: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
