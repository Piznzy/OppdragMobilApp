import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { TodoTheme } from '@/constants/todo-theme';
import { Priority } from '@/types/todo';

type TodoInputProps = {
  deadline: string;
  isEditing: boolean;
  onAddTodo: () => void;
  onCancelEdit: () => void;
  onChangeDeadline: (value: string) => void;
  onChangePriority: (value: Priority) => void;
  onChangeTitle: (value: string) => void;
  priority: Priority;
  theme: TodoTheme;
  title: string;
};

const priorityOptions: Priority[] = ['Low', 'Medium', 'High'];

export function TodoInput({
  deadline,
  isEditing,
  onAddTodo,
  onCancelEdit,
  onChangeDeadline,
  onChangePriority,
  onChangeTitle,
  priority,
  theme,
  title,
}: TodoInputProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.heading, { color: theme.text }]}>
            {isEditing ? 'Rediger oppgave' : 'Ny oppgave'}
          </Text>
          <Text style={[styles.caption, { color: theme.subtext }]}>
            {isEditing
              ? 'Oppdater tekst, prioritet eller deadline og lagre endringene.'
              : 'Hold det kort og tydelig. Legg til prioritet og en valgfri deadline.'}
          </Text>
        </View>

        {isEditing ? (
          <Pressable onPress={onCancelEdit} style={[styles.cancelButton, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="close-outline" size={16} color={theme.text} />
            <Text style={[styles.cancelText, { color: theme.text }]}>Avbryt</Text>
          </Pressable>
        ) : null}
      </View>

      <TextInput
        placeholder="Hva må gjøres i dag?"
        placeholderTextColor={theme.placeholder}
        style={[styles.titleInput, { color: theme.text, backgroundColor: theme.inputBackground }]}
        value={title}
        onChangeText={onChangeTitle}
        returnKeyType="done"
        onSubmitEditing={onAddTodo}
      />

      <View style={styles.row}>
        <View style={styles.priorityGroup}>
          {priorityOptions.map((option) => {
            const isActive = option === priority;

            return (
              <Pressable
                key={option}
                onPress={() => onChangePriority(option)}
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: isActive ? theme.accentSoft : theme.inputBackground,
                    borderColor: isActive ? theme.accent : theme.border,
                  },
                ]}>
                <Text style={[styles.priorityText, { color: isActive ? theme.accentStrong : theme.subtext }]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.deadlineRow, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="calendar-outline" size={18} color={theme.subtext} />
        <TextInput
          placeholder="Deadline, f.eks. 2026-04-12"
          placeholderTextColor={theme.placeholder}
          style={[styles.deadlineInput, { color: theme.text }]}
          value={deadline}
          onChangeText={onChangeDeadline}
        />
      </View>

      <Pressable style={[styles.addButton, { backgroundColor: theme.accent }]} onPress={onAddTodo}>
        <Ionicons name={isEditing ? 'save-outline' : 'add-circle-outline'} size={18} color="#F8FAFC" />
        <Text style={styles.addButtonText}>{isEditing ? 'Lagre endringer' : 'Legg til oppgave'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 4,
  },
  cancelButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  titleInput: {
    borderRadius: 18,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  row: {
    marginTop: 14,
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 11,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  deadlineRow: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  deadlineInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 15,
  },
  addButtonText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
});
