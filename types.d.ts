type numstr = `${number}`

type Watch = {
  atr: string,
  handler: string,
  options?: {
    immediate?: boolean
    deep?: boolean
  }
}

type Field1 = {
  name: string
  fname: string
  ftype: string
  vtype?: 'global' | 'clean_on_copy'
  init_from?: string|string[]
  help_block?: string
  onchange?: () => void
  beforcreate?: () => void
  aftercreate?: () => void
  fields?: Field1[]
}

type Field2<Attrs = {[k:string]: any}, Events = {[k:string]: (v?: any) => void}> = {
  label: string
  fname: string
  ftype: string
  vtype?: 'global' | 'clean_on_copy'
  init_from?: string|string[]
  description?: string
  fields?: Field2[]
  attrs?: Attrs
  events?: Events
  watch?: Watch[]
}

type Approve = {
  apr_id: numstr,
  apv_str: string,
  description?: string,
  fields?: {
    hideGlobal?: boolean,
    action_name?: string,
    aprovefunc?: string,
    fields: Field1[]
  },
  on_success_approve: Action,
  on_fail_approve: Action,
  on_default?: Action
  on_abort?: Action
}

type AutoExec = {
  operation: string
  [k:string]: any
}

type Action = {
  name?: string
  to_step?: string,
  prioritet?: "Стандартный",
  template?: "282546692492717",
  sla?: string,
  srv_id?: string,
  team?: string,
  default_team?: string,
  to_person?: string,
  status?: 'Зарегистрирована' | 'Назначена в Команду' | 'Выполнена' | 'Закрыта'
  closure_code?: 'Решена' | 'Заявка отклонена' | 'Отказано при согласовании' | 'Отмена пользователем'
  auto_exec?: AutoExec[],
  folder?: string,
  no_autoclose?: boolean
  check_required?: boolean
  hidden?: boolean,
  approve?: Approve
}

type Step<Field=Field2> = {
  name?: string
  help?: string
  action_name?: string
  fields: Field[]
  actions?: {[k:numstr]: Action}
  validators?: ((act_id: number|string|null) => boolean)[]
  mounted?: () => void
  change_plan_begin?: false | boolean,
  change_deadline?: false | boolean,
  can_change_subject?: false | boolean,
  dont_wait_all_wors?: true | boolean
}

type Workflow<Field = Field2> = {
  usb_fields_version?: 1 | 2 | '1' | '2'
  version?: 1 | 2 | '1' | '2'
  steps: {[k:numstr]: Step<Field>}
  [k:string]: any
}
