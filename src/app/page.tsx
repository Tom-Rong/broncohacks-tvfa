import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: '✍️',
      title: 'Your Notes, Your Style',
      description: 'Write notes in your own style. The AI learns how you think and understand concepts.',
      href: '/my-notes',
      color: 'bg-purple-50 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Generation',
      description: 'Paste lecture text, upload audio recordings, or record live lectures. Get notes in YOUR style.',
      href: '/generate',
      color: 'bg-blue-50 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: '📚',
      title: 'Lecture Library',
      description: 'Browse lectures uploaded by students and teachers. Convert any lecture into your personalized notes.',
      href: '/lectures',
      color: 'bg-green-50 border-green-200',
      btnColor: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Note<span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered note-taking that adapts to <em>your</em> unique style. 
          Turn any lecture into notes that feel like <em>you</em> wrote them.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/generate" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg">
            Generate Notes →
          </Link>
          <Link href="/my-notes" className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors text-lg">
            My Notes
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-indigo-600">1</div>
            <h3 className="font-semibold text-lg mb-2">Train Your Style</h3>
            <p className="text-gray-600">Add a few of your own notes so the AI learns your writing style and level of detail.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-indigo-600">2</div>
            <h3 className="font-semibold text-lg mb-2">Input a Lecture</h3>
            <p className="text-gray-600">Paste lecture text, upload a recording, use live audio, or choose from the lecture library.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-indigo-600">3</div>
            <h3 className="font-semibold text-lg mb-2">Get Your Notes</h3>
            <p className="text-gray-600">Receive beautifully formatted notes that match your unique style and understanding.</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(feature => (
          <div key={feature.href} className={`rounded-2xl border-2 p-8 ${feature.color} flex flex-col`}>
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600 mb-6 flex-1">{feature.description}</p>
            <Link href={feature.href} className={`${feature.btnColor} text-white text-center py-2 px-6 rounded-lg font-medium transition-colors`}>
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
