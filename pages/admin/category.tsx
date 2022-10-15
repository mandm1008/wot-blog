import { useState, useMemo, useCallback, useRef } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import styles from '~/styles/admin/Category.module.scss'
import Wrapper from '~/components/Wrapper'
import Button from '~/components/Button'
import Table, { FieldType } from '~/components/Table'
import PathMenu from '~/components/PathMenu'
import { CategoryServer } from '~/servers'

const cx = classNames.bind(styles)

function Category({ categories }: { categories: string }) {
  const category: Apis.Vi_Hi<Models.Category[]> = JSON.parse(categories)
  const [visibleCategory, setVisibleCategory] = useState(category.visible)
  const [hiddenCategory, setHiddenCategory] = useState(category.hidden)
  const [nameCategory, setNameCategory] = useState('')
  const colorElement = useRef<HTMLInputElement>()

  const handleHidden = useCallback(
    ({ ids, error }: { ids: string[]; error?: string }) => {
      if (error) {
        console.log(error)
      } else {
        setHiddenCategory((prev) => [
          ...prev,
          ...visibleCategory.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return true
            }
            return false
          })
        ])

        setVisibleCategory((prev) =>
          prev.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return false
            }
            return true
          })
        )
      }
    },
    [visibleCategory]
  )

  const handleCreateCategory = useCallback(async () => {
    toast.loading('Creating category...', { id: 'create-category' })
    const response = await CategoryServer.create({ title: nameCategory, color: colorElement.current!.value })

    const { data: newCategory, error } = response
    if (error) {
      toast.error('Create failed!', { id: 'create-category' })
      console.log(`Failed to create category!!! Error: ${error}`)
    } else {
      toast.success('Created category: ' + nameCategory, { id: 'create-category' })
      setHiddenCategory((prev) => [...prev, newCategory])

      setNameCategory('')
    }
  }, [nameCategory])

  const handleEditCategory = useCallback(async (id: string, title: string, color?: string) => {
    toast.loading('Save...', { id: 'save' })
    const response = await CategoryServer.edit({ id, title, color })

    const { data, error } = response
    if (error) {
      toast.error('Error saving!', { id: 'save' })
      console.log('Failed to edit category :' + error)
    } else {
      toast.success('Save successfully!', { id: 'save' })
      return data
    }
  }, [])

  const handleRestore = useCallback(
    ({ ids, error }: { ids: string[]; error?: string }) => {
      if (error) {
        console.log(error)
      } else {
        setVisibleCategory((prev) => [
          ...prev,
          ...hiddenCategory.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return true
            }
            return false
          })
        ])

        setHiddenCategory((prev) =>
          prev.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return false
            }
            return true
          })
        )
      }
    },
    [hiddenCategory]
  )

  const fields = useMemo(
    (): { name: string; type: FieldType }[] => [
      { name: 'title', type: 'input' },
      { name: 'color', type: 'color' },
      { name: 'createdAt', type: 'time' },
      { name: 'updatedAt', type: 'time' }
    ],
    []
  )
  const visibleActions = useMemo(
    () => [
      { name: 'hidden', handler: handleHidden }
      // { name: 'delete', handler: (response) => handleDelete(response, 'visible') }
    ],
    [handleHidden]
  )

  const hiddenActions = useMemo(
    () => [
      { name: 'restore', handler: handleRestore },
      { name: 'delete', handler: (response) => handleDelete(response, 'hidden') }
    ],
    [handleRestore]
  )

  function handleDelete({ ids, error }: { ids: string[]; error?: string }, type: 'visible' | 'hidden') {
    if (error) {
      console.log(error)
    } else {
      if (type === 'visible') {
        setVisibleCategory((prev) =>
          prev.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return false
            }
            return true
          })
        )
      }
      if (type === 'hidden') {
        setHiddenCategory((prev) =>
          prev.filter((item) => {
            for (const id of ids) {
              if (item._id === id) return false
            }
            return true
          })
        )
      }
    }
  }

  return (
    <Wrapper
      Head={
        <Head>
          <title>Admin: Categories</title>
        </Head>
      }
    >
      <main className={cx('main')}>
        <PathMenu />
        <div className={cx('group')}>
          <input
            type="text"
            placeholder="Add a category"
            value={nameCategory}
            onChange={(e) => setNameCategory(e.target.value)}
          />
          <input ref={colorElement as React.LegacyRef<HTMLInputElement>} type="color" defaultValue="#d3304d" />
          <Button primary onClick={handleCreateCategory}>
            ADD
          </Button>
        </div>
        <Table
          path="category"
          fields={fields}
          data={visibleCategory}
          actions={visibleActions}
          save={handleEditCategory}
        />
        <Table
          path="category"
          fields={fields}
          data={hiddenCategory}
          actions={hiddenActions}
          save={handleEditCategory}
        />
      </main>
    </Wrapper>
  )
}

import { GetServerSideProps } from 'next'
import { getAllCategory } from '~/tools/category'
import { verifyAdmin } from '~/tools/middleware'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const noAdmin = await verifyAdmin(req as any)
  if (noAdmin) return noAdmin

  const data = await getAllCategory(true)
  const categories = JSON.stringify(data)

  return {
    props: {
      categories
    }
  }
}

export default Category
