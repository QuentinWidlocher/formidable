import clsx from "clsx"

type FormCodeExampleProps = {
  formSlug: string,
  className?: string,
}

export default function FormCodeExample({ formSlug, className = "" }: FormCodeExampleProps) {
  return <div className={clsx("mockup-code sm:shadow-md", className)}>
    <pre data-prefix=" 1"><code>{'<'}<span className="text-red-400">form</span> <span className="text-orange-300">action</span>=<span className="text-green-300">"https://formidable.site/<em>{formSlug}</em>"</span> <span className="text-orange-300">method</span>=<span className="text-green-300">"post"</span>{'>'}</code></pre>
    <pre data-prefix=" 2"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix=" 3"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"from"</span>{'>'}Your email{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
    <pre data-prefix=" 4"><code>{'\t\t<'}<span className="text-red-400">input</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"from"</span> <span className="text-orange-300">type</span>=<span className="text-green-300">"email"</span>{'/>'}</code></pre>
    <pre data-prefix=" 5"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix=" 6"></pre>
    <pre data-prefix=" 7"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix=" 8"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"object"</span>{'>'}What's this about ?{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
    <pre data-prefix=" 9"><code>{'\t\t<'}<span className="text-red-400">input</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"object"</span> <span className="text-orange-300">type</span>=<span className="text-green-300">"text"</span>{'/>'}</code></pre>
    <pre data-prefix="10"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix="11"></pre>
    <pre data-prefix="12"><code>{'\t<'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix="13"><code>{'\t\t<'}<span className="text-red-400">label</span> <span className="text-orange-300">for</span>=<span className="text-green-300">"content"</span>{'>'}Your message{'</'}<span className="text-red-400">label</span>{'>'}</code></pre>
    <pre data-prefix="14"><code>{'\t\t<'}<span className="text-red-400">textarea</span> <span className="text-orange-300">name</span>=<span className="text-green-300">"content"</span>{'/>'}</code></pre>
    <pre data-prefix="15"><code>{'\t</'}<span className="text-red-400">div</span>{'>'}</code></pre>
    <pre data-prefix="16"><code>{'</'}<span className="text-red-400">form</span>{'>'}</code></pre>
  </div>
}