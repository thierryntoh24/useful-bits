/**
 * Props for the DateTimePicker component
 *
 * @interface DateTimePickerProps
 */
export interface DateTimePickerProps {
  /**
   * The currently selected date/time value.
   *
   * @type {Date | undefined}
   * @default undefined
   */
  value?: Date;

  /**
   * Callback fired when the date/time value changes.
   * Receives the new Date object or undefined if cleared.
   *
   * @param {Date | undefined} date - The new date value
   * @returns {void}
   *
   * @example
   * onChange={(date) => {
   *   console.log('Selected:', date?.toISOString());
   *   setMyDate(date);
   * }}
   */
  onChange?: (date: Date | undefined) => void;

  /**
   * Whether to show the time picker alongside the date picker.
   * When true, displays both date and time inputs in a row.
   * When false, only shows the date picker.
   *
   * @type {boolean}
   * @default false
   */
  showTime?: boolean;

  /**
   * Format string for displaying the selected date.
   * Uses date-fns format tokens.
   *
   * @type {string}
   * @default "PPP"
   * @see {@link https://date-fns.org/docs/format}
   *
   * @example
   * dateFormat="PPP"         // Jan 1, 2025
   * dateFormat="yyyy-MM-dd"  // 2025-01-01
   * dateFormat="MMMM d, yyyy" // January 1, 2025
   */
  dateFormat?: string;

  /**
   * Placeholder text shown when no date is selected.
   *
   * @type {string}
   * @default "Select date"
   */
  placeholder?: string;

  /**
   * Label text for the date picker field.
   *
   * @type {string}
   * @default "Date"
   */
  dateLabel?: string;

  /**
   * Label text for the time picker field.
   * Only displayed when showTime is true.
   *
   * @type {string}
   * @default "Time"
   */
  timeLabel?: string;

  /**
   * Error message to display below the date picker.
   * When provided, the field will be styled in an error state.
   *
   * @type {string}
   * @example
   * error="Date is required"
   * error={formErrors.appointmentDate?.message}
   */
  error?: string;

  /**
   * Whether the field is required.
   * Displays a red asterisk (*) next to the label.
   *
   * @type {boolean}
   * @default false
   */
  required?: boolean;

  /**
   * Whether the picker is disabled.
   * Prevents user interaction with both date and time inputs.
   *
   * @type {boolean}
   * @default false
   */
  disabled?: boolean;

  /**
   * Name attribute for the hidden input element.
   * Used for form submission - the value will be in ISO string format.
   *
   * @type {string}
   * @example
   * name="appointmentDate"
   * // Form data will contain: appointmentDate: "2025-01-01T14:30:00.000Z"
   */
  name?: string;

  /**
   * ID attribute for the date picker button.
   * Also used as a base for the time input ID (suffixed with '-time').
   *
   * @type {string}
   */
  id?: string;

  /**
   * Minimum selectable date.
   * Dates before this will be disabled in the calendar.
   *
   * @type {Date}
   * @example
   * minDate={new Date()} // Disable past dates
   * minDate={startDate}  // Ensure end date is after start date
   */
  minDate?: Date;

  /**
   * Maximum selectable date.
   * Dates after this will be disabled in the calendar.
   *
   * @type {Date}
   * @example
   * maxDate={new Date(2025, 11, 31)} // Disable dates after Dec 31, 2025
   */
  maxDate?: Date;

  /**
   * Array of specific dates to disable in the calendar.
   * Useful for blocking out holidays, booked dates, etc.
   *
   * @type {Date[]}
   * @example
   * disabledDates={[
   *   new Date(2025, 0, 1),  // New Year's Day
   *   new Date(2025, 11, 25), // Christmas
   * ]}
   */
  disabledDates?: Date[];

  /**
   * CSS class name for the root container element.
   *
   * @type {string}
   */
  className?: string;

  /**
   * CSS class name for the date picker button.
   *
   * @type {string}
   * @example
   * dateClassName="w-64"
   */
  dateClassName?: string;

  /**
   * CSS class name for the time picker input wrapper.
   *
   * @type {string}
   * @example
   * timeClassName="w-32"
   */
  timeClassName?: string;
}
