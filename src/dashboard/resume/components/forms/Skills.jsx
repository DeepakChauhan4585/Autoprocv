import { Input } from '@/components/ui/input'
import { useContext, useEffect, useRef, useState, useTransition } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

// local debounce
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  const t = useRef()
  useEffect(() => {
    clearTimeout(t.current)
    t.current = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t.current)
  }, [value, delay])
  return debounced
}

function Skills() {
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }])
  const { resumeId } = useParams()
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [isPending, startTransition] = useTransition()

  // hydrate once from context
  useEffect(() => {
    if (resumeInfo?.skills?.length) setSkillsList(resumeInfo.skills)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (index, name, value) => {
    setSkillsList((prev) => {
      const copy = prev.slice()
      copy[index] = { ...copy[index], [name]: value }
      return copy
    })
  }

  const AddNewSkills = () => {
    setSkillsList((prev) => [...prev, { name: '', rating: 0 }])
  }

  const RemoveSkills = () => {
    setSkillsList((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const onSave = () => {
    setLoading(true)

    const sanitized = skillsList.map((entry) => {
      const rest = { ...entry }
      delete rest.id
      return rest
    })

    const data = { data: { skills: sanitized } }

    GlobalApi.UpdateResumeDetail(resumeId, data)
      .then(() => {
        setLoading(false)
        toast('Details updated !')
      })
      .catch(() => {
        setLoading(false)
        toast('Server Error, Try again!')
      })
  }

  // debounced context sync
  const debouncedSkills = useDebouncedValue(skillsList, 400)
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: debouncedSkills,
    }))
  }, [debouncedSkills, setResumeInfo])

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p className="text-sm text-muted-foreground">Add Your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 border rounded-lg p-3"
          >
            <div className="w-full sm:w-auto">
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                value={item.name ?? ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 160 }}
              value={item.rating ?? 0}
              onChange={(v) => startTransition(() => handleChange(index, 'rating', v))}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkills} className="text-primary">
            + Add More Skill
          </Button>
          <Button variant="outline" onClick={RemoveSkills} className="text-primary">
            - Remove
          </Button>
        </div>
        <Button disabled={loading || isPending} onClick={onSave} className="w-full sm:w-auto">
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Skills
