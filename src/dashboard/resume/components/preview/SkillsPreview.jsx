/* eslint-disable react/prop-types */
import { memo } from 'react'

function SkillsPreview({ resumeInfo }) {
  const color = resumeInfo?.themeColor
  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color }}>
        Skills
      </h2>
      <hr style={{ borderColor: color }} />

      <div className="grid grid-cols-2 gap-3 my-4">
        {resumeInfo?.skills?.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <h2 className="text-xs">{skill?.name}</h2>
            <div className="h-2 bg-gray-200 w-[120px] rounded">
              <div
                className="h-2 rounded"
                style={{
                  backgroundColor: color,
                  width: `${Math.min(100, Math.max(0, (skill?.rating ?? 0) * 20))}%`,
                  transition: 'width 200ms ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(SkillsPreview)
