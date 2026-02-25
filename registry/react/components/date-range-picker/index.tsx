import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldLabel, FieldError } from "@/components/ui/field";
import type { DateRange } from "react-day-picker";
import { DateRangePickerProps } from "@/registry/react/components/date-range-picker/types";

/**
 * DateRangePicker Component
 *
 * A reusable date range picker based on shadcn/ui that allows users to select a start and end date.
 * Displays a calendar popover with customizable months and supports form integration.
 *
 * @component
 * @example
 * // Basic usage
 * <DateRangePicker label="Select Period" />
 *
 * @example
 * // With validation and form integration
 * <DateRangePicker
 *   value={reportPeriod}
 *   onChange={setReportPeriod}
 *   label="Reporting Period"
 *   name="reportPeriod"
 *   required
 *   error={errors.reportPeriod}
 * />
 *
 * @example
 * // With date constraints
 * <DateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 *   numberOfMonths={1}
 * />
 */
export function DateRangePicker({
  value,
  onChange,
  dateFormat = "LLL dd, y",
  placeholder = "Pick a date range",
  label,
  error,
  required = false,
  disabled = false,
  name,
  id,
  numberOfMonths = 2,
  minDate,
  maxDate,
  disabledDates,
  closeOnSelect,
  className,
  buttonClassName,
  buttonSize,
  align = "end",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(value);

  // Sync internal state with external value
  React.useEffect(() => {
    setInternalRange(value);
  }, [value]);

  const handleSelect = (range: DateRange | undefined) => {
    setInternalRange(range);
    onChange?.(range);

    // Close popover when both dates are selected
    if (range?.from && range?.to && closeOnSelect) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <FieldLabel htmlFor={id || name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}

      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id || name}
              type="button"
              variant="outline"
              disabled={disabled}
              size={buttonSize}
              className={cn(
                "justify-start text-left font-normal",
                !internalRange && "text-muted-foreground",
                buttonClassName,
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalRange?.from ? (
                internalRange.to ? (
                  <>
                    {format(internalRange.from, dateFormat)} -{" "}
                    {format(internalRange.to, dateFormat)}
                  </>
                ) : (
                  format(internalRange.from, dateFormat)
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align={align}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={internalRange?.from}
              selected={internalRange}
              onSelect={handleSelect}
              numberOfMonths={numberOfMonths}
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
      </div>

      {error && <FieldError>{error}</FieldError>}

      {/* Hidden inputs for form submission */}
      {name && (
        <>
          <input
            type="hidden"
            name={`${name}_from`}
            value={internalRange?.from ? internalRange.from.toISOString() : ""}
          />
          <input
            type="hidden"
            name={`${name}_to`}
            value={internalRange?.to ? internalRange.to.toISOString() : ""}
          />
        </>
      )}
    </div>
  );
}
