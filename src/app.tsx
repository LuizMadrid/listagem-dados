import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eraser, FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Header } from './components/header';
import { Pagination } from './components/pagination';
import { Tabs } from './components/tabs';
import { Button } from './components/ui/button';
import { Control, Input } from './components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
	itemsInPage: number
  data: Tag[]
}

export interface Tag {
  title: string
  slug: string
  amountOfVideos: number
  id: string
}

export function App() {
	const [searchParams, setSearchParams] = useSearchParams();
	const urlFilter = searchParams.get('filter') ?? '';
	
	const [filter, setFilter] = useState(urlFilter);

	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

	const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
		queryKey: ['get-tags', urlFilter, page],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`);
			const data = await response.json();

			return data;
		},
		placeholderData: keepPreviousData,
	});

	const havePrev = tagsResponse?.prev !== null;
	const prevCount = tagsResponse?.prev as number * 10;

	const itemsInPage = havePrev ? tagsResponse?.data.length as number + prevCount : tagsResponse?.data.length as number;

	function handleFilter(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		
		setSearchParams(params => {
			params.set('page', '1');
			params.set('filter', filter);

			return params;
		});
	}

	function handleErase(e: FormEvent<HTMLButtonElement>) {
		e.preventDefault();
		
		setSearchParams(params => {
			params.set('page', '1');
			params.set('filter', '');
			setFilter('');

			return params;
		});
	}

	if (isLoading) {
		return;
	}

	return (
		<div className='flex-1 py-10 space-y-8'>
			<div>
				<Header />
				<Tabs />
			</div>
			
			<main className='max-w-6xl mx-auto space-y-5'>
				<div className='flex items-center gap-x-3'>
					<h1 className='text-xl font-bold'>Tags</h1>
					<Button variant='primary'>
						<Plus className='size-3' />
						Create new
					</Button>
				</div>

				<div className='flex items-center justify-between'>
					<form className='flex items-center gap-x-3' onSubmit={handleFilter}>
						<Input variant='filter'>
							<Search className='size-3' />
							<Control 
								placeholder='Search tags...' 
								onChange={e => setFilter(e.target.value)} 
								value={filter} 
							/>
						</Input>

						<Button variant='default' type='submit' className='group'>
							<Filter className='size-3 group-hover:text-teal-400' />
							Filter
						</Button>
						
						{filter && (
							<Button variant='ghost' className='group hover:text-teal-400' onClick={handleErase} type='submit'>
								<Eraser className='size-3 group-hover:text-teal-400' />
								Clear
							</Button>
						)}
					</form>


					<Button variant='default' className='group'>
						<FileDown className='size-3 group-hover:text-teal-400' />
						Export
					</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
							
							<TableHead>
								Tags
							</TableHead>

							<TableHead>
								Amount of videos
							</TableHead>
							
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{tagsResponse?.data.map((tag) => (
							<TableRow key={tag.id}>
								<TableCell></TableCell>

								<TableCell>
									<div className='flex flex-col gap-y-0.5'>
										<span className='font-medium'>{tag.title}</span>
										<span className='text-xs text-zinc-500'>{tag.id}</span>
									</div>
								</TableCell>
							
								<TableCell className='text-zinc-300'>
									{tag.amountOfVideos > 1 ? (
										`${tag.amountOfVideos} videos`
									) : (
										`${tag.amountOfVideos} video`
									)}
								</TableCell>
							
								<TableCell className='text-right'>
									<Button size='icon'>
										<MoreHorizontal className='size-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{tagsResponse && (
					<Pagination pages={tagsResponse?.pages} items={tagsResponse.items} page={page} itemsInPage={itemsInPage} />
				)}
			</main>
		</div>
	);
}
