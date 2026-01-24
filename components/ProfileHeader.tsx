import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  onEditPress?: () => void;
}

const ProfileHeader = ({ name, email, avatarUrl, onEditPress }: ProfileHeaderProps) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
        )}
        {onEditPress && (
          <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  initial: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: spacing.md,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    marginTop: spacing.xxxs,
  },
});

export default ProfileHeader;
