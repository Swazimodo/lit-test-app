import { ReactiveController, ReactiveControllerHost } from 'lit';

const compareArrays = (a: any[], b: any[]) =>
  a.length === b.length &&
  a.every((element, index) => element === b[index]);

export class Hooks implements ReactiveController {
  host: ReactiveControllerHost;

  initialized = false;
  #index = 0;
  hooksList: any[] = [];

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  _useStateSetter<T>(index: number) {
    return (val: T) => {
      if (val === this.hooksList[index][0])
        return
      this.hooksList[index] = [val, this.hooksList[index][1]]
      this.host.requestUpdate()
    }
  }
  useState<T>(val: T): [T, (val: T) => void] {
    const index = this.#index++
    if (this.initialized)
      return this.hooksList[index]
    const hookResult: [T, (val: T) => void] = [val, this._useStateSetter(index)]
    this.hooksList.push(hookResult)
    return hookResult
  }

  _useMemoSetter(index: number, value: any, watch: any[]) {
    this.hooksList[index] = [value, watch]
  }
  useMemo<T>(fn: () => T, arr: any[]) {
    const index = this.#index++
    if (this.initialized) {
      const hook = this.hooksList[index]
      if (compareArrays(hook[1], arr))
        return hook[0]
      const computed = fn()
      this._useMemoSetter(index, computed, arr)
      return computed
    }
    const computed = fn()
    this.hooksList.push([computed, arr])
    return computed
  }

  useCallback<T>(fn: T, arr: any[]): T {
    const index = this.#index++
    if (this.initialized) {
      const hook = this.hooksList[index]
      if (compareArrays(hook[1], arr))
        return hook[0]
      this._useMemoSetter(index, fn, arr)
      return fn
    }
    this.hooksList.push([fn, arr])
    return fn
  }

  hostConnected() { }
  hostDisconnected() { }
  hostUpdate() { }
  hostUpdated() {
    this.initialized = true
    this.#index = 0
  }
}


