import Image from 'next/image';

export default function Page() {
	return (
		<div className='relative flex min-h-svh w-full items-center justify-center'>
			<div
				className='absolute inset-0 z-0'
				style={{
					backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
					backgroundSize: '20px 20px',
					backgroundPosition: '0 0, 0 0',
					maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
					WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
					maskComposite: 'intersect',
					WebkitMaskComposite: 'source-in',
				}}
			/>

			<div className='relative z-50 mt-6 ml-2'>
				<Image
					src={'/kanat.jpg'}
					width={312}
					height={312}
					className='size-78 rounded-md object-cover shadow-md'
					alt='Сыдыков Канат'
				/>
			</div>
		</div>
	);
}
