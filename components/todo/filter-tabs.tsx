import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TodoTheme } from '@/constants/todo-theme';
import { FilterType } from '@/types/todo';

type FilterTabsProps = {
  filter: FilterType;
  onChangeFilter: (value: FilterType) => void;
  theme: TodoTheme;
};

const filters: FilterType[] = ['All', 'Active', 'Completed'];
const filterLabels: Record<FilterType, string> = {
  All: 'Alle',
  Active: 'Aktive',
  Completed: 'Fullførte',
};

export function FilterTabs({ filter, onChangeFilter, theme }: FilterTabsProps) {
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {filters.map((item) => {
        const active = item === filter;

        return (
          <Pressable
            key={item}
            onPress={() => onChangeFilter(item)}
            style={[
              styles.tab,
              { backgroundColor: active ? theme.accent : 'transparent' },
            ]}>
            <Text style={[styles.label, { color: active ? '#F8FAFC' : theme.subtext }]}>
              {filterLabels[item]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 6,
  },
  tab: {
    borderRadius: 16,
    flex: 1,
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
