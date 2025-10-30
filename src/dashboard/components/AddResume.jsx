import { Loader2, PlusSquare } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid'
import GlobalApi from './../../../service/GlobalApi'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onCreate = async () => {
    if (!resumeTitle.trim()) {
      toast('Please enter a title')
      return
    }
    if (!user) {
      toast('You must be signed in')
      return
    }

    setLoading(true)
    const uuid = uuidv4() // यही id route में भी यूज़ करेंगे

    try {
      const payload = {
        data: {
          title: resumeTitle.trim(),
          resumeId: uuid, // public-friendly id
          userEmail: user?.primaryEmailAddress?.emailAddress || '',
          userName: user?.fullName || '',
          themeColor: '#4f46e5',
        },
      }

      // persist (backend या fallback localStorage)
      await GlobalApi.CreateNewResume(payload)

      // पहले dialog बंद, फिर नेविगेट — modal overlay ब्लॉक नहीं करेगा
      setOpenDialog(false)
      // थोड़ी देर बाद नेविगेट करके सुनिश्चित करें कि dialog अनमाउंट हो चुका हो
      setTimeout(() => {
        navigate(`/dashboard/resume/${uuid}/edit`, { replace: false })
      }, 0)
    } catch (e) {
      console.error('Create resume failed:', e)
      toast('Failed to create resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className="p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed"
        onClick={() => setOpenDialog(true)}
        aria-label="Create a new resume"
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input
                className="my-2"
                placeholder="e.g. Student resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>

            <div className="flex justify-end gap-5">
              <Button onClick={() => setOpenDialog(false)} variant="ghost">
                Cancel
              </Button>
              <Button
                disabled={!resumeTitle.trim() || loading}
                onClick={onCreate}
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Create'}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddResume
