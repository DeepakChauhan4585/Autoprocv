import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Brain, LoaderCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import {
  BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList,
  BtnStrikeThrough, BtnUnderline, Editor, EditorProvider, Separator, Toolbar
} from 'react-simple-wysiwyg'
import { AIChatSession } from './../../../../service/AIModal'
import { toast } from 'sonner'
import PropTypes from 'prop-types'

const PROMPT =
  'position title: {positionTitle}. Based on this role, write 5-7 concise bullet points for resume experience. Use plain HTML list, no JSON, no experience level.'

function RichTextEditor({ onRichTextEditorChange, index, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)
  const { resumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setValue(defaultValue || '')
  }, [defaultValue])

  const GenerateSummeryFromAI = async () => {
    const title = resumeInfo?.Experience?.[index]?.title
    if (!title) {
      toast('Please add Position Title')
      return
    }

    try {
      setLoading(true)
      const prompt = PROMPT.replace('{positionTitle}', title)
      const result = await AIChatSession.sendMessage(prompt)
      const resp = result?.response?.text?.() || ''
      const cleaned = resp.replace(/^\[/, '').replace(/\]$/, '')
      setValue(cleaned)
      onRichTextEditorChange({ target: { value: cleaned } })
    } catch (e) {
      console.error(e)
      toast('Something went wrong while generating summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : (<><Brain className="h-4 w-4" /> Generate from AI</>)}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onRichTextEditorChange(e)
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}

RichTextEditor.propTypes = {
  onRichTextEditorChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  defaultValue: PropTypes.string
}

export default RichTextEditor
