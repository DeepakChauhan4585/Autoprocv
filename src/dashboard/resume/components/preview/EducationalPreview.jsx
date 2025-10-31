/* eslint-disable react/prop-types */
import { memo } from 'react'

function EducationalPreview({ resumeInfo }) {
  const color = resumeInfo?.themeColor
  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color }}>
        Education
      </h2>
      <hr style={{ borderColor: color }} />

      {resumeInfo?.education?.map((education, index) => (
        <div key={index} className="my-5">
          <h2 className="text-sm font-bold" style={{ color }}>
            {education?.universityName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree} {education?.major ? `in ${education?.major}` : ''}
            <span>
              {education?.startDate} - {education?.endDate}
            </span>
          </h2>
          {education?.description ? (
            <p className="text-xs my-2">{education?.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default memo(EducationalPreview)
