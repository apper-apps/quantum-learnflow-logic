import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const VideoPlayer = ({ 
  src, 
  title, 
  onTimeUpdate,
  onProgress,
  onEnded,
  currentTime = 0,
  duration = 0,
  chapters = []
}) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    onTimeUpdate && onTimeUpdate(currentTime, duration)
  }

  const handleProgress = (e) => {
    const progress = (e.target.currentTime / e.target.duration) * 100
    onProgress && onProgress(progress)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const seekToTime = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
    setControlsTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [controlsTimeout])

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden aspect-video"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={onEnded}
        onLoadedMetadata={() => {
          if (currentTime > 0) {
            seekToTime(currentTime)
          }
        }}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
          >
            <ApperIcon name="Play" className="w-10 h-10 text-white ml-1" />
          </button>
        </motion.div>
      )}

      {/* Video Controls */}
      {showControls && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seekToTime(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
              }}
            />
            
            {/* Chapter Markers */}
            {chapters.length > 0 && (
              <div className="relative mt-1">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
                    style={{ left: `${(chapter.startTime / duration) * 100}%`, top: '-6px' }}
                    onClick={() => seekToTime(chapter.startTime)}
                    title={chapter.title}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors"
              >
                <ApperIcon name={isPlaying ? 'Pause' : 'Play'} className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                >
                  <ApperIcon name={isMuted ? 'VolumeX' : 'Volume2'} className="w-5 h-5" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Playback Speed */}
              <div className="relative group">
                <button className="text-white hover:text-primary transition-colors text-sm">
                  {playbackRate}x
                </button>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col space-y-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          playbackRate === rate ? 'bg-primary text-white' : 'text-white hover:bg-gray-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary transition-colors"
              >
                <ApperIcon name={isFullscreen ? 'Minimize' : 'Maximize'} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VideoPlayer