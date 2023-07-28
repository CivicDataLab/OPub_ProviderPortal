import React from 'react';
import { CheckboxGroupState } from '@react-stately/checkbox';

export const CheckboxGroupContext =
  React.createContext<CheckboxGroupState | null>(null);
