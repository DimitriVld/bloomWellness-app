import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet } from 'react-native';

interface ComingSoonProps {
  emoji: string;
  title: string;
  description: string;
}

const ComingSoon = ({ emoji, title, description }: ComingSoonProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✨ Bientôt disponible</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: spacing.xxs,
  },
  description: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.purple,
  },
});

export default ComingSoon;
