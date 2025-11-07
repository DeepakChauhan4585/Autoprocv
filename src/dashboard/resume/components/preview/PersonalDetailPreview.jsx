/* eslint-disable react/prop-types */
import { memo } from 'react'

function PersonalDetailPreview({ resumeInfo }) {
  const color = resumeInfo?.themeColor
  const jobTitle = String(resumeInfo?.jobTitle ?? '').trim()
  const address  = String(resumeInfo?.address ?? '').trim()

  return (
    <header className="mb-3">
      <h1 className="font-bold text-xl text-center leading-tight" style={{ color }}>
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h1>

      {(jobTitle || address) && (
        <div className="text-center">
          {jobTitle && <p className="text-sm font-medium">{jobTitle}</p>}
          {address && (
            <p className="text-xs" style={{ color }}>
              {address}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between text-xs mt-2">
        <span style={{ color }}>{resumeInfo?.phone}</span>
        <span style={{ color }}>{resumeInfo?.email}</span>
      </div>

      <hr className="border-[1.5px] my-2" style={{ borderColor: color }} />
    </header>
  )
}

export default memo(PersonalDetailPreview)
