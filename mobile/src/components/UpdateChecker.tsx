import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing, borderRadius } from '../theme/spacing';

const APP_VERSION = Constants.expoConfig?.extra?.version || '1.0.0';
const API_BASE = Constants.expoConfig?.extra?.apiBaseUrl as string || 'http://localhost:3004/api';

export default function UpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState<{ latestVersion: string; apkUrl: string | null } | null>(null);
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    checkVersion();
  }, []);

  async function checkVersion() {
    try {
      const res = await fetch(`${API_BASE}/app/version?current=${APP_VERSION}`);
      const data = await res.json();
      if (data.requiresUpdate && data.apkUrl) {
        setUpdateInfo({ latestVersion: data.latestVersion, apkUrl: data.apkUrl });
        setVisible(true);
      }
    } catch {
      // silently fail
    }
  }

  async function handleInstall() {
    if (!updateInfo?.apkUrl) return;
    setDownloading(true);
    try {
      const apkUrl = `${API_BASE}${updateInfo.apkUrl}`;
      await Linking.openURL(apkUrl);
    } catch {
      // if Linking fails, try alternative
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📲</Text>
          </View>
          <Text style={styles.title}>Nova versao disponivel!</Text>
          <Text style={styles.subtitle}>
            OrthoTrack v{updateInfo?.latestVersion} ja esta disponivel
          </Text>
          <Text style={styles.currentVersion}>Sua versao: v{APP_VERSION}</Text>

          {downloading ? (
            <View style={styles.downloadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.downloadingText}>Preparando download...</Text>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.installButton} onPress={handleInstall}>
                <Text style={styles.installButtonText}>Baixar e Instalar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.laterButton} onPress={() => setVisible(false)}>
                <Text style={styles.laterButtonText}>Agora nao</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.xl, width: '100%', maxWidth: 340, alignItems: 'center' },
  iconContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  icon: { fontSize: 36 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.subtext, textAlign: 'center', marginBottom: spacing.sm },
  currentVersion: { fontSize: 12, color: colors.subtext, textAlign: 'center', marginBottom: spacing.lg },
  buttonsContainer: { width: '100%', gap: spacing.sm },
  installButton: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, padding: spacing.md, alignItems: 'center' },
  installButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  laterButton: { padding: spacing.md, alignItems: 'center' },
  laterButtonText: { color: colors.subtext, fontSize: 14 },
  downloadingContainer: { alignItems: 'center', padding: spacing.md },
  downloadingText: { fontSize: 14, color: colors.subtext, marginTop: spacing.sm },
});
