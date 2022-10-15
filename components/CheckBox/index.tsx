import classNames from 'classnames/bind'
import styles from './CheckBox.module.scss'

const cx = classNames.bind(styles)

interface Props {
  checked: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  id: string
}

function CheckBox({ checked, onChange = () => {}, className, id }: Props) {
  return (
    <>
      <label htmlFor={id} className={cx('wrapper', { checked, [className as any]: className })}>
        <div className={cx('inner')}></div>
      </label>
      <input id={id} checked={checked} onChange={onChange} type="checkbox" hidden />
    </>
  )
}

export default CheckBox
