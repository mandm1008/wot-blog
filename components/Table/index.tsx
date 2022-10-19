import { useState, useRef, memo } from 'react'
import { useBrowserLayoutEffect } from '~/hooks'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from './Table.module.scss'
import Link from '../Link'
import Button from '../Button'
import RowItem, { TypeRowItem, OptionsRowItem } from './components/RowItem'
import { DeleteServer } from '~/servers'
import { FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaRegCopy } from 'react-icons/fa'

const cx = classNames.bind(styles)

export type FieldType = TypeRowItem
export type Field = {
  name: string
  as?: string
  type: FieldType
  options?: OptionsRowItem
}
type Action = {
  name: string
  handler: (response: Apis.ApiDelete.Res & Apis.Error) => void
}
type Model = Models.Category | Models.Post | Models.Email
type ListRef<T> = {
  [key: string]: T
}

interface Props {
  fields: Field[]
  data: Model[]
  actions: Action[]
  path: string
  save?: (id: string, title: string, color?: string) => Promise<any>
  edit?: boolean
  copy?: (id: string) => Promise<any>
}

function Table({ fields = [], data = [], actions = [], path, save, edit, copy }: Props) {
  const [list, setList] = useState(data)
  const [page, setPage] = useState(0)
  const [checkValue, setCheckValue] = useState({
    main: false,
    checks: list.map(() => false)
  })
  const inputs = useRef<ListRef<HTMLInputElement>>({})
  const colors = useRef<ListRef<HTMLInputElement>>({})
  const [action, setAction] = useState('action')

  useBrowserLayoutEffect(() => {
    const softData = handleSoftData(data)

    setList(softData)

    setCheckValue({
      main: false,
      checks: data.map(() => false)
    })

    setAction('action')
  }, [data])

  async function handleActions() {
    toast.loading('Request ' + action, { id: 'action' })
    const body = { ids: list.filter((item, index) => checkValue.checks[index]).map((item) => item._id) }

    try {
      const response = await DeleteServer.tableAction({ path, action }, body)

      actions.find((item) => item.name === action)!.handler(response)
      response.error || toast.success(action.toUpperCase() + ' successfully!', { id: 'action' })
    } catch (e) {
      toast.error(action.toUpperCase() + ' failed!', { id: 'action' })
    }
  }

  function handleSoftData(data: Model[]) {
    let result = [...data]
    const length = result.length
    for (let i = 0; i < length - 1; i++) {
      for (let j = i + 1; j < length; j++) {
        if (new Date(result[i].createdAt).getTime() < new Date(result[j].createdAt).getTime()) {
          const change = result[j]
          result[j] = result[i]
          result[i] = change
        }
      }
    }
    return result
  }

  function handleMainCheck(e: React.ChangeEvent<HTMLInputElement>) {
    setCheckValue((prev) => ({
      main: e.target.checked,
      checks: prev.checks.map(() => e.target.checked)
    }))
  }

  function handleChecks(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    setCheckValue((prev) => {
      const checks = prev.checks.map((check, i) => (index === i ? e.target.checked : check))
      const main = inspectChecks(checks)

      return {
        main,
        checks
      }
    })
  }

  function inspectChecks(checks: boolean[]) {
    for (const check of checks) {
      if (!check) return false
    }
    return true
  }

  return (
    <>
      <div className={cx('group')}>
        <select onChange={(e) => setAction(e.target.value)} value={action}>
          <option value="action">Actions</option>
          {actions.map((action, i) => (
            <option key={i} value={action.name}>
              {action.name.toUpperCase()}
            </option>
          ))}
        </select>
        <Button primary disable={action === 'action'} onClick={handleActions}>
          Actions
        </Button>
      </div>

      <ul className={cx('responsive-table')}>
        <li className={cx('table-header')}>
          <div className={cx('col', 'col-min')}>
            <input onChange={handleMainCheck} type="checkbox" checked={checkValue.main} />
          </div>

          {fields.map((field, i) => (
            <div key={i} className={cx('col')}>
              {field.as || field.name}
            </div>
          ))}

          <div className={cx('page')}>
            <FiChevronLeft
              className={cx('icon')}
              onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : Math.ceil(list.length / 10) - 1))}
            />
            <input type="text" value={page + 1} readOnly />
            <FiChevronRight
              className={cx('icon')}
              onClick={() => setPage((prev) => (Math.ceil(list.length / 10) > prev + 1 ? prev + 1 : 0))}
            />
            ({data.length})
          </div>
        </li>
        {list.slice(page * 10, (page + 1) * 10).map((item) => (
          <li key={item._id} className={cx('table-row')}>
            <div className={cx('col', 'col-min')} data-label="Checkbox">
              <input
                onChange={(e) =>
                  handleChecks(
                    e,
                    list.findIndex((listItem) => listItem === item)
                  )
                }
                type="checkbox"
                checked={checkValue.checks[list.findIndex((listItem) => listItem === item)]}
              />
            </div>

            {fields.map((field, i) => (
              <RowItem
                key={i}
                ref={(ref: any) => {
                  if (field.type === 'input') inputs.current[item._id] = ref
                  if (field.type === 'color') colors.current[item._id] = ref
                }}
                path={path}
                data={item}
                {...field}
                className={cx('col')}
              />
            ))}

            <div className={cx('controls')}>
              {edit && (
                <Link href={`/admin/${path}/${item.slug}/edit`} className={cx('edit')}>
                  <FiEdit />
                </Link>
              )}

              {save && (
                <Button
                  onClick={async () => {
                    const data = await save(item._id, inputs.current[item._id].value, colors.current[item._id].value)

                    setList((prev) => {
                      const results = []
                      for (const category of prev) {
                        if (category._id !== item._id) {
                          results.push(category)
                        } else {
                          results.push(data)
                        }
                      }
                      return results
                    })
                  }}
                  primary
                >
                  Save
                </Button>
              )}

              {copy && (
                <span onClick={() => copy(item._id)} className={cx('edit')}>
                  <FaRegCopy />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default memo(Table)
