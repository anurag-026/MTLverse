export default function ReaderControls({ 
  onPrevious, 
  onNext, 
  onToggleFullscreen, 
  onToggleDirection,
  isFullscreen = false,
  direction = 'vertical'
}) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white p-4 rounded-lg flex items-center space-x-4">
      <button
        onClick={onPrevious}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Next
      </button>
      <button
        onClick={onToggleDirection}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
      >
        {direction === 'vertical' ? 'Horizontal' : 'Vertical'}
      </button>
      <button
        onClick={onToggleFullscreen}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
}
