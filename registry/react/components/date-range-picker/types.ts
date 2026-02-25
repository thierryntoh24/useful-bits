import type { DateRange } from "react-day-picker";

/**
 * Props for the DateRangePicker component
 *
 * @interface DateRangePickerProps
 */
export interface DateRangePickerProps {
  /**
   * The currently selected date range value.
   * Contains from and to dates, or undefined if not selected.
   *
   * @type {DateRange | undefined}
   * @default undefined
   *
   * @example
   * value={{ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) }}
   */
  value?: DateRange;

  /**
   * Callback fired when the date range value changes.
   * Receives the new DateRange object or undefined if cleared.
   *
   * @param {DateRange | undefined} range - The new date range value
   * @returns {void}
   *
   * @example
   * onChange={(range) => {
   *   console.log('From:', range?.from);
   *   console.log('To:', range?.to);
   *   setMyDateRange(range);
   * }}
   */
  onChange?: (range: DateRange | undefined) => void;

  /**
   * Format string for displaying selected dates.
   * Uses date-fns format tokens.
   *
   * @type {string}
   * @default "LLL dd, y"
   * @see {@link https://date-fns.org/docs/format}
   *
   * @example
   * dateFormat="LLL dd, y"     // Jan 01, 2025
   * dateFormat="MMM d, yyyy"   // Jan 1, 2025
   * dateFormat="yyyy-MM-dd"    // 2025-01-01
   */
  dateFormat?: string;

  /**
   * Placeholder text shown when no date range is selected.
   *
   * @type {string}
   * @default "Pick a date range"
   */
  placeholder?: string;

  /**
   * Label text for the date range picker field.
   *
   * @type {string}
   * @example
   * label="Reporting Period"
   */
  label?: string;

  /**
   * Error message to display below the picker.
   * When provided, the field will be styled in an error state.
   *
   * @type {string}
   * @example
   * error="Date range is required"
   * error={formErrors.dateRange?.message}
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
   * Prevents user interaction.
   *
   * @type {boolean}
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the picker should close when a range has been selected.
   *
   * @type {boolean}
   * @default false
   */
  closeOnSelect?: boolean;

  /**
   * Name attribute for form submission.
   * Creates two hidden inputs: `${name}_from` and `${name}_to` with ISO string values.
   *
   * @type {string}
   * @example
   * name="reportPeriod"
   * // Form data will contain:
   * // reportPeriod_from: "2025-01-01T00:00:00.000Z"
   * // reportPeriod_to: "2025-01-31T00:00:00.000Z"
   */
  name?: string;

  /**
   * ID attribute for the trigger button.
   *
   * @type {string}
   */
  id?: string;

  /**
   * Number of months to display in the calendar.
   *
   * @type {number}
   * @default 2
   * @example
   * numberOfMonths={1} // Single month view
   * numberOfMonths={2} // Two months side-by-side (default)
   */
  numberOfMonths?: number;

  /**
   * Minimum selectable date.
   * Dates before this will be disabled.
   *
   * @type {Date}
   * @example
   * minDate={new Date()} // Disable past dates
   */
  minDate?: Date;

  /**
   * Maximum selectable date.
   * Dates after this will be disabled.
   *
   * @type {Date}
   * @example
   * maxDate={new Date(2025, 11, 31)} // Disable dates after Dec 31, 2025
   */
  maxDate?: Date;

  /**
   * Array of specific dates to disable.
   *
   * @type {Date[]}
   * @example
   * disabledDates={[new Date(2025, 0, 1), new Date(2025, 11, 25)]}
   */
  disabledDates?: Date[];

  /**
   * CSS class name for the root container.
   *
   * @type {string}
   */
  className?: string;

  /**
   * CSS class name for the trigger button.
   *
   * @type {string}
   * @example
   * buttonClassName="w-[300px]"
   */
  buttonClassName?: string;

  /**
   * Size prop for the trigger button.
   *
   * @type {string}
   * @example
   * buttonSize="sm"
   */
  buttonSize?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

  /**
   * Alignment of the popover relative to the trigger.
   *
   * @type {"start" | "center" | "end"}
   * @default "end"
   */
  align?: "start" | "center" | "end";
}
