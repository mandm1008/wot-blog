export const getRule = () => ({
  require: (value: string | undefined, name: string) => (!!value ? undefined : `Field ${name} is required!`),
  email: (value: string) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : 'Invalid email'),
  password: (value: string) =>
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(value)
      ? undefined
      : 'Password must be at least eight characters, at least 1 uppercase character, least 1 lowercase character, least 1 numeric character and least one special character'
})

export interface validateValue {
  value: string
  correct?: boolean
}

export interface handleState<S = validateValue> extends React.Dispatch<React.SetStateAction<S> | S> {}

export function validateEmail({
  email,
  setEmail,
  setMess = () => {},
  offMess = false
}: {
  email: validateValue
  setEmail: handleState
  setMess?: handleState<string>
  offMess?: boolean
}) {
  const Rules = getRule()
  const mess = Rules.email(email.value)
  if (mess && email.value) {
    offMess || setMess(mess)
    setEmail((prev) => {
      prev.correct = false
      return prev
    })
  } else {
    setMess('')
    email.value &&
      setEmail((prev) => {
        prev.correct = true
        return prev
      })
  }
}

export function validateRePassword({
  rePassword,
  password,
  setRePassword,
  setMess = () => {},
  offMess = false
}: {
  rePassword: validateValue
  password: validateValue
  setRePassword: handleState
  setMess?: handleState<string>
  offMess?: boolean
}) {
  const Rules = getRule()
  if (rePassword.value === password.value) {
    rePassword.value && Rules.password(password.value) === undefined && setMess('')
    setRePassword((prev) => {
      prev.correct = true
      return prev
    })
  } else {
    offMess || setMess('Repeat password incorrect')
    setRePassword((prev) => {
      prev.correct = false
      return prev
    })
  }
}

export function validatePassword({
  password,
  setPassword,
  setMess = () => {},
  offMess = false
}: {
  password: validateValue
  setPassword: handleState
  setMess?: handleState<string>
  offMess?: boolean
}) {
  const Rules = getRule()
  const mess = Rules.password(password.value)
  if (mess && password.value) {
    offMess || setMess(mess)
    setPassword((prev) => {
      prev.correct = false
      return prev
    })
  } else {
    setMess('')
    password.value &&
      setPassword((prev) => {
        prev.correct = true
        return prev
      })
  }
}

type Event = KeyboardEvent & { target?: EventTarget & HTMLInputElement }

export function handleEnterKeyEvent(
  formGroup: React.MutableRefObject<HTMLDivElement | undefined>,
  ...validates: ((e: Event) => void)[]
) {
  const inputs = formGroup.current!.querySelectorAll('input')
  const handles: ((e: Event) => void)[] = []
  inputs.forEach((input, i) => {
    const handle = (e: Event) => handler(e, i)
    handles.push(handle)
    input.addEventListener('keyup', handle as any)
  })
  let timeout: NodeJS.Timeout | undefined = undefined

  function handler(e: Event, i: number) {
    if (e.key === 'Enter') {
      for (const input of Array.from(inputs)) {
        if (!input.value) {
          return input.focus()
        }
      }

      if (!timeout) {
        typeof validates[i] === 'function' && validates[i](e)
        timeout = setTimeout(() => {
          timeout = undefined
          formGroup.current!.querySelector('button')!.click()
        }, 1000)
      }
    }
  }

  return () =>
    inputs.forEach((input, i) => {
      input.removeEventListener('keyup', handles[i] as any)
    })
}

export function handleChangeInputKeyEvent(formGroup: React.MutableRefObject<HTMLDivElement | undefined>) {
  if (!formGroup.current) return
  const inputs = formGroup.current.querySelectorAll('input')
  const handles: ((e: Event) => void)[] = []
  inputs.forEach((input, i) => {
    const handle = (e: Event) => handler(e, i)
    handles.push(handle)
    input.addEventListener('keydown', handle as any)
  })

  function handler(e: Event, i: number) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      return inputs[i - 1 < 0 ? inputs.length - 1 : i - 1].focus()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      return inputs[i + 1 >= inputs.length ? 0 : i + 1].focus()
    }
  }

  return () =>
    inputs.forEach((input, i) => {
      input.removeEventListener('keydown', handles[i] as any)
    })
}
