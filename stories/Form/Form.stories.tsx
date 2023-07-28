import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormExample } from './FormExample';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/FormExample',
  component: FormExample,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FormExample>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FormExample> = (args) => (
  <FormExample {...args} />
);

export const Primary = Template.bind({});
