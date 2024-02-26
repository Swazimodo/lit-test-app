import { LitElement, CSSResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PropertyDeclaration } from '@lit/reactive-element';

import { Hooks } from './hooks'

export const fc = <T extends {}>(tagName: string, fn: (props: T, hooks: Hooks) => unknown, options: { properties?: { [k in keyof T]: PropertyDeclaration }, css?: CSSResult } = {}): typeof LitElement => {
  @customElement(tagName)
  class FunctionalComponent extends LitElement {
    static override styles = options?.css
    static override get properties() {
      return options.properties || {}
    }

    hooks

    constructor() {
      super()
      this.hooks = new Hooks(this)
    }

    override render() {
      // @ts-ignore
      // TS really does not like the dynamic prop generation and expects different results
      // from `getOwnPropertyNames` then what actually happens at runtime
      const props: T = Object.getOwnPropertyNames(options.properties)
        .reduce((p, propertyName) => {
          // @ts-ignore
          p[propertyName] = this[propertyName]
          return p
        }, {})
      return fn(props, this.hooks)
    }
  }

  return FunctionalComponent;
}
