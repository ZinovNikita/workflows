export const field2 = (label: string, fname: string, ftype: string, field?: Field2):Field2 => {
  return Object.assign({ label, fname, ftype }, field || {}) as Field2
}
export const field1 = (name: string, fname: string, ftype: string, field?: Field1):Field1 => {
  return Object.assign({ name, fname, ftype }, field || {}) as Field1
}

export default class WorkflowBase<F = Field2> {
  private wf: Workflow<F>
  private wf_id: number
  public constructor(wf_id:number, version?: 1 | 2) {
    this.wf_id = wf_id
    this.wf = {
      usb_fields_version: version,
      version: version || 2,
      steps: {}
    }
  }
  private error(msg: string) {
    throw new Error(`${this.wf_id}: ${msg}`)
  }
  private func2str = (v: any): any => {
    if (v === undefined || v === null)
      return null
    if (Array.isArray(v))
      return v.map(this.func2str)
    if (typeof v === 'object') {
      const v1 = {}
      for (let k in v)
        v1[k] = this.func2str(v[k])
      return v1
    }
    if (typeof v === 'function')
      return v.toString()
    if (Object.prototype.toString.call(v) === '[object Date]')
      return v.toISOString()
    return v
  }
  public get json (): {wf_id: number, wf_data: string} {
    return {
      wf_id: this.wf_id,
      wf_data: JSON.stringify(this.func2str(this.wf))
    }
  }
  public addStep (step_id: numstr, name: string, step: Step<F>) {
    const steps = Object.keys(this.wf.steps)
    if (steps.includes(step_id))
      return this.error(`Этап ${step_id} уже существует`)
    steps.push(step_id)
    if (!step.fields || !Array.isArray(step.fields))
      return this.error(`Этап ${step_id} не содержит перечня полей`)
    if (step.actions && (Array.isArray(step.actions) || typeof step.actions !== 'object'))
      return this.error(`Этап ${step_id} не содержит перечня действий`)
    if (!step.actions)
      step.actions = {}
    else {
      for (let act_id in step.actions) {
        const to_step = step.actions[act_id].to_step || undefined
        if (to_step && steps.includes(to_step))
          return this.error(`Действие ${step_id}.${act_id} переход на несуществующий этап ${to_step}`)
      }
    }
    this.wf.steps[step_id] = {...step, name}
  }
  public addAction (step_id: numstr, act_id: numstr, action: Action) {
    const steps = Object.keys(this.wf.steps)
    if (!steps.includes(step_id))
      return this.error(`Этап ${step_id} не найден`)
    const step = this.wf.steps[step_id]
    if (!step.actions)
      step.actions = {}
    if (!step.actions[act_id] || Array.isArray(step.actions) || typeof step.actions !== 'object')
      step.actions[act_id] = {}
    step.actions[act_id] = Object.assign(step.actions[act_id], action)
  }
}

export const that: any = {}