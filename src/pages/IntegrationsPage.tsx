import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  category: 'productivity' | 'storage' | 'communication' | 'calendar';
}

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: 'calendar',
      description: 'Sync tasks with Google Calendar events',
      connected: true,
      category: 'calendar',
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: 'message',
      description: 'Send task notifications to Slack',
      connected: false,
      category: 'communication',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: 'package',
      description: 'Backup and sync task attachments',
      connected: true,
      category: 'storage',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: 'star',
      description: 'Automate workflows with 3000+ apps',
      connected: false,
      category: 'productivity',
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      icon: 'users',
      description: 'Collaborate with your team',
      connected: false,
      category: 'communication',
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: 'cloud',
      description: 'Store task files in Google Drive',
      connected: false,
      category: 'storage',
    },
  ]);

  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration
      )
    );
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      Alert.alert(
        integration.connected ? 'Disconnected' : 'Connected',
        `${integration.name} has been ${integration.connected ? 'disconnected' : 'connected'}`
      );
    }
  };

  const categories: Array<{ key: Integration['category']; label: string }> = [
    { key: 'calendar', label: 'Calendar' },
    { key: 'storage', label: 'Cloud Storage' },
    { key: 'communication', label: 'Communication' },
    { key: 'productivity', label: 'Productivity' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Integrations</Text>
        <Text style={styles.headerSubtitle}>Connect your favorite apps and services</Text>
      </View>

      {/* Connected Count */}
      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{integrations.filter(i => i.connected).length}</Text>
          <Text style={styles.statLabel}>Connected</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{integrations.filter(i => !i.connected).length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Integrations by Category */}
      {categories.map(category => {
        const categoryIntegrations = integrations.filter(i => i.category === category.key);
        if (categoryIntegrations.length === 0) {
          return null;
        }

        return (
          <View key={category.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.label}</Text>
            <View style={styles.card}>
              {categoryIntegrations.map((integration, index) => (
                <React.Fragment key={integration.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.integrationRow}>
                    <View style={styles.integrationIcon}>
                      <Text style={styles.integrationIconText}>{integration.icon}</Text>
                    </View>
                    <View style={styles.integrationInfo}>
                      <Text style={styles.integrationName}>{integration.name}</Text>
                      <Text style={styles.integrationDescription}>{integration.description}</Text>
                    </View>
                    <Switch
                      value={integration.connected}
                      onValueChange={() => toggleIntegration(integration.id)}
                      trackColor={{ false: palette.border, true: palette.success }}
                      thumbColor={palette.surface}
                    />
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        );
      })}

      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <View style={styles.card}>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>API Key</Text>
            <TextInput
              style={styles.configInput}
              placeholder="Enter your API key"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              placeholderTextColor={palette.textTertiary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Webhook URL</Text>
            <TextInput
              style={styles.configInput}
              placeholder="https://your-webhook-url.com"
              value={webhookUrl}
              onChangeText={setWebhookUrl}
              autoCapitalize="none"
              placeholderTextColor={palette.textTertiary}
            />
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => Alert.alert('Success', 'API configuration saved')}
          >
            <Text style={styles.saveButtonText}>Save Configuration</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Developer Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>API Documentation</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Generate API Token</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>View Webhook Logs</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Custom Integration */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add integration</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: palette.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: palette.border,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  integrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.button,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  integrationIconText: {
    fontSize: 24,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  integrationDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.sm,
  },
  configRow: {
    paddingVertical: spacing.sm,
  },
  configLabel: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  configInput: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text,
  },
  saveButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: palette.primary,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionLabel: {
    ...typography.body,
    color: palette.text,
  },
  actionArrow: {
    ...typography.body,
    color: palette.textTertiary,
  },
  addButton: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.primary,
    borderStyle: 'dashed',
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.bodyBold,
    color: palette.primary,
  },
});
