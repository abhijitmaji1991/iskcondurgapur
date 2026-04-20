'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPrayingHands, FaBell, FaSpa, FaHandHolding, FaHeart, FaOm, FaBook, FaVideo, FaUsers } from 'react-icons/fa';

const worshipSteps = [
	{
		id: 1,
		title: 'Morning Worship',
		time: '4:30 AM - 5:00 AM',
		rituals: [
			{
				name: 'Mangala Arati',
				description: 'Early morning worship of the Deities with various offerings',
				items: ['Incense', 'Ghee lamp', 'Flowers', 'Water', 'Fan', 'Cloth'],
				instructions: [
					'Begin with purification mantras',
					'Light the ghee lamp and incense',
					'Offer flowers with devotion',
					'Wave the lamp in circular motion',
					'Fan the Deities with respect',
				],
			},
		],
	},
	{
		id: 2,
		title: 'Deity Greeting',
		time: '7:00 AM - 7:30 AM',
		rituals: [
			{
				name: 'Darshan Arati',
				description: 'Morning greeting of the Deities with fresh offerings',
				items: ['Fresh flowers', 'Fresh fruits', 'Bhoga', 'Water'],
				instructions: [
					'Offer fresh morning prayers',
					'Present new flowers and garlands',
					'Offer fresh breakfast bhoga',
					'Sing morning prayers and kirtans',
				],
			},
		],
	},
	{
		id: 3,
		title: 'Evening Worship',
		time: '6:30 PM - 7:00 PM',
		rituals: [
			{
				name: 'Sandhya Arati',
				description: 'Evening offering of lamps and prayers',
				items: ['Incense', 'Ghee lamp', 'Fresh flowers', 'Chamar'],
				instructions: [
					'Light the evening lamps',
					'Offer evening prayers',
					'Wave the arati lamp',
					'Sing evening bhajans',
				],
			},
		],
	},
];

export default function DailyWorshipPage() {
	const [selectedStep, setSelectedStep] = useState(0);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="relative py-4 flex items-center justify-center">
				<div className="absolute inset-0">
					<Image
						src="/images/temple-altar.jpg"
						alt="Temple Altar"
						fill
						className="object-cover brightness-50"
						priority
					/>
				</div>
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Worship</h1>
					<p className="text-xl max-w-2xl mx-auto">
						Learn the art of Deity worship and daily spiritual practices
					</p>
				</div>
			</section>

			{/* Main Content */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					{/* Steps Navigation */}
					<div className="flex flex-wrap justify-center gap-4 mb-12">
						{worshipSteps.map((step, index) => (
							<button
								key={step.id}
								onClick={() => setSelectedStep(index)}
								className={`px-6 py-3 rounded-lg transition-all ${selectedStep === index
									? 'bg-iskcon-orange text-white'
									: 'bg-white text-gray-700 hover:bg-gray-100'
									}`}
							>
								{step.title}
							</button>
						))}
					</div>

					{/* Selected Step Content */}
					<motion.div
						key={selectedStep}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="bg-white rounded-lg shadow-lg p-8"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-800">
								{worshipSteps[selectedStep].title}
							</h2>
							<span className="text-iskcon-orange font-medium">
								{worshipSteps[selectedStep].time}
							</span>
						</div>

						{worshipSteps[selectedStep].rituals.map((ritual, index) => (
							<div key={index} className="space-y-6">
								<h3 className="text-xl font-semibold text-iskcon-orange">
									{ritual.name}
								</h3>
								<p className="text-gray-600">{ritual.description}</p>

								{/* Required Items */}
								<div className="bg-gray-50 p-6 rounded-lg">
									<h4 className="font-semibold mb-4 flex items-center">
										<FaHandHolding className="text-iskcon-orange mr-2" />
										Required Items
									</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{ritual.items.map((item, i) => (
											<div key={i} className="flex items-center">
												<FaOm className="text-iskcon-orange mr-2" />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>

								{/* Instructions */}
								<div className="bg-gray-50 p-6 rounded-lg">
									<h4 className="font-semibold mb-4 flex items-center">
										<FaPrayingHands className="text-iskcon-orange mr-2" />
										Step-by-Step Instructions
									</h4>
									<ol className="space-y-3">
										{ritual.instructions.map((instruction, i) => (
											<li key={i} className="flex items-start">
												<span className="bg-iskcon-orange text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
													{i + 1}
												</span>
												<span>{instruction}</span>
											</li>
										))}
									</ol>
								</div>
							</div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Additional Resources */}
			<section className="bg-white py-16">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Additional Resources
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6">
							<FaBook className="text-4xl text-iskcon-orange mx-auto mb-4" />
							<h3 className="text-xl font-bold mb-2">Temple Worship Guide</h3>
							<p className="text-gray-600">
								Download our comprehensive guide to temple worship
							</p>
							<a
								href="#"
								className="text-iskcon-orange hover:underline mt-2 inline-block"
							>
								Learn More
							</a>
						</div>
						<div className="text-center p-6">
							<FaVideo className="text-4xl text-iskcon-orange mx-auto mb-4" />
							<h3 className="text-xl font-bold mb-2">Video Tutorials</h3>
							<p className="text-gray-600">
								Watch detailed tutorials on proper worship procedures
							</p>
							<a
								href="#"
								className="text-iskcon-orange hover:underline mt-2 inline-block"
							>
								Watch Now
							</a>
						</div>
						<div className="text-center p-6">
							<FaUsers className="text-4xl text-iskcon-orange mx-auto mb-4" />
							<h3 className="text-xl font-bold mb-2">One-on-One Training</h3>
							<p className="text-gray-600">
								Schedule personal training with experienced devotees
							</p>
							<a
								href="#"
								className="text-iskcon-orange hover:underline mt-2 inline-block"
							>
								Schedule
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
