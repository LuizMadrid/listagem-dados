import * as Dialog from '@radix-ui/react-dialog';

import { CreateTagForm } from './create-tag-form';

export const DialogTag = () => {
	return (
		<Dialog.Portal>
			<Dialog.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm'>
				<Dialog.Content className='fixed top-0 right-0 flex flex-col justify-between h-full p-10 space-y-10 border-l border-l-zinc-800 bg-zinc-950'>
					<div className='space-y-3'>
						<Dialog.Title className='text-xl font-bold'>
              Create tag
						</Dialog.Title>

						<Dialog.Description className='text-sm text-zinc-400'>
              Tags can be used to group videos about similar concepts.
						</Dialog.Description>
					</div>

					<CreateTagForm />
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Portal>
	);
};
