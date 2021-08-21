import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Portal from '../portal'
import { FiX } from 'react-icons/fi'

export default function Modal({ buttonTitle, buttonClassName, title, icon, body, cancelButtonTitle, onCancel, confirmButtonTitle, onConfirm, confirmButtonClassName }) {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const modalRef = useRef(null)

  const [open, setOpen] = useState(false)

  const show = () => setOpen(true)

  const hide = () => {
    if (onCancel) {
      onCancel()
    }
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (!modalRef || !modalRef.current) return false
      if (!open || modalRef.current.contains(event.target)) return false

      setOpen(!open)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [modalRef, open])

  return (
    <>
      <button
        type="button"
        onClick={show}
        className={buttonClassName || 'btn btn-default btn-rounded bg-blue-500 hover:bg-blue-600 text-white'}
      >
        {buttonTitle}
      </button>
      {open && (
        <Portal selector="#portal">
          <div className="modal-backdrop fade-in" />
          <div data-background={background} className={`modal show ${background === 'dark' ? 'dark' : ''}`}>
            <div ref={modalRef} className="w-auto max-w-sm lg:max-w-lg relative lg:my-4 mx-auto">
              <div className="w-full bg-white dark:bg-gray-800 relative outline-none rounded-lg shadow-lg border-0 border-gray-200 dark:border-gray-700 flex flex-col text-gray-900 dark:text-white">
                <div className="relative flex-auto p-4">
                  <div className="flex items-start justify-start space-x-4 p-2">
                    <div className="w-12 flex-shrink-0">{icon}</div>
                    <div className="w-full flex flex-col">
                      <div className="text-lg font-bold mb-2">{title}</div>
                      {body}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 border-solid rounded-b flex items-center justify-end space-x-2 p-4">
                  <button
                    type="button"
                    onClick={hide}
                    className="btn btn-default btn-rounded bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    {cancelButtonTitle || 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onConfirm) onConfirm()
                      hide()
                    }}
                    className={confirmButtonClassName || 'btn btn-default btn-rounded bg-blue-500 hover:bg-blue-600 text-white'}
                  >
                    {confirmButtonTitle || 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}