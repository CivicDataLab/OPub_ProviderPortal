import { CrossSize200 } from '@opub-icons/ui';
import { Calendar } from '@opub-icons/workflow';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import DatePickerComp from 'react-date-picker/dist/entry.nostyle';
import styled from 'styled-components';

const DatePicker = ({ onDateChange, label, defaultVal }) => {
  const [value, onChange] = React.useState(new Date(defaultVal));
  return (
    <Wrapper title={`Date ${label}`}>
      <DatePickerComp
        calendarIcon={<Calendar fill="#514AF3" />}
        onChange={(e) => {
          onChange(e);
          var isoDateTime = new Date(
            e.getTime() - e.getTimezoneOffset() * 60000
          ).toISOString();
          onDateChange(isoDateTime.split('T')[0]);
        }}
        value={value}
        maxDetail="year"
        clearIcon={<CrossSize200 fill="var(--color-gray-04)" />}
      />
    </Wrapper>
  );
};

export { DatePicker };

const Wrapper = styled.div`
  .react-date-picker {
    &__wrapper {
      border: 1px solid rgba(0, 0, 0, 0.12);
      box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.08);
      border-radius: 2px;
      padding: 3px 8px 3px 4px;
    }

    &__inputGroup {
      min-width: calc((4px * 3) + 0.217em * 2);
    }

    &__calendar-button {
      order: -1;
    }

    &__clear-button {
      padding: 0;
      padding-left: 4px;
    }
  }

  .react-calendar {
    &__tile {
      padding: 2em 0.1em;
    }
  }
`;
