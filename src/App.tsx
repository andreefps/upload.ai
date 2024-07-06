import { ArrowRight, FileVideo, Github, Upload } from 'lucide-react'
export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b border-neutral">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-square px-1 ">
            <span className="flex items-center gap-2">
              <Github />
            </span>
          </button>
        </div>
      </div>

      <main className="flex-1 flex gap-6 p-6 ">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <textarea
              className="textarea textarea-bordered resize-none leading-relaxed "
              placeholder="Paste your prompt here..."
            />
            <textarea
              className="textarea textarea-bordered resize-none leading-relaxed"
              placeholder="AI generated text will appear here..."
              readOnly
            />
          </div>
          <p>
            Remember that you can use the variable{' '}
            <code className="text-violet-400">{'{transcription}'}</code> in your
            prompt to add the content of transcript from the selected video.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-2">
            <label
              htmlFor="video"
              className="cursor-pointer border rounded-md flex aspect-video border-base-content border-dashed text-sm flex-col gap-2 items-center justify-center text-base-content hover:border-primary hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <FileVideo className="w-4 h-4" />
              Upload video
            </label>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />

            <p className="divider w-full" />

            <div className="space-y-2">
              <label
                htmlFor="transcription_prompt"
                className="text-base-content"
              >
                Transcription prompt
              </label>
              <textarea
                id="transcription_prompt"
                placeholder="Write keywords mentioned in the video separated by comma"
                className="textarea textarea-bordered min-h-20 leading-relaxed w-full"
              />
            </div>
            <button
              id="uploadvideo"
              className="btn btn-primary btn-outline btn-sm w-full"
            >
              Upload Video <Upload className="w-4 h-4" />
            </button>
          </form>
          <p className="divider w-full" />

          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt">Prompt</label>
              <select id="prompt" className="select select-bordered w-full">
                <option value="" disabled selected hidden>
                  Select your prompt
                </option>
                <option value="prompt1">Youtube title</option>
                <option value="prompt2">Youtube description</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="model">Model</label>
              <select
                className="select select-bordered w-full"
                id="model"
                defaultValue="gpt3.5"
                disabled
              >
                <option value="gpt3.5">GPT 3.5 Turbo 16k</option>
              </select>
              <p className="text-xs text-info/80 italic">
                You'll be able to customize the model soon.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="temperature">Temperature</label>
              <input
                id="temperature"
                type="range"
                className="range range-xs range-primary"
                min={0}
                max={1}
                step={0.1}
                value={0.5}
              />
              <span className="text-xs text-info/80 italic">
                Higher values are most likely to give more creative results but
                with possible errors
              </span>
            </div>
            <p className="divider w-full" />
            <button type="submit" className="btn btn-primary w-full btn-md">
              Generate !
            </button>
          </form>
        </aside>
      </main>
    </div>
  )
}
