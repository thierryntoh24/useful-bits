// components/ui/datetime-picker.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { DateTimePickerProps } from "./types";

/**
 * DateTimePicker Component
 *
 * A reusable date and time picker component that combines a calendar popover with an optional time input.
 * Supports controlled component patterns, form integration, and validation. Extended from shadcnui's
 * [DateTime Picker example](https://ui.shadcn.com/docs/components/radix/date-picker#time-picker)
 *
 * @component
 * @example
 * // Basic date picker
 * <DateTimePicker placeholder="Select a date" />
 *
 * @example
 * // Date and time picker with validation
 * <DateTimePicker
 *   value={appointmentDate}
 *   onChange={setAppointmentDate}
 *   showTime
 *   required
 *   error={errors.appointmentDate}
 *   name="appointmentDate"
 * />
 *
 * @example
 * // With date constraints
 * <DateTimePicker
 *   value={eventDate}
 *   onChange={setEventDate}
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 *   disabledDates={[new Date(2025, 0, 1)]}
 * />
 */
export function DateTimePicker({
  value,
  onChange,
  showTime = false,
  dateFormat = "PPP",
  placeholder = "Select date",
  dateLabel = "Date",
  timeLabel = "Time",
  error,
  required = false,
  disabled = false,
  name,
  id,
  minDate,
  maxDate,
  disabledDates,
  className,
  dateClassName,
  timeClassName,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value,
  );

  // Sync internal state with external value
  React.useEffect(() => {
    setInternalDate(value);
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setInternalDate(undefined);
      onChange?.(undefined);
      setOpen(false);
      return;
    }

    // If we have existing date with time, preserve the time
    if (internalDate && showTime) {
      const newDate = new Date(selectedDate);
      newDate.setHours(internalDate.getHours());
      newDate.setMinutes(internalDate.getMinutes());
      newDate.setSeconds(internalDate.getSeconds());
      setInternalDate(newDate);
      onChange?.(newDate);
    } else {
      setInternalDate(selectedDate);
      onChange?.(selectedDate);
    }

    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (!timeValue || !internalDate) return;

    const [hours, minutes, seconds = "0"] = timeValue.split(":");
    const newDate = new Date(internalDate);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    newDate.setSeconds(parseInt(seconds, 10));

    setInternalDate(newDate);
    onChange?.(newDate);
  };

  const timeValue = internalDate
    ? `${internalDate.getHours().toString().padStart(2, "0")}:${internalDate
        .getMinutes()
        .toString()
        .padStart(
          2,
          "0",
        )}:${internalDate.getSeconds().toString().padStart(2, "0")}`
    : "";

  return (
    <div className={className}>
      <FieldGroup className={showTime ? "flex-row gap-4 flex-wrap" : ""}>
        {/* Date Picker */}
        <Field>
          {dateLabel && (
            <FieldLabel htmlFor={id || name}>
              {dateLabel}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                id={id || name}
                disabled={disabled}
                className={`justify-between font-normal ${dateClassName || ""}`}
              >
                {internalDate ? format(internalDate, dateFormat) : placeholder}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={internalDate}
                captionLayout="dropdown"
                defaultMonth={internalDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  if (
                    disabledDates?.some(
                      (d) => d.toDateString() === date.toDateString(),
                    )
                  ) {
                    return true;
                  }
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
          {error && <FieldError>{error}</FieldError>}
        </Field>

        {/* Time Picker (Optional) */}
        {showTime && (
          <Field className={timeClassName}>
            <FieldLabel htmlFor={`${id || name}-time`}>{timeLabel}</FieldLabel>
            <Input
              type="time"
              id={`${id || name}-time`}
              step="1"
              value={timeValue}
              onChange={handleTimeChange}
              disabled={disabled || !internalDate}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        )}
      </FieldGroup>

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={internalDate ? internalDate.toISOString() : ""}
        />
      )}
    </div>
  );
}
