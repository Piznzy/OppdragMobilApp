import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getPriorityColors, TodoTheme } from '@/constants/todo-theme';
import { Todo } from '@/types/todo';

type TodoItemProps = {
  index: number;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggle: (id: string) => void;
  theme: TodoTheme;
  todo: Todo;
};

export function TodoItem({ index, onDelete, onEdit, onToggle, theme, todo }: TodoItemProps) {
  const priorityColors = getPriorityColors(todo.priority, theme);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: todo.completed ? theme.successBorder : theme.border,
          shadowColor: theme.shadow,
          opacity: todo.completed ? 0.82 : 1,
          marginTop: index === 0 ? 0 : 12,
        },
      ]}>
      <View style={styles.row}>
        <Pressable
          onPress={() => onToggle(todo.id)}
          style={[
            styles.checkButton,
            {
              backgroundColor: todo.completed ? theme.successSoft : theme.inputBackground,
              borderColor: todo.completed ? theme.success : theme.border,
            },
          ]}>
          <Ionicons
            name={todo.completed ? 'checkmark' : 'ellipse-outline'}
            size={18}
            color={todo.completed ? theme.success : theme.subtext}
          />
        </Pressable>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              },
            ]}>
            {todo.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: priorityColors.background }]}>
              <Text style={[styles.badgeText, { color: priorityColors.text }]}>{todo.priority}</Text>
            </View>

            {todo.deadline ? (
              <View style={[styles.badge, { backgroundColor: theme.inputBackground }]}>
                <Ionicons name="calendar-clear-outline" size={12} color={theme.subtext} />
                <Text style={[styles.dateText, { color: theme.subtext }]}>{todo.deadline}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(todo)} style={[styles.actionButton, { backgroundColor: theme.inputBackground }]}>
          <Ionicons name="create-outline" size={16} color={theme.text} />
          <Text style={[styles.actionText, { color: theme.text }]}>Rediger</Text>
        </Pressable>

        <Pressable onPress={() => onDelete(todo.id)} style={[styles.actionButton, { backgroundColor: theme.dangerSoft }]}>
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
          <Text style={[styles.deleteText, { color: theme.danger }]}>Slett</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  checkButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  content: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
