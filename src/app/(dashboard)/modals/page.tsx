'use client'
import { useState } from 'react'
import {
  CircleAlert,
  TriangleAlert,
  Trash2,
  X,
  Info,
  CircleCheck,
  CircleHelp,
  Mail,
  Settings
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Label,
  Modal
} from '@/components/ui'
import { useAlert } from '@/contexts/alert-context'
import { LucideIcon } from 'lucide-react'

export default function ModalsPage () {
  const { showAlert } = useAlert()
  const [b, setB] = useState(false),
    [c, setC] = useState(false),
    [sc, setSc] = useState(false),
    [st, setSt] = useState(false)
  const [s, setS] = useState({
    sm: false,
    default: false,
    lg: false,
    xl: false,
    full: false
  })
  const [cf, setCf] = useState(false),
    [fm, setFm] = useState(false),
    [n1, setN1] = useState(false),
    [n2, setN2] = useState(false)

  const Card2 = ({
    title,
    desc,
    btn,
    onOpen,
    color = 'var(--pr)',
    icon: Ic
  }: {
    title: string
    desc: string
    btn: string
    onOpen: () => void
    color?: string
    icon: LucideIcon
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className='fc g2'>
          {Ic && <Ic size={17} style={{ color: color as string }} />}
          {title}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onOpen}
          size='sm'
          style={{ background: color as string, boxShadow: 'none' }}
        >
          {btn}
        </Button>
      </CardContent>
    </Card>
  )

  const Modal2 = ({
    open,
    onClose,
    title,
    centered,
    staticBd,
    size,
    children
  }: {
    open: boolean
    onClose: () => void
    title: string
    centered?: boolean
    staticBd?: boolean
    size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
    children: React.ReactNode
  }) => (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      centered={centered}
      staticBd={staticBd}
      size={size}
    >
      {children}
    </Modal>
  )

  return (
    <div className='sy'>
      <div className='gr g-2 g2'>
        <Card2
          title='Basic'
          desc='Standard modal'
          btn='Open Basic'
          onOpen={() => setB(true)}
          icon={Info}
        />
        <Card2
          title='Centered'
          desc='Vertically centered'
          btn='Open Centered'
          onOpen={() => setC(true)}
          color='#7c3aed'
          icon={CircleHelp}
        />
        <Card2
          title='Scrollable'
          desc='Long content'
          btn='Open Scrollable'
          onOpen={() => setSc(true)}
          color='#06b6d4'
          icon={Info}
        />
        <Card2
          title='Static Backdrop'
          desc="Doesn't close on outside click"
          btn='Open Static'
          onOpen={() => setSt(true)}
          color='#f59e0b'
          icon={CircleAlert}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modal Sizes</CardTitle>
          <CardDescription>4 width variants</CardDescription>
        </CardHeader>
        <CardContent className='fc g2' style={{ flexWrap: 'wrap' }}>
          {['sm', 'default', 'lg', 'xl'].map(sz => (
            <Button
              key={sz}
              variant='outline'
              size='sm'
              onClick={() => setS(p => ({ ...p, [sz]: true }))}
            >
              {sz.toUpperCase()}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className='gr g-2 g2'>
        <Card2
          title='Confirmation'
          desc='Destructive action'
          btn='Delete Item'
          onOpen={() => setCf(true)}
          color='#ef4444'
          icon={TriangleAlert}
        />
        <Card2
          title='Form Modal'
          desc='Inline form fields'
          btn='Edit Profile'
          onOpen={() => setFm(true)}
          color='#10b981'
          icon={Settings}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nested Modal</CardTitle>
          <CardDescription>Modal triggering another modal</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setN1(true)} size='sm'>
            Open First Modal
          </Button>
        </CardContent>
      </Card>

      <Modal open={b} onClose={() => setB(false)} title='Welcome'>
        <p>
          This is a basic modal with a title, body, and footer. Click outside or
          press Close to dismiss.
        </p>
      </Modal>

      <Modal
        open={c}
        onClose={() => setC(false)}
        title='Centered Modal'
        centered
      >
        <p>
          This modal is vertically centered in the viewport — useful for
          confirmation prompts.
        </p>
      </Modal>

      <Modal open={sc} onClose={() => setSc(false)} title='Long Content'>
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i} style={{ marginBottom: 14 }}>
            Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Body of the modal scrolls when content overflows
            the max-height.
          </p>
        ))}
      </Modal>

      <Modal
        open={st}
        onClose={() => setSt(false)}
        title='Static Backdrop'
        staticBd
      >
        <p>
          This modal will not close when you click outside. Use the Close
          button.
        </p>
      </Modal>

      {['sm', 'default', 'lg', 'xl', 'full'].map(sz => (
        <Modal
          key={sz}
          open={s[sz as keyof typeof s]}
          onClose={() =>
            setS(p => ({
              ...p,
              [sz as keyof typeof s as 'sm' | 'default' | 'lg' | 'xl' | 'full']:
                false
            }))
          }
          title={`${sz.toUpperCase()} Modal`}
          size={sz as 'sm' | 'default' | 'lg' | 'xl' | 'full'}
        >
          <p>
            Size variant:{' '}
            <code
              style={{
                background: 'var(--mt)',
                padding: '2px 8px',
                borderRadius: 5,
                fontFamily: 'monospace',
                fontWeight: 700
              }}
            >
              {sz}
            </code>
          </p>
        </Modal>
      ))}

      <Modal
        open={cf}
        onClose={() => setCf(false)}
        title='Confirm Deletion'
        footer={
          <>
            <Button variant='outline' size='sm' onClick={() => setCf(false)}>
              Cancel
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => {
                setCf(false)
                showAlert('Deleted!', { variant: 'success' })
              }}
            >
              <Trash2 />
              Delete
            </Button>
          </>
        }
      >
        <div className='fc g3' style={{ alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(239,68,68,.1)',
              color: '#ef4444',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}
          >
            <TriangleAlert size={22} />
          </div>
          <div>
            <h4
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: 'var(--fg)',
                marginBottom: 4
              }}
            >
              Are you sure?
            </h4>
            <p style={{ margin: 0 }}>
              This action cannot be undone. The item will be permanently
              removed.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={fm}
        onClose={() => setFm(false)}
        title='Edit Profile'
        footer={
          <>
            <Button variant='outline' size='sm' onClick={() => setFm(false)}>
              Cancel
            </Button>
            <Button size='sm' onClick={() => setFm(false)}>
              <CircleCheck />
              Save
            </Button>
          </>
        }
      >
        <div style={{ color: 'var(--fg)' }}>
          <div className='fm'>
            <Label>Full Name</Label>
            <Input defaultValue='Arjun Kapoor' />
          </div>
          <div className='fm'>
            <Label>Email</Label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--mt-fg)'
                }}
              />
              <Input
                defaultValue='arjun@nexoraai.com'
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
          <div className='fm'>
            <Label>Bio</Label>
            <Textarea defaultValue='Building beautiful admin templates.' />
          </div>
        </div>
      </Modal>

      <Modal open={n1} onClose={() => setN1(false)} title='First Modal'>
        <p style={{ marginBottom: 14 }}>
          This modal can open another modal on top.
        </p>
        <Button onClick={() => setN2(true)} size='sm'>
          Open Nested Modal
        </Button>
      </Modal>
      <Modal
        open={n2}
        onClose={() => setN2(false)}
        title='Nested Modal'
        size='sm'
        centered
      >
        <p>
          You've successfully opened a nested modal! The first modal stays
          behind it.
        </p>
      </Modal>
    </div>
  )
}
