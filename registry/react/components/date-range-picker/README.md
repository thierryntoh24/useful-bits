# date range picker
A reusable date range picker based on shadcn/ui that allows users to select a start and end date. Displays a calendar popover with customizable months and supports form integration. Works kinda like a native input element.

## usage
### Example 1: Basic usage
```tsx
function Example1() {

  return (
    <DateRangePicker label="Select Period" />
  );
}
```

### Example 2: With validation
```tsx
function Example2() {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setError("Please select a date range");
      return;
    }
    console.log("Selected range:", dateRange);
  };

  return (
    <DateRangePicker
      value={dateRange}
      onChange={(range) => {
        setDateRange(range);
        setError("");
      }}
      label="Reporting Period"
      name="reportPeriod"
      required
      error={error}
    />
  );
}
```

### Example 3: With date constraints
```tsx
function Example3() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      label="Booking Dates"
      minDate={new Date()} // No past dates
      maxDate={new Date(2025, 11, 31)} // Max end of year
      disabledDates={[
        new Date(2025, 0, 1), // New Year
        new Date(2025, 11, 25), // Christmas
      ]}
      numberOfMonths={1}
    />
  );
}
```

### Example 4: Custom formatting and styling
```ts
function Example4() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      label="Custom Format"
      dateFormat="yyyy-MM-dd"
      placeholder="YYYY-MM-DD to YYYY-MM-DD"
      buttonClassName="w-[300px]"
      align="start"
    />
  );
}
```

### Example 5: Form integration with React Hook Form
```tsx
import { useForm, Controller } from "react-hook-form";

function Example5() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data.dateRange);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="dateRange"
        control={control}
        rules={{ required: "Date range is required" }}
        render={({ field, fieldState }) => (
          <DateRangePicker
            value={field.value}
            onChange={field.onChange}
            label="Reporting Period"
            error={fieldState.error?.message}
            required
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Example 6: Form submission with FormData
```tsx
function Example6() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fromDate = formData.get("period_from") as string;
    const toDate = formData.get("period_to") as string;

    console.log({
      from: fromDate ? new Date(fromDate) : null,
      to: toDate ? new Date(toDate) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DateRangePicker
        label="Reporting Period"
        name="period"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Example 7: Presets/Quick Select (common date ranges)
```tsx
function Example7() {
  const [dateRange, setDateRange] = useState<DateRange>();

  const selectLast7Days = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    setDateRange({ from, to });
  };

  const selectLast30Days = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    setDateRange({ from, to });
  };

  return (
    <div className="space-y-2">
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        label="Select Period"
      />
      <div className="flex gap-2">
        <button onClick={selectLast7Days} className="text-sm">
          Last 7 days
        </button>
        <button onClick={selectLast30Days} className="text-sm">
          Last 30 days
        </button>
      </div>
    </div>
  );
}
```
