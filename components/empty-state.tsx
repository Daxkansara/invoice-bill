import Image from "next/image"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Image
        src="https://sjc.microlink.io/3vgeEJpRAzEtDrZKeg4v7C3u3yicSXw8faCmIPasXZvgjnE7NmASugYP5PX9ny59zjn87ZnAHVV9AW7K0IYeDQ.jpeg"
        alt="Empty state illustration"
        width={241}
        height={200}
        className="mb-10"
      />
      <h2 className="text-2xl font-bold mb-6">અહીં કંઈ નથી</h2>
      <p className="text-[#888EB0]">
        શરૂ કરવા માટે <span className="font-bold">નવું ઇનવોઇસ</span> બટન પર ક્લિક કરીને ઇનવોઇસ બનાવો
      </p>
    </div>
  )
}

