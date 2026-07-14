import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { CheckIcon } from './icons'

interface MenuContextValue {
  openMenu: string | null
  setOpenMenu: (id: string | null) => void
  toggleMenu: (id: string) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    if (openMenu === null) return
    const close = () => setOpenMenu(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openMenu])

  const toggleMenu = (id: string) => setOpenMenu((cur) => (cur === id ? null : id))

  return <MenuContext.Provider value={{ openMenu, setOpenMenu, toggleMenu }}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within MenuProvider')
  return ctx
}

interface MenuProps {
  id: string
  trigger: ReactNode
  children: ReactNode
}

export function Menu({ id, trigger, children }: MenuProps) {
  const { openMenu, toggleMenu } = useMenu()
  return (
    <div className="menu-anchor">
      <div
        onClick={(e) => {
          e.stopPropagation()
          toggleMenu(id)
        }}
      >
        {trigger}
      </div>
      {openMenu === id && (
        <div className="menu-pop" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  )
}

export function MenuOption({ label, onSelect }: { label: string; onSelect?: () => void }) {
  const { setOpenMenu } = useMenu()
  return (
    <div
      className="menu-item"
      onClick={() => {
        onSelect?.()
        setOpenMenu(null)
      }}
    >
      {label}
    </div>
  )
}

export function MenuCheckItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="menu-item" onClick={onToggle}>
      <span className={`menu-checkbox ${checked ? 'on' : 'off'}`}>{checked && <CheckIcon />}</span>
      <span>{label}</span>
    </div>
  )
}

interface SelectMenuProps {
  id: string
  options: readonly string[]
  selected: number
  onSelect: (index: number) => void
}

export function SelectMenu({ id, options, selected, onSelect }: SelectMenuProps) {
  return (
    <Menu
      id={id}
      trigger={
        <div className="select-btn">
          <span>{options[selected]}</span>
          <span className="select-caret">▾</span>
        </div>
      }
    >
      {options.map((opt, i) => (
        <MenuOption key={opt} label={opt} onSelect={() => onSelect(i)} />
      ))}
    </Menu>
  )
}
