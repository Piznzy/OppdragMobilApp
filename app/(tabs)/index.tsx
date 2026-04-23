import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterTabs } from '@/components/todo/filter-tabs';
import { TodoInput } from '@/components/todo/todo-input';
import { TodoItem } from '@/components/todo/todo-item';
import { getThemePalette } from '@/constants/todo-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FilterType, Priority, Todo } from '@/types/todo';

const STORAGE_KEY = 'todo-items-v1';

const starterTodos: Todo[] = [
  {
    id: 'starter-1',
    title: 'Planlegg dagens viktigste oppgave',
    completed: false,
    priority: 'High',
    deadline: 'I dag',
    createdAt: '2026-04-08T08:00:00.000Z',
    updatedAt: '2026-04-08T08:00:00.000Z',
  },
  {
    id: 'starter-2',
    title: 'Rydd innboksen og svar på det som haster',
    completed: true,
    priority: 'Medium',
    deadline: '',
    createdAt: '2026-04-07T14:00:00.000Z',
    updatedAt: '2026-04-08T07:30:00.000Z',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = getThemePalette(colorScheme);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [deadline, setDeadline] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTodos() {
      try {
        const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);

        if (!active) {
          return;
        }

        if (savedTodos) {
          const parsedTodos: Todo[] = JSON.parse(savedTodos);
          setTodos(parsedTodos);
        } else {
          setTodos(starterTodos);
        }
      } catch {
        if (active) {
          setTodos(starterTodos);
        }
      } finally {
        if (active) {
          setIsReady(true);
        }
      }
    }

    loadTodos();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch(() => {
      // Ignore save failures in UI; the app should remain usable.
    });
  }, [isReady, todos]);

  const stats = useMemo(() => {
    const activeCount = todos.filter((todo) => !todo.completed).length;
    const completedCount = todos.length - activeCount;

    return {
      activeCount,
      completedCount,
      totalCount: todos.length,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Active' && !todo.completed) ||
        (filter === 'Completed' && todo.completed);

      const matchesSearch =
        normalizedQuery.length === 0 ||
        todo.title.toLowerCase().includes(normalizedQuery) ||
        todo.deadline.toLowerCase().includes(normalizedQuery) ||
        todo.priority.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, todos]);

  function resetForm() {
    setTitle('');
    setPriority('Medium');
    setDeadline('');
    setEditingTodoId(null);
  }

  function handleSubmitTodo() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      Alert.alert('Manglende tittel', 'Skriv inn en oppgave før du lagrer.');
      return;
    }

    const timestamp = new Date().toISOString();

    if (editingTodoId) {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTodoId
            ? {
                ...todo,
                title: trimmedTitle,
                priority,
                deadline: deadline.trim(),
                updatedAt: timestamp,
              }
            : todo
        )
      );
    } else {
      const newTodo: Todo = {
        id: `${Date.now()}`,
        title: trimmedTitle,
        completed: false,
        priority,
        deadline: deadline.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setTodos((currentTodos) => [newTodo, ...currentTodos]);
    }

    resetForm();
  }

  function handleEditTodo(todo: Todo) {
    setEditingTodoId(todo.id);
    setTitle(todo.title);
    setPriority(todo.priority);
    setDeadline(todo.deadline);
  }

  function handleToggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
  }

  function handleDeleteTodo(id: string) {
    Alert.alert('Slett oppgave', 'Vil du virkelig slette denne oppgaven?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Slett',
        style: 'destructive',
        onPress: () => {
          setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));

          if (editingTodoId === id) {
            resetForm();
          }
        },
      },
    ]);
  }

  function handleClearCompleted() {
    if (stats.completedCount === 0) {
      return;
    }

    Alert.alert('Tøm fullførte', 'Fjern alle fullførte oppgaver fra listen?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Fjern',
        style: 'destructive',
        onPress: () => {
          setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
        },
      },
    ]);
  }

  function renderEmptyState() {
    const isSearching = searchQuery.trim().length > 0;

    let titleText = 'Ingen oppgaver enda';
    let bodyText = 'Legg til din første oppgave for å bygge opp en ryddig dagsplan.';

    if (isSearching) {
      titleText = 'Ingen treff';
      bodyText = 'Prøv et annet søkeord eller fjern filteret for å se flere oppgaver.';
    } else if (filter === 'Completed') {
      titleText = 'Ingen fullførte oppgaver';
      bodyText = 'Når du markerer oppgaver som ferdige, dukker de opp her.';
    } else if (filter === 'Active') {
      titleText = 'Ingen aktive oppgaver';
      bodyText = 'Du er à jour. Nye oppgaver vises her til de blir fullført.';
    }

    return (
      <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name={isSearching ? 'search-outline' : 'sparkles-outline'} size={24} color={theme.accent} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>{titleText}</Text>
        <Text style={[styles.emptyText, { color: theme.subtext }]}>{bodyText}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerWrapper}>
              <View
                style={[
                  styles.heroCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: theme.shadow,
                  },
                ]}>
                <View style={styles.heroTopRow}>
                  <View>
                    <Text style={[styles.eyebrow, { color: theme.accent }]}>Daily Focus</Text>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>Todo Dashboard</Text>
                    <Text style={[styles.heroSubtitle, { color: theme.subtext }]}>
                      Hold oversikten med søk, filtre, lokal lagring og rask redigering.
                    </Text>
                  </View>

                  <View style={[styles.heroBadge, { backgroundColor: theme.accentSoft }]}>
                    <Ionicons name="checkmark-done-outline" size={18} color={theme.accentStrong} />
                    <Text style={[styles.heroBadgeText, { color: theme.accentStrong }]}>{stats.totalCount}</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.statsRow}>
                  <View style={[styles.statCard, { backgroundColor: theme.inputBackground }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{stats.activeCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtext }]}>Aktive</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: theme.inputBackground }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{stats.completedCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtext }]}>Fullførte</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: theme.inputBackground }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.subtext }]}>Totalt</Text>
                  </View>
                </ScrollView>
              </View>

              <TodoInput
                title={title}
                deadline={deadline}
                priority={priority}
                theme={theme}
                isEditing={editingTodoId !== null}
                onAddTodo={handleSubmitTodo}
                onCancelEdit={resetForm}
                onChangeDeadline={setDeadline}
                onChangePriority={setPriority}
                onChangeTitle={setTitle}
              />

              <View
                style={[
                  styles.toolsCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: theme.shadow,
                  },
                ]}>
                <View style={[styles.searchRow, { backgroundColor: theme.inputBackground }]}>
                  <Ionicons name="search-outline" size={18} color={theme.subtext} />
                  <TextInput
                    placeholder="Søk i oppgaver, frister eller prioritet"
                    placeholderTextColor={theme.placeholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[styles.searchInput, { color: theme.text }]}
                  />
                  {searchQuery ? (
                    <Pressable onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={18} color={theme.subtext} />
                    </Pressable>
                  ) : null}
                </View>

                <FilterTabs filter={filter} onChangeFilter={setFilter} theme={theme} />

                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Oppgaver</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
                      {filteredTodos.length} vist av {stats.totalCount}
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleClearCompleted}
                    disabled={stats.completedCount === 0}
                    style={[
                      styles.clearButton,
                      {
                        backgroundColor: stats.completedCount === 0 ? theme.inputBackground : theme.dangerSoft,
                        opacity: stats.completedCount === 0 ? 0.6 : 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.clearButtonText,
                        { color: stats.completedCount === 0 ? theme.subtext : theme.danger },
                      ]}>
                      Tøm fullførte
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          }
          renderItem={({ item, index }) => (
            <TodoItem
              index={index}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
              onToggle={handleToggleTodo}
              theme={theme}
              todo={item}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={!isReady}
              onRefresh={() => setIsReady((currentValue) => currentValue)}
              tintColor={theme.accent}
            />
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  headerWrapper: {
    gap: 18,
    paddingBottom: 18,
  },
  heroCard: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 34,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 260,
  },
  heroBadge: {
    alignItems: 'center',
    borderRadius: 20,
    gap: 6,
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  heroBadgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  statsRow: {
    gap: 12,
    marginTop: 18,
    paddingRight: 4,
  },
  statCard: {
    borderRadius: 22,
    minWidth: 104,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  toolsCard: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 26,
    elevation: 4,
  },
  searchRow: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1, 
    fontSize: 15,
    paddingVertical: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },   
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  clearButton: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  emptyIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
});
