/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import { useContext, useEffect, useRef, useState, startTransition } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function PersonalDetail({ enabledNext }) {
  const params = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)

  // debounce + first sync flags
  const debounceRef = useRef(null)
  const firstSync = useRef(true)

  // Initialize local form from context
  useEffect(() => {
    const next = {
      firstName: resumeInfo?.firstName ?? '',
      lastName:  resumeInfo?.lastName ?? '',
      jobTitle:  resumeInfo?.jobTitle ?? '',
      address:   resumeInfo?.address ?? '',
      phone:     resumeInfo?.phone ?? '',
      email:     resumeInfo?.email ?? '',
    }

    setFormData((prev) => {
      const same =
        prev.firstName === next.firstName &&
        prev.lastName  === next.lastName  &&
        prev.jobTitle  === next.jobTitle  &&
        prev.address   === next.address   &&
        prev.phone     === next.phone     &&
        prev.email     === next.email
      return same ? prev : next
    })

    firstSync.current = true
  }, [resumeInfo])

  // Cleanup on unmount (clear pending debounce)
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleInputChange = (e) => {
    enabledNext?.(false)
    const { name, value } = e.target

    // local state updates immediately (but cheap)
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Debounced, low-priority sync to global context (for live preview without lag)
    if (firstSync.current) {
      firstSync.current = false
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        setResumeInfo((prev) => ({ ...prev, [name]: value }))
      })
    }, 300)
  }

  const onSave = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Persist all personal fields
      await GlobalApi.UpdateResumeDetail(params?.resumeId, { data: { ...formData } })

      // Ensure context perfectly aligned after save (no-op if already equal)
      startTransition(() => setResumeInfo((prev) => ({ ...prev, ...formData })))

      enabledNext?.(true)
      toast('Details updated')
    } catch (err) {
      console.error(err)
      toast('Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              autoComplete="given-name"
            />
          </div>

          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              autoComplete="family-name"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              autoComplete="street-address"
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PersonalDetail
