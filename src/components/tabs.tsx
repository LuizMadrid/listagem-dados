import { Code2, ListVideo, Settings, Tags } from 'lucide-react';

export function Tabs() {
	return (
		<div className="py-4 border-b border-zinc-800">
			<nav className="flex items-center gap-2 max-w-[1200px] mx-auto">
				<a href="" className="py-1.5 px-3 bg-zinc-800 text-zinc-100 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent">
					<ListVideo className="text-teal-400 size-4" />
          Uploads
				</a>

				<a href="" className="py-1.5 px-3 text-zinc-300 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent hover:border-zinc-800 group">
					<Tags className="size-4 group-hover:text-teal-400" />
          Tags
				</a>

				<a href="" className="py-1.5 px-3 text-zinc-300 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent hover:border-zinc-800 group">
					<Settings className="size-4 group-hover:text-teal-400" />
          Settings
				</a>

				<a href="" className="py-1.5 px-3 text-zinc-300 inline-flex items-center text-sm gap-1.5 font-medium rounded-full border border-transparent hover:border-zinc-800 group">
					<Code2 className="size-4 group-hover:text-teal-400" />
          Developers
				</a>
			</nav>
		</div>
	);
}