import { Suspense } from 'react'
import UserRolesContent from './UserRolesContent'

export default function Page () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserRolesContent />
    </Suspense>
  )
}
