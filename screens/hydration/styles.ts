import { StyleSheet } from 'react-native';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  bottleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  statsSection: {
    alignItems: 'center',
  },
  bigAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.white,
  },
  goalText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  percentBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  percentText: {
    fontSize: 13,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  drinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  drinkButton: {
    width: '22%',
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  drinkEmoji: {
    fontSize: 24,
  },
  drinkName: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  drinkMl: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 2,
  },
  customButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#DBEAFE',
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    alignItems: 'center',
  },
  customButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  historyTime: {
    fontSize: 10,
    color: colors.gray,
    width: 45,
  },
  historyEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  historyName: {
    flex: 1,
    fontSize: 13,
    color: colors.black,
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyText: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.gray,
  },
  hint: {
    fontSize: 11,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.xxs,
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    width: 100,
    padding: spacing.sm,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 12,
  },
  inputUnit: {
    fontSize: 18,
    color: colors.gray,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancel: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  modalConfirm: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
