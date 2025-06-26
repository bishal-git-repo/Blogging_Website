import Banner from "./Banner";
import missionImage from '../assets/mission.jpg';
import vissionImage from '../assets/vission.jpg';

function About() {
  return (
    <>
    <Banner/>
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen py-12">
      <div className="container mx-auto text-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Our Blog</h1>
        <p className="text-xl sm:text-2xl mb-8">
          Welcome to our blog! Here, we share insights, articles, and tutorials on a variety of topics ranging from
          technology, web development, and trends in the digital world.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <img
              src={missionImage}
              alt="Technology"
              className="w-full h-auto rounded-lg shadow-xl"
            />
            <h3 className="text-2xl font-semibold mt-4">Our Mission</h3>
            <p className="text-lg text-gray-200 mt-2">
              Our mission is to help developers, learners, and professionals stay up-to-date with the latest
              developments in tech. We focus on building strong community-driven content and sharing helpful resources.
            </p>
          </div>
          <div>
            <img
              src={vissionImage}
              alt="Coding"
              className="w-full h-auto rounded-lg shadow-xl"
            />
            <h3 className="text-2xl font-semibold mt-4">Why Read Our Blog?</h3>
            <p className="text-lg text-gray-200 mt-2">
              Our blog features clear, concise tutorials, guides, and articles written by experts. Whether you're a
              beginner or an advanced user, you'll find valuable insights here that will help you grow in your career.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/"
            className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
    </>
  );
}

export default About;
