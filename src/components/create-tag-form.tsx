import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import * as Modal from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, CheckCircle2, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './ui/button';

const createTagSchema = z.object({
	title: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

type CreateTagSchema = z.infer<typeof createTagSchema>

function getSlugFromString(input: string): string {
	return  input
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^\w\s]/g, '')
		.replace(/\s+/g, '-');
}

export function CreateTagForm() {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { register, handleSubmit, watch, formState } = useForm<CreateTagSchema>({
		resolver: zodResolver(createTagSchema),
	});

	const slug = watch('title') 
		? getSlugFromString(watch('title')) 
		: '';

	const { mutateAsync } = useMutation({
		mutationFn: async ({ title }: CreateTagSchema) => {
			// delay 1.5s
			await new Promise(resolve => setTimeout(resolve, 1500));

			await fetch('http://localhost:3333/tags', {
				method: 'POST',
				body: JSON.stringify({
					title,
					slug,
					amountOfVideos: 0,
				}),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-tags'],
			});
		}
	});

	async function createTag({ title }: CreateTagSchema) {
		await mutateAsync({ title });

		setIsModalOpen(true);
	}

	function handleCloseModal() {
		window.location.reload();
		setIsModalOpen(false);
	}

	return (
		<>
			<form onSubmit={handleSubmit(createTag)} className="relative flex flex-col justify-between w-full h-full">
				<div className='space-y-6'>
					<div className="space-y-2">
						<label className="block text-sm font-medium" htmlFor="title">Tag name</label>
						<input 
							{...register('title')}
							id="name" 
							type="text" 
							className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
						/>
						{formState.errors?.title && (
							<p className="text-sm text-red-400">{formState.errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium" htmlFor="slug">Slug</label>
						<input 
							id="slug" 
							type="text" 
							readOnly 
							value={slug}
							className="w-full px-3 py-2 text-sm border rounded-lg border-zinc-800 bg-zinc-800/50"
						/>
					</div>
				</div>

				<div className="flex gap-2">
					<Dialog.Close asChild>
						<Button className='flex justify-center w-full text-sm'>
							<X className="size-4" />
            Cancel
						</Button>
					</Dialog.Close>
				
					<Button 
						disabled={formState.isSubmitting} 
						className="flex justify-center w-full text-sm bg-teal-400 text-teal-950" 
						type="submit">
						{formState.isSubmitting 
							? <Loader2 className="size-4 animate-spin" /> 
							: <Check className="size-4" />
						}
          Save
					</Button>
				</div>
			</form>

			<Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
				<Modal.Portal>
					<Modal.Overlay className='fixed inset-0 flex items-center bg-black/40 backdrop-blur-sm'>
						<Modal.Content className='flex flex-col items-center justify-between p-10 mx-auto space-y-10 border rounded-lg w-fit border-zinc-800 bg-zinc-950'>
							<CheckCircle2 className='my-2 text-green-500 size-28' />

							<div className='space-y-3 text-center'>
								<Modal.Title className='text-xl font-bold'>
									Created tag sucefully!
								</Modal.Title>

								<Modal.Description className='text-sm text-zinc-400 max-w-80'>
									Tag has been created successfully. If you want to create another tag, just fill the form again.
								</Modal.Description>
							</div>

							<Modal.Close asChild>
								<Button 
									variant='primary'
									className='flex justify-center w-full py-2 text-sm font-bold text-white uppercase rounded-md' 
									onClick={handleCloseModal}>
									<Check className='size-5' />
									Ok
								</Button>
							</Modal.Close>
						</Modal.Content>
					</Modal.Overlay>
				</Modal.Portal>
			</Modal.Root>
		</>
	);
}