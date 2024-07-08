import { Github } from 'lucide-react'

export const Header = () => {
  return (
    <div className="px-6 py-3 flex items-center justify-between border-b border-neutral">
      <h1 className="text-xl font-bold">upload.ai</h1>
      <div className="flex items-center gap-3">
        <button
          className="btn btn-ghost btn-circle px-1 "
          onClick={() =>
            window.open('http://github.com/andreefps/upload.ai', 'blank')
          }
        >
          <span className="flex items-center gap-2">
            <Github />
          </span>
        </button>
      </div>
    </div>
  )
}
