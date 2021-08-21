import { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Portal from '../portal'
import { FiX } from 'react-icons/fi'

export default function Modal({ buttonTitle, buttonClassName, title, icon, body, confirmButtonTitle, onConfirm, confirmButtonClassName }) {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  const modalRef = useRef(null)

  const [open, setOpen] = useState(false)

  const show = () => setOpen(true)

  const hide = () => setOpen(false)

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
              <div className="bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 border-0 rounded-lg shadow-lg relative flex flex-col w-full items-center justify-center outline-none">
                <div className="w-full relative text-center p-4">
                  {icon}
                  <div className="w-full flex flex-col mb-4">
                    <div className="text-lg font-bold mb-2">{title}</div>
                    {body}
                  </div>
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