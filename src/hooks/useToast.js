import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = ++toastId
    setToasts(prev => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showSearchResult = useCallback((room, results) => {
    // results: { clues: string[], documents: object[], items: string[] }
    const { clues = [], documents = [], items = [] } = results

    if (clues.length > 0) {
      addToast({
        type: 'search',
        title: `Searched ${room}`,
        message: clues.length === 1 ? clues[0] : `Found ${clues.length} clues`
      })
    }

    if (documents.length > 0) {
      documents.forEach(doc => {
        addToast({
          type: 'document',
          title: 'Document Found',
          message: doc.title
        })
      })
    }

    if (items.length > 0) {
      items.forEach(item => {
        addToast({
          type: 'item',
          title: 'Item Found',
          message: item
        })
      })
    }

    if (clues.length === 0 && documents.length === 0 && items.length === 0) {
      addToast({
        type: 'info',
        title: `Searched ${room}`,
        message: 'Nothing new found'
      })
    }
  }, [addToast])

  const showInfo = useCallback((title, message) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showSearchResult,
    showInfo
  }
}
