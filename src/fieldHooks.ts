import { Hooks } from './hooks';

export function useTextField(hooks: Hooks, initialValue?: string) {
  const [value, setValue] = hooks.useState(initialValue ?? "");

  const handleChange = hooks.useCallback((e: any) => {
    setValue(e.target.value);
  }, [setValue])

  return {
    value,
    handleChange,
    setValue
  };
}

export function useNumberField(hooks: Hooks, initialValue?: number) {
  const [value, setValue] = hooks.useState(initialValue ?? 0);

  const handleChange = hooks.useCallback((e: any) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
    // need to review how to properly handle input validation
    // https://github.com/lit/lit-element/issues/144
    // trying to force a rerender to clear out invalid input here but it's not working...
    if (value !== newValue) {
      hooks.host.requestUpdate()
    }
  }, [setValue])

  return {
    value,
    handleChange,
    setValue
  };
}
