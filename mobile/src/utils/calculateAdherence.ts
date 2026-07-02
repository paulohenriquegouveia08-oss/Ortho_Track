const DAILY_GOAL_SECONDS = 22 * 3600;

export function calculateAdherence(usageSeconds: number): number {
  return Math.min(Math.round((usageSeconds / DAILY_GOAL_SECONDS) * 100), 100);
}

export function getAdherenceColor(adherence: number): string {
  if (adherence >= 90) return '#10B981';
  if (adherence >= 75) return '#F59E0B';
  return '#EF4444';
}

export function getAdherenceLabel(adherence: number): string {
  if (adherence >= 90) return 'Baixo';
  if (adherence >= 75) return 'Medio';
  return 'Alto';
}

export function getUsageFeedback(hours: number): { color: string; message: string } {
  if (hours >= 21.5) {
    return { color: '#10B981', message: 'Excelente! Voce esta muito proximo da meta ideal de uso.' };
  }
  if (hours >= 18) {
    return { color: '#F59E0B', message: 'Atencao: tente usar um pouco mais o alinhador hoje para nao prejudicar o tratamento.' };
  }
  return { color: '#EF4444', message: 'Uso muito abaixo do recomendado. Recoloque o alinhador o quanto antes.' };
}

export function getRiskLabel(adherence: number): string {
  if (adherence >= 90) return 'Baixo';
  if (adherence >= 75) return 'Medio';
  return 'Alto';
}

export function getRiskColor(adherence: number): string {
  if (adherence >= 90) return '#10B981';
  if (adherence >= 75) return '#F59E0B';
  return '#EF4444';
}
