import { html } from 'lit';

import { fc } from './functionalComponent';
import { useTextField, useNumberField } from './fieldHooks';


interface MyElementProps {
  a: number
}
export const MyElement = fc<MyElementProps>('my-element', (props, hooks) => {
  const [num, setNum] = hooks.useState(0)
  const handleCountClick = hooks.useCallback(() => {
    setNum(num + 1)
  }, [num])
  const longCall = hooks.useMemo(() => {
    console.log('memo ran')
    return num * 2
  }, [num])

  const [str, setStr] = hooks.useState("asdf")
  const handleStrDupClick = hooks.useCallback(() => {
    setStr(str + str)
  }, [str])

  const textInput = useTextField(hooks)
  const numInput = useNumberField(hooks)

  return html`
    <div>Hello from the dark side</div>
    <div>props: ${JSON.stringify(props)}</div>
    <div>
      num: ${num}
      <button @click=${handleCountClick}>add</button>
    </div>
    <div>${longCall}</div>
    <div>
      str: ${str}
      <button @click=${handleStrDupClick}>dup</button>
    </div>
    <div>text: <input type="text" value="${textInput.value}" @input="${textInput.handleChange}"></div>
    <div>text: <input type="text" value="${textInput.value}" @input="${textInput.handleChange}"></div>
    <div>numbers: <input type="text" .value="${numInput.value?.toString()}" @input="${numInput.handleChange}"></div>
    <div>numbers: <input type="text" .value="${numInput.value?.toString()}" @input="${numInput.handleChange}"></div>
  `
},
  {
    properties: {
      a: { attribute: 'a', type: Number }
    }
  })

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
