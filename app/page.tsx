"use client";
import { getWordCount, getSentenceCount, getCharacterCount, getAverageWordLength, getTextArea } from "./utils/stats";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-8 md:py-16 md:px-16 px-4 bg-white dark:bg-black sm:items-start">
        <div className="uppercase text-2xl font-ibm-sans font-bold tracking-wide text-foreground dark:text-background">
          <span className="-tracking-widest">tex</span>vision
        </div>
        <div className="grid-cols-1 md:grid-cols-2 grid gap-4 md:gap-32">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <div className="relative">
              <button
                type="button"
                className="p-16 bg-zinc-100 rounded-sm border border-dashed border-foreground/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:border-foreground/60 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="currentColor"
                  className="text-foreground"
                >
                  <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                </svg>
              </button>

              <input
                type="file"
                accept="image/png, image/jpeg"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => console.log(e.target.files)}
              />
            </div>

            <h1 className="max-w-sm md:text-lg text-xs font-light leading-tight text-black dark:text-zinc-50">
              To get started, upload an image containing minimum 20 lines of text of your mother tongue with five different fonts (font-size: 11).
            </h1>
            <button className="h-12 rounded-sm bg-foreground md:px-5 px-8 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-40">
              Stats
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <textarea
              readOnly
              className="h-84 w-full pointer-events-none resize-none rounded-sm border border-foreground/30 bg-zinc-100 p-4 text-sm leading-relaxed text-foreground dark:bg-zinc-900 dark:border-foreground/60 dark:text-foreground"
              value={getTextArea("Sample text")}
            >
            </textarea>
            <button className="h-12 rounded-sm border border-solid border-black/8 md:px-5 px-8 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-40">
              Download
            </button>
          </div>

        </div>

        <div className="flex flex-col gap-4 text-base font-medium">

          <table className="text-sm text-foreground/60">
            <tbody>
              <tr>
                <th className="pr-4 text-left">No. of Words</th>
                <th className="pr-4 text-left">No. of Sentences</th>
                <th className="pr-4 text-left">No. of Characters</th>
                <th className="pr-4 text-left">Average Word Length</th>
              </tr>
              <tr>
              </tr>
              <tr>
                <td className="text-center">{getWordCount("Sample text")}</td>
                <td className="text-center">{getSentenceCount("Sample text")}</td>
                <td className="text-center">{getCharacterCount("Sample text")}</td>
                <td className="text-center">{getAverageWordLength("Sample text")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
