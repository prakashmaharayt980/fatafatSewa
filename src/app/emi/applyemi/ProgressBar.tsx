import React from 'react'

const ProgressBar = ({ currentstep }) => {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 lg:space-x-8 w-full max-w-4xl">
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep <= 0 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        1
                    </div>
                    <span className="ml-2 text-sm text-gray-600 hidden lg:block">Start</span>
                </div>
                <div className={`flex-1 h-1 ${(currentstep >= 1) ? 'bg-[var(--colour-fsP1)]' : "bg-gray-300"}  mx-0 `}></div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep >= 1 && currentstep < 3 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        2
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900 hidden lg:block">Details</span>
                </div>
                <div className={`flex-1 h-1 ${currentstep === 3 ? 'bg-[var(--colour-fsP1)]' : "bg-gray-300"}  mx-0 `}></div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep === 3 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        3
                    </div>
                    <span className="ml-2 text-sm text-gray-600 hidden lg:block">Submit</span>
                </div>
            </div>
        </div>


    )
}

export default ProgressBar
