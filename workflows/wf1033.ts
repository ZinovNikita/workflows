import WorkflowBase, {that} from "../wfbase";

const all_fields = [
  {label: 'Поле1', fname: 'f1', ftype: 'input', init_from: 'f1'},
  {label: 'Поле1', fname: 'f2', ftype: 'memo', init_from: 'f2'},
  {label: 'Поле1', fname: 'f3', ftype: 'list', init_from: 'f3'},
  {label: 'Поле1', fname: 'f4', ftype: 'dict', init_from: 'f4'}
]

const wf = new WorkflowBase<Field2>(1033, 2);
wf.addStep('1', 'Создание заявки', {
  fields: all_fields.filter(f => ['f1','f2'].includes(f.fname)),
  validators: [
    function (a) { return that.fvalues.f1.length >= 8 }
  ],
  mounted: function () { return that.setValue('f1', 123) }
})
wf.addStep('2', 'Исполнение', {
  fields: [
    ...all_fields.filter(f => ['f1','f2'].includes(f.fname)).map(f=>({...f, fname: `_${f.fname}`, vtype: 'global' })),
    ...all_fields.filter(f => ['f3','f4'].includes(f.fname))
  ]
})
wf.addAction('1','1',{
  name: 'Подать заявку',
  prioritet: 'Стандартный',
  template: '282546692492717',
  to_step: '2',
  srv_id: '7704',
  team: 'default',
  status: 'Назначена в Команду'
})
wf.addAction('2','1',{
  name: 'Закрыть заявку',
  status: 'Закрыта',
  closure_code: 'Решена'
})
export default wf.json