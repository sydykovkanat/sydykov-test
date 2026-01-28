import Image from 'next/image';

export default function Page() {
	return (
		<div className='mx-auto flex h-screen max-w-lg flex-col justify-center p-4'>
			<Image
				src={'/kanat.jpeg'}
				alt='Kanat'
				width={300}
				height={300}
				className='mb-4 h-auto w-full rounded-lg'
			/>

			<p>
				Hello! I&apos;m Kanat Sydykov, a passionate software developer with a
				love for creating innovative solutions. Welcome to my personal website!
			</p>
		</div>
	);
}
