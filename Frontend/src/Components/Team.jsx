import React from 'react'

const Team = () => {
  return (

    <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-16 md:py-20 mx-auto">
            <div className="flex flex-col gap-2 text-center w-full mb-12">
                <h1 className="sm:text-4xl text-3xl font-medium title-font font-mono mb-6 text-white">Our Team</h1>
                <p className="lg:w-2/3 font-mono mx-auto leading-relaxed text-base">"Meet the brilliant minds working tirelessly to bring your favourite films to your fingertips. With a blend of technical expertise and passion for cinema, we have created a system to make your movie discovery effortless and exciting."</p>
            </div>

            <div className="flex flex-wrap -m-2">
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/rishov_sir.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Assistant Prof. Rishov Saha</h2>
                            <p className="text-gray-600">Team Mentor</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/photo.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Ritarshi Chakraborty</h2>
                            <p className="text-gray-600">Full-Stack Developer</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/ayan.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Ayan De</h2>
                            <p className="text-gray-600">Back-End Developer</p>
                        </div>
                    </div>
                </div>

                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/souvik.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Souvik Mondal</h2>
                            <p className="text-gray-600">Front-End Developer</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/sovan.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Sovan Bakshi</h2>
                            <p className="text-gray-600">Back-End Developer</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-700 border p-4 rounded-lg">
                        <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="/ujjal.jpg"/>
                        <div className="flex-grow">
                            <h2 className="text-white title-font font-medium">Ujjal Manna</h2>
                            <p className="text-gray-600">Front-End Developer</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
    
  )
}

export default Team